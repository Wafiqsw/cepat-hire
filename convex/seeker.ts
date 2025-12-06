import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ==================== GET CANDIDATE BY USER ID ====================

export const getCandidateByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("candidates")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// ==================== WITHDRAWALS ====================

export const requestWithdrawal = mutation({
  args: {
    candidateId: v.id("candidates"),
    amount: v.number(),
    bankName: v.string(),
    accountNumber: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate amount is positive
    if (args.amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    return await ctx.db.insert("withdrawals", {
      candidateId: args.candidateId,
      amount: args.amount,
      bankName: args.bankName,
      accountNumber: args.accountNumber,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const getWithdrawals = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("withdrawals")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .order("desc")
      .collect();
  },
});

// ==================== SAVED JOBS ====================

export const getSavedJobs = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const savedJobs = await ctx.db
      .query("savedJobs")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    const jobsWithDetails = await Promise.all(
      savedJobs.map(async (saved) => {
        const job = await ctx.db.get(saved.jobId);
        return job ? { ...saved, job } : null;
      })
    );

    return jobsWithDetails.filter(Boolean);
  },
});

export const saveJob = mutation({
  args: {
    candidateId: v.id("candidates"),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    // Check if already saved
    const existing = await ctx.db
      .query("savedJobs")
      .withIndex("by_candidate_job", (q) =>
        q.eq("candidateId", args.candidateId).eq("jobId", args.jobId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("savedJobs", {
      candidateId: args.candidateId,
      jobId: args.jobId,
      savedAt: Date.now(),
    });
  },
});

export const unsaveJob = mutation({
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
      await ctx.db.delete(existing._id);
    }
  },
});

export const isJobSaved = query({
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

    return !!existing;
  },
});

export const getSavedJobsCount = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const savedJobs = await ctx.db
      .query("savedJobs")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    return savedJobs.length;
  },
});

// ==================== APPLICATIONS (SEEKER VIEW) ====================

export const getMyApplications = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    const applicationsWithJobs = await Promise.all(
      applications.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        return { ...app, job };
      })
    );

    return applicationsWithJobs.filter((app) => app.job);
  },
});

export const getAppliedJobIds = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    return applications.map((app) => app.jobId);
  },
});

export const getApplicationStats = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      reviewed: applications.filter((a) => a.status === "reviewed").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      hired: applications.filter((a) => a.status === "hired").length,
    };
  },
});

export const applyToJob = mutation({
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
      throw new Error("Already applied to this job");
    }

    return await ctx.db.insert("applications", {
      candidateId: args.candidateId,
      jobId: args.jobId,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// ==================== PAYMENTS (SEEKER VIEW) ====================

export const getMyPayments = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    const paymentsWithJobs = await Promise.all(
      payments.map(async (payment) => {
        const job = await ctx.db.get(payment.jobId);
        return { ...payment, job };
      })
    );

    return paymentsWithJobs;
  },
});

export const getMyPaymentStats = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    const completed = payments.filter((p) => p.status === "completed");
    const pending = payments.filter((p) => p.status === "pending");

    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
    const completedEarnings = completed.reduce((sum, p) => sum + p.amount, 0);
    const pendingEarnings = pending.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalEarnings,
      completedEarnings,
      pendingEarnings,
      availableToWithdraw: completedEarnings * 0.95, // 5% held
      totalTransactions: payments.length,
      completedCount: completed.length,
      pendingCount: pending.length,
    };
  },
});

// ==================== PROFILE ====================

export const getProfile = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.candidateId);
  },
});

export const updateProfile = mutation({
  args: {
    candidateId: v.id("candidates"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    experience: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    resumeText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { candidateId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(candidateId, filtered);
  },
});

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    // Applications
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    // Payments
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    // Saved Jobs
    const savedJobs = await ctx.db
      .query("savedJobs")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    // Candidate profile for completion calculation
    const candidate = await ctx.db.get(args.candidateId);

    // Calculate profile completion
    let profileCompletion = 0;
    if (candidate) {
      if (candidate.name) profileCompletion += 20;
      if (candidate.email) profileCompletion += 20;
      if (candidate.phone) profileCompletion += 15;
      if (candidate.location) profileCompletion += 15;
      if (candidate.skills && candidate.skills.length > 0) profileCompletion += 15;
      if (candidate.experience) profileCompletion += 15;
    }

    const completedEarnings = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingEarnings = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      applications: {
        total: applications.length,
        pending: applications.filter((a) => a.status === "pending").length,
        reviewed: applications.filter((a) => a.status === "reviewed").length,
        shortlisted: applications.filter((a) => a.status === "shortlisted").length,
        rejected: applications.filter((a) => a.status === "rejected").length,
        hired: applications.filter((a) => a.status === "hired").length,
      },
      earnings: {
        total: completedEarnings + pendingEarnings,
        completed: completedEarnings,
        pending: pendingEarnings,
        available: completedEarnings * 0.95,
      },
      savedJobs: savedJobs.length,
      profileCompletion,
    };
  },
});

export const getRecentApplications = query({
  args: { candidateId: v.id("candidates"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .order("desc")
      .take(args.limit || 5);

    const applicationsWithJobs = await Promise.all(
      applications.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        return { ...app, job };
      })
    );

    return applicationsWithJobs.filter((app) => app.job);
  },
});

// ==================== WORK HISTORY ====================

export const getWorkHistory = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    // Get hired applications as work history
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    // Only hired applications count as actual work history
    const hiredApps = applications.filter((a) => a.status === "hired");

    const workHistory = await Promise.all(
      hiredApps.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        if (!job) return null;

        // Check if there's an employee record for more details
        const employee = await ctx.db
          .query("employees")
          .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
          .filter((q) => q.eq(q.field("jobId"), app.jobId))
          .first();

        return {
          id: app._id,
          company: job.company,
          position: job.title,
          location: job.location || "Remote",
          startDate: employee
            ? new Date(employee.hiredDate).toLocaleDateString("en-GB")
            : new Date(app.createdAt).toLocaleDateString("en-GB"),
          endDate: employee?.status === "active" ? "Present" : "Completed",
          description: job.description,
          isCurrentJob: employee?.status === "active",
        };
      })
    );

    return workHistory.filter(Boolean);
  },
});
