import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { parseQuery, scoreJob, extractValidJSON, type Job, type ScoredJob } from "./searchEngine";

// Tool definitions for Claude
const tools = [
  {
    name: "list_jobs",
    description: "List all job postings. Returns job titles, companies, statuses, and IDs.",
    input_schema: {
      type: "object" as const,
      properties: {
        status: {
          type: "string",
          enum: ["open", "closed", "draft"],
          description: "Optional filter by job status",
        },
      },
      required: [],
    },
  },
  {
    name: "create_job",
    description: "Create a new job posting",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Job title" },
        company: { type: "string", description: "Company name" },
        description: { type: "string", description: "Job description" },
        requirements: {
          type: "array",
          items: { type: "string" },
          description: "List of job requirements",
        },
        location: { type: "string", description: "Job location" },
        salary: { type: "string", description: "Salary range" },
        type: {
          type: "string",
          enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
          description: "Job type",
        },
        benefits: { type: "string", description: "Benefits and perks" },
        isRemote: { type: "boolean", description: "Whether the job is remote" },
        status: {
          type: "string",
          enum: ["open", "draft"],
          description: "Job status (open = published, draft = hidden)",
        },
      },
      required: ["title", "company", "description"],
    },
  },
  {
    name: "update_job",
    description: "Update an existing job posting",
    input_schema: {
      type: "object" as const,
      properties: {
        jobId: { type: "string", description: "The job ID to update" },
        title: { type: "string", description: "New job title" },
        company: { type: "string", description: "New company name" },
        description: { type: "string", description: "New job description" },
        requirements: {
          type: "array",
          items: { type: "string" },
          description: "New list of requirements",
        },
        location: { type: "string", description: "New location" },
        salary: { type: "string", description: "New salary range" },
        type: { type: "string", description: "New job type" },
        benefits: { type: "string", description: "New benefits" },
        isRemote: { type: "boolean", description: "Whether remote" },
        status: {
          type: "string",
          enum: ["open", "closed", "draft"],
          description: "New status",
        },
      },
      required: ["jobId"],
    },
  },
  {
    name: "delete_job",
    description: "Delete a job posting",
    input_schema: {
      type: "object" as const,
      properties: {
        jobId: { type: "string", description: "The job ID to delete" },
      },
      required: ["jobId"],
    },
  },
  {
    name: "list_applications",
    description: "List applications, optionally filtered by job",
    input_schema: {
      type: "object" as const,
      properties: {
        jobId: { type: "string", description: "Optional job ID to filter by" },
      },
      required: [],
    },
  },
  {
    name: "update_application_status",
    description: "Update the status of a job application",
    input_schema: {
      type: "object" as const,
      properties: {
        applicationId: { type: "string", description: "The application ID" },
        status: {
          type: "string",
          enum: ["pending", "reviewed", "shortlisted", "rejected"],
          description: "New application status",
        },
        notes: { type: "string", description: "Optional notes about the application" },
      },
      required: ["applicationId", "status"],
    },
  },
  {
    name: "get_dashboard_stats",
    description: "Get statistics for the employer dashboard (total jobs, applications, candidates)",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

// Internal queries and mutations for tool execution
export const _listJobs = internalQuery({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let jobs;
    if (args.status) {
      jobs = await ctx.db
        .query("jobs")
        .withIndex("by_status", (q) => q.eq("status", args.status as "open" | "closed" | "draft"))
        .collect();
    } else {
      jobs = await ctx.db.query("jobs").collect();
    }
    return jobs.map((job) => ({
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      status: job.status,
      isRemote: job.isRemote,
      createdAt: job.createdAt,
    }));
  },
});

export const _createJob = internalMutation({
  args: {
    title: v.string(),
    company: v.string(),
    description: v.string(),
    requirements: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
    type: v.optional(v.string()),
    benefits: v.optional(v.string()),
    isRemote: v.optional(v.boolean()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("jobs", {
      title: args.title,
      company: args.company,
      description: args.description,
      requirements: args.requirements || [],
      location: args.location,
      salary: args.salary,
      type: args.type,
      benefits: args.benefits,
      isRemote: args.isRemote,
      status: (args.status as "open" | "closed" | "draft") || "draft",
      createdAt: Date.now(),
    });
    return { jobId, message: `Job "${args.title}" created successfully` };
  },
});

export const _updateJob = internalMutation({
  args: {
    jobId: v.id("jobs"),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
    type: v.optional(v.string()),
    benefits: v.optional(v.string()),
    isRemote: v.optional(v.boolean()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { jobId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(jobId, filtered);
    return { message: `Job updated successfully` };
  },
});

export const _deleteJob = internalMutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.jobId);
    return { message: "Job deleted successfully" };
  },
});

export const _listApplications = internalQuery({
  args: { jobId: v.optional(v.id("jobs")) },
  handler: async (ctx, args) => {
    let applications;
    if (args.jobId) {
      applications = await ctx.db
        .query("applications")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId!))
        .collect();
    } else {
      applications = await ctx.db.query("applications").collect();
    }

    // Enrich with candidate and job info
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const candidate = await ctx.db.get(app.candidateId);
        const job = await ctx.db.get(app.jobId);
        return {
          id: app._id,
          status: app.status,
          notes: app.notes,
          createdAt: app.createdAt,
          candidateName: candidate?.name || "Unknown",
          candidateEmail: candidate?.email,
          jobTitle: job?.title || "Unknown",
        };
      })
    );
    return enriched;
  },
});

export const _updateApplicationStatus = internalMutation({
  args: {
    applicationId: v.id("applications"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      status: args.status as "pending" | "reviewed" | "shortlisted" | "rejected",
    };
    if (args.notes) {
      updates.notes = args.notes;
    }
    await ctx.db.patch(args.applicationId, updates);
    return { message: "Application status updated" };
  },
});

export const _getDashboardStats = internalQuery({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").collect();
    const applications = await ctx.db.query("applications").collect();
    const candidates = await ctx.db.query("candidates").collect();

    const openJobs = jobs.filter((j) => j.status === "open").length;
    const pendingApplications = applications.filter((a) => a.status === "pending").length;

    return {
      totalJobs: jobs.length,
      openJobs,
      draftJobs: jobs.filter((j) => j.status === "draft").length,
      totalApplications: applications.length,
      pendingApplications,
      reviewedApplications: applications.filter((a) => a.status === "reviewed").length,
      shortlistedApplications: applications.filter((a) => a.status === "shortlisted").length,
      totalCandidates: candidates.length,
    };
  },
});

export const _saveMessage = internalMutation({
  args: {
    participantId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("conversations", {
      participantId: args.participantId,
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    });
  },
});

export const _getConversationHistory = internalQuery({
  args: { participantId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("conversations")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .order("asc")
      .collect();

    const limited = args.limit ? messages.slice(-args.limit) : messages;
    return limited.map((m) => ({
      role: m.role,
      content: m.content,
    }));
  },
});

// Types for Claude API
interface ClaudeMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[];
}

interface ContentBlock {
  type: string;
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
}

interface ClaudeResponse {
  content: ContentBlock[];
  stop_reason: string;
}

// Main chat action
export const chat = action({
  args: {
    message: v.string(),
    conversationId: v.string(),
  },
  handler: async (ctx, args): Promise<{ response: string }> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    // Save user message
    await ctx.runMutation(internal.aiAgent._saveMessage, {
      participantId: args.conversationId,
      role: "user",
      content: args.message,
    });

    // Get conversation history
    const history: Array<{ role: string; content: string }> = await ctx.runQuery(
      internal.aiAgent._getConversationHistory,
      {
        participantId: args.conversationId,
        limit: 20,
      }
    );

    // Build messages for Claude
    const messages: ClaudeMessage[] = history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    }));

    // Call Claude API
    let response: Response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `You are a helpful AI assistant for an employer using a hiring platform called Cepat Hire. You can help them manage job postings, review applications, and get insights about their hiring activities.

Be concise and friendly. When performing actions, confirm what you did. If you need more information to complete a task, ask for it.

Current date: ${new Date().toLocaleDateString()}`,
        messages,
        tools,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Claude API error:", error);
      throw new Error(`Claude API error: ${response.status}`);
    }

    let result: ClaudeResponse = await response.json();

    // Handle tool calls
    while (result.stop_reason === "tool_use") {
      const toolUseBlocks = result.content.filter(
        (block) => block.type === "tool_use"
      );

      const toolResults = [];

      for (const toolUse of toolUseBlocks) {
        let toolResult;
        try {
          toolResult = await executeTool(
            ctx,
            toolUse.name!,
            toolUse.input || {}
          );
        } catch (error) {
          toolResult = { error: String(error) };
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: JSON.stringify(toolResult),
        });
      }

      // Continue conversation with tool results
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: `You are a helpful AI assistant for an employer using a hiring platform called Cepat Hire. You can help them manage job postings, review applications, and get insights about their hiring activities.

Be concise and friendly. When performing actions, confirm what you did. If you need more information to complete a task, ask for it.

Current date: ${new Date().toLocaleDateString()}`,
          messages: [
            ...messages,
            { role: "assistant", content: result.content },
            { role: "user", content: toolResults },
          ],
          tools,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Claude API error:", error);
        throw new Error(`Claude API error: ${response.status}`);
      }

      result = await response.json();
    }

    // Extract text response
    const textBlock = result.content.find((block) => block.type === "text");
    const assistantMessage: string =
      textBlock?.text || "I apologize, I couldn't generate a response.";

    // Save assistant message
    await ctx.runMutation(internal.aiAgent._saveMessage, {
      participantId: args.conversationId,
      role: "assistant",
      content: assistantMessage,
    });

    return { response: assistantMessage };
  },
});

// ==================== SEEKER AI AGENT ====================

const seekerTools = [
  {
    name: "search_jobs",
    description: "Search for jobs based on criteria like title, location, job type, salary range",
    input_schema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "Job title or keyword to search" },
        location: { type: "string", description: "Location filter" },
        jobType: { type: "string", description: "Job type (Part-time, Full-time, Contract, etc.)" },
        minSalary: { type: "number", description: "Minimum salary/hour" },
      },
      required: [],
    },
  },
  {
    name: "apply_to_job",
    description: "Apply to a specific job by job ID",
    input_schema: {
      type: "object" as const,
      properties: {
        jobId: { type: "string", description: "The job ID to apply to" },
      },
      required: ["jobId"],
    },
  },
  {
    name: "auto_apply_matching_jobs",
    description: "Automatically apply to all jobs matching the given criteria",
    input_schema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "Job title or keyword to match" },
        location: { type: "string", description: "Location filter" },
        jobType: { type: "string", description: "Job type filter" },
        maxApplications: { type: "number", description: "Maximum number of jobs to apply to (default 5)" },
      },
      required: [],
    },
  },
  {
    name: "get_my_applications",
    description: "Get list of jobs the seeker has applied to",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "save_job",
    description: "Save a job to favorites",
    input_schema: {
      type: "object" as const,
      properties: {
        jobId: { type: "string", description: "The job ID to save" },
      },
      required: ["jobId"],
    },
  },
];

export const _searchJobs = internalQuery({
  args: {
    keyword: v.optional(v.string()),
    location: v.optional(v.string()),
    jobType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();

    let filtered = jobs;

    if (args.keyword) {
      const keyword = args.keyword.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword)
      );
    }

    if (args.location) {
      const location = args.location.toLowerCase();
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(location)
      );
    }

    if (args.jobType) {
      const jobType = args.jobType.toLowerCase();
      filtered = filtered.filter((job) =>
        job.type?.toLowerCase().includes(jobType)
      );
    }

    return filtered.map((job) => ({
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description?.substring(0, 100) + "...",
    }));
  },
});

export const _applyToJob = internalMutation({
  args: {
    candidateId: v.id("candidates"),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    // Check if already applied
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .first();

    if (existing) {
      return { success: false, message: "Already applied to this job" };
    }

    const job = await ctx.db.get(args.jobId);
    if (!job) {
      return { success: false, message: "Job not found" };
    }

    await ctx.db.insert("applications", {
      candidateId: args.candidateId,
      jobId: args.jobId,
      status: "pending",
      createdAt: Date.now(),
    });

    return { success: true, message: `Applied to ${job.title} at ${job.company}` };
  },
});

export const _saveJobForSeeker = internalMutation({
  args: {
    candidateId: v.id("candidates"),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("savedJobs")
      .withIndex("by_candidate_job", (q) =>
        q.eq("candidateId", args.candidateId).eq("jobId", args.jobId)
      )
      .first();

    if (existing) {
      return { success: false, message: "Job already saved" };
    }

    const job = await ctx.db.get(args.jobId);
    if (!job) {
      return { success: false, message: "Job not found" };
    }

    await ctx.db.insert("savedJobs", {
      candidateId: args.candidateId,
      jobId: args.jobId,
      savedAt: Date.now(),
    });

    return { success: true, message: `Saved ${job.title} to favorites` };
  },
});

export const _getSeekerApplications = internalQuery({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    const enriched = await Promise.all(
      applications.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        return {
          id: app._id,
          status: app.status,
          appliedAt: app.createdAt,
          jobTitle: job?.title || "Unknown",
          company: job?.company || "Unknown",
        };
      })
    );

    return enriched;
  },
});

// Seeker chat action
export const seekerChat = action({
  args: {
    message: v.string(),
    conversationId: v.string(),
    candidateId: v.id("candidates"),
    actionType: v.optional(v.union(v.literal("search"), v.literal("apply-selected"))),
    selectedJobIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<{
    response: string;
    appliedJobs?: string[];
    matchingJobs?: Array<{
      id: string;
      title: string;
      company: string;
      location: string;
      salary: string;
      type: string;
    }>;
  }> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    // Save user message
    await ctx.runMutation(internal.aiAgent._saveMessage, {
      participantId: args.conversationId,
      role: "user",
      content: args.message,
    });

    // Get conversation history
    const history: Array<{ role: string; content: string }> = await ctx.runQuery(
      internal.aiAgent._getConversationHistory,
      {
        participantId: args.conversationId,
        limit: 10,
      }
    );

    const messages: ClaudeMessage[] = history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    }));

    // Handle apply-selected action directly without AI
    if (args.actionType === "apply-selected" && args.selectedJobIds && args.selectedJobIds.length > 0) {
      const appliedJobs: string[] = [];
      const results = [];

      for (const jobId of args.selectedJobIds) {
        try {
          const result = await ctx.runMutation(internal.aiAgent._applyToJob, {
            candidateId: args.candidateId,
            jobId: jobId as any,
          }) as { success: boolean; message: string };

          if (result.success) {
            appliedJobs.push(result.message.replace('Applied to ', ''));
          }
          results.push(result);
        } catch (error) {
          results.push({ success: false, message: String(error) });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const response = successCount > 0
        ? `Successfully applied to ${successCount} job(s):\n${appliedJobs.map(j => `• ${j}`).join('\n')}`
        : 'No applications were submitted. You may have already applied to these jobs.';

      return { response, appliedJobs };
    }

    // For search action, use AI to understand the query and match jobs intelligently
    if (args.actionType === "search") {
      // First, get all available jobs to provide context to the AI
      const allJobs = await ctx.runQuery(internal.aiAgent._searchJobs, {}) as Array<{
        id: string;
        title: string;
        company: string;
        location: string;
        salary: string;
        type: string;
        description: string;
      }>;

      if (allJobs.length === 0) {
        return {
          response: 'No jobs are currently available. Please check back later.',
          matchingJobs: []
        };
      }

      // Use AI to understand the user's query and match jobs intelligently
      const searchPrompt = `You are a precise job matching AI for Cepat Hire. Analyze the job seeker's query and return ONLY jobs that are genuinely relevant.

CRITICAL RULES:
- Be STRICT in matching - only return jobs that truly match the user's intent
- If the query is vague (like "any job" or just "job"), still try to infer preferences
- If NO jobs match the criteria, return an EMPTY matchedJobIndices array
- Never return all jobs unless the user explicitly asks to "see all jobs" or "list everything"

User's search query: "${args.message}"

Available jobs (${allJobs.length} total):
${allJobs.map((job, i) => `[${i}] Title: "${job.title}" | Company: "${job.company}" | Location: "${job.location || 'Not specified'}" | Type: "${job.type || 'Not specified'}" | Salary: "${job.salary || 'Competitive'}" | Desc: "${job.description || 'No description'}"`).join('\n')}

MATCHING CRITERIA - Apply these filters based on the user's query:
1. JOB TYPE/ROLE: Match job titles, skills, or industries mentioned (use semantic matching - "server"="waiter", "F&B"="restaurant/cafe", "retail"="sales assistant")
2. LOCATION: Match location if specified (KL=Kuala Lumpur, PJ=Petaling Jaya)
3. JOB TYPE: Match part-time/full-time/contract if mentioned
4. SALARY: Consider salary expectations if mentioned

Respond with ONLY this JSON (no other text):
{"matchedJobIndices":[<indices of matching jobs>],"searchSummary":"<friendly message explaining what was found and why>"}

Examples:
- Query "waiter job" with cafe jobs → {"matchedJobIndices":[0,2],"searchSummary":"Found 2 food service jobs matching your search for waiter positions."}
- Query "remote work" with no remote jobs → {"matchedJobIndices":[],"searchSummary":"No remote positions are currently available. Try searching for on-site jobs in your area."}`;

      try {
        const searchResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 512,
            messages: [{ role: "user", content: searchPrompt }],
          }),
        });

        if (!searchResponse.ok) {
          const errorText = await searchResponse.text();
          console.error("AI search API error:", errorText);
          throw new Error(`AI search error: ${searchResponse.status}`);
        }

        const searchResult: ClaudeResponse = await searchResponse.json();
        const textContent = searchResult.content.find(block => block.type === "text");
        const aiText = textContent?.text || "";

        console.log("AI response:", aiText); // Debug log

        // Parse the AI's JSON response using robust extraction
        const parsed = extractValidJSON(aiText);
        if (parsed) {

          // Validate the parsed indices
          const validIndices = (parsed.matchedJobIndices || [])
            .filter(idx => typeof idx === 'number' && idx >= 0 && idx < allJobs.length);

          const matchingJobs = validIndices.map(idx => ({
            id: String(allJobs[idx].id),
            title: allJobs[idx].title,
            company: allJobs[idx].company,
            location: allJobs[idx].location || 'Not specified',
            salary: allJobs[idx].salary || 'Competitive',
            type: allJobs[idx].type || 'Part-time',
          }));

          const response = matchingJobs.length > 0
            ? parsed.searchSummary || `Found ${matchingJobs.length} job(s) matching your criteria. Select the ones you'd like to apply to.`
            : parsed.searchSummary || 'No jobs found matching your specific criteria. Try broadening your search or using different keywords.';

          return { response, matchingJobs };
        } else {
          console.error("Failed to parse AI JSON response:", aiText);
        }
      } catch (error) {
        console.error("AI search error:", error);
      }

      // Fallback: Use SEO search engine for intelligent keyword matching
      const parsedQuery = parseQuery(args.message);

      // Convert jobs to the format expected by the search engine
      const jobsForSearch: Job[] = allJobs.map(job => ({
        id: String(job.id),
        title: job.title,
        company: job.company,
        location: job.location || '',
        salary: job.salary || '',
        type: job.type || '',
        description: job.description || '',
      }));

      // Score all jobs using SEO-style relevance scoring
      const scoredJobs: ScoredJob[] = jobsForSearch
        .map(job => scoreJob(job, parsedQuery))
        .filter(scored => scored.score > 0)
        .sort((a, b) => b.score - a.score);

      // Return top 10 matches
      const matchedJobs = scoredJobs
        .slice(0, 10)
        .map(scored => ({
          id: scored.job.id,
          title: scored.job.title,
          company: scored.job.company,
          location: scored.job.location || 'Not specified',
          salary: scored.job.salary || 'Competitive',
          type: scored.job.type || 'Part-time',
        }));

      if (matchedJobs.length === 0) {
        return {
          response: 'No jobs found matching your search. Try using different keywords like job titles (waiter, cashier, driver) or locations (KL, PJ, Penang).',
          matchingJobs: []
        };
      }

      return {
        response: `Found ${matchedJobs.length} job(s) matching your criteria. Select the ones you'd like to apply to.`,
        matchingJobs: matchedJobs
      };
    }

    // Default AI chat mode (for general queries)
    const systemPrompt = `You are a helpful AI assistant for a job seeker using Cepat Hire.

Your task:
1. Search for jobs matching the user's description
2. Present the matching jobs in a clear format

Be helpful and informative. Current date: ${new Date().toLocaleDateString()}`;

    let response: Response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
        tools: seekerTools,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Claude API error:", error);
      throw new Error(`Claude API error: ${response.status}`);
    }

    let result: ClaudeResponse = await response.json();
    const appliedJobs: string[] = [];

    // Handle tool calls
    while (result.stop_reason === "tool_use") {
      const toolUseBlocks = result.content.filter(
        (block) => block.type === "tool_use"
      );

      const toolResults = [];

      for (const toolUse of toolUseBlocks) {
        let toolResult;
        try {
          toolResult = await executeSeekerTool(
            ctx,
            toolUse.name!,
            toolUse.input || {},
            args.candidateId
          );

          // Track applied jobs
          if (toolUse.name === "apply_to_job" || toolUse.name === "auto_apply_matching_jobs") {
            if ((toolResult as { appliedJobs?: string[] }).appliedJobs) {
              appliedJobs.push(...(toolResult as { appliedJobs: string[] }).appliedJobs);
            }
          }
        } catch (error) {
          toolResult = { error: String(error) };
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: JSON.stringify(toolResult),
        });
      }

      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            ...messages,
            { role: "assistant", content: result.content },
            { role: "user", content: toolResults },
          ],
          tools: seekerTools,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Claude API error:", error);
        throw new Error(`Claude API error: ${response.status}`);
      }

      result = await response.json();
    }

    const textBlock = result.content.find((block) => block.type === "text");
    const assistantMessage: string =
      textBlock?.text || "I apologize, I couldn't generate a response.";

    await ctx.runMutation(internal.aiAgent._saveMessage, {
      participantId: args.conversationId,
      role: "assistant",
      content: assistantMessage,
    });

    return { response: assistantMessage, appliedJobs };
  },
});

// Seeker tool execution helper
async function executeSeekerTool(
  ctx: { runQuery: Function; runMutation: Function },
  toolName: string,
  input: Record<string, unknown>,
  candidateId: string
): Promise<unknown> {
  switch (toolName) {
    case "search_jobs":
      return await ctx.runQuery(internal.aiAgent._searchJobs, {
        keyword: input.keyword as string | undefined,
        location: input.location as string | undefined,
        jobType: input.jobType as string | undefined,
      });

    case "apply_to_job":
      return await ctx.runMutation(internal.aiAgent._applyToJob, {
        candidateId,
        jobId: input.jobId as string,
      });

    case "auto_apply_matching_jobs": {
      const jobs = await ctx.runQuery(internal.aiAgent._searchJobs, {
        keyword: input.keyword as string | undefined,
        location: input.location as string | undefined,
        jobType: input.jobType as string | undefined,
      }) as Array<{ id: string; title: string; company: string }>;

      const maxApps = (input.maxApplications as number) || 5;
      const toApply = jobs.slice(0, maxApps);
      const results = [];
      const appliedJobs = [];

      for (const job of toApply) {
        const result = await ctx.runMutation(internal.aiAgent._applyToJob, {
          candidateId,
          jobId: job.id,
        });
        results.push({ job: job.title, company: job.company, ...result as object });
        if ((result as { success: boolean }).success) {
          appliedJobs.push(`${job.title} at ${job.company}`);
        }
      }

      return { results, appliedJobs, totalMatching: jobs.length };
    }

    case "get_my_applications":
      return await ctx.runQuery(internal.aiAgent._getSeekerApplications, {
        candidateId,
      });

    case "save_job":
      return await ctx.runMutation(internal.aiAgent._saveJobForSeeker, {
        candidateId,
        jobId: input.jobId as string,
      });

    default:
      throw new Error(`Unknown seeker tool: ${toolName}`);
  }
}

// Tool execution helper
async function executeTool(
  ctx: { runQuery: Function; runMutation: Function },
  toolName: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_jobs":
      return await ctx.runQuery(internal.aiAgent._listJobs, {
        status: input.status as string | undefined,
      });

    case "create_job":
      return await ctx.runMutation(internal.aiAgent._createJob, {
        title: input.title as string,
        company: input.company as string,
        description: input.description as string,
        requirements: input.requirements as string[] | undefined,
        location: input.location as string | undefined,
        salary: input.salary as string | undefined,
        type: input.type as string | undefined,
        benefits: input.benefits as string | undefined,
        isRemote: input.isRemote as boolean | undefined,
        status: input.status as string | undefined,
      });

    case "update_job":
      return await ctx.runMutation(internal.aiAgent._updateJob, {
        jobId: input.jobId as string,
        title: input.title as string | undefined,
        company: input.company as string | undefined,
        description: input.description as string | undefined,
        requirements: input.requirements as string[] | undefined,
        location: input.location as string | undefined,
        salary: input.salary as string | undefined,
        type: input.type as string | undefined,
        benefits: input.benefits as string | undefined,
        isRemote: input.isRemote as boolean | undefined,
        status: input.status as string | undefined,
      });

    case "delete_job":
      return await ctx.runMutation(internal.aiAgent._deleteJob, {
        jobId: input.jobId as string,
      });

    case "list_applications":
      return await ctx.runQuery(internal.aiAgent._listApplications, {
        jobId: input.jobId as string | undefined,
      });

    case "update_application_status":
      return await ctx.runMutation(internal.aiAgent._updateApplicationStatus, {
        applicationId: input.applicationId as string,
        status: input.status as string,
        notes: input.notes as string | undefined,
      });

    case "get_dashboard_stats":
      return await ctx.runQuery(internal.aiAgent._getDashboardStats, {});

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
