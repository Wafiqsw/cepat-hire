import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

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
