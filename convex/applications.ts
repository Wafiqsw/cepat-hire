import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    jobId: v.optional(v.id("jobs")),
    candidateId: v.optional(v.id("candidates")),
  },
  handler: async (ctx, args) => {
    if (args.jobId) {
      return await ctx.db
        .query("applications")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId!))
        .collect();
    }
    if (args.candidateId) {
      return await ctx.db
        .query("applications")
        .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId!))
        .collect();
    }
    return await ctx.db.query("applications").collect();
  },
});

export const get = query({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    jobId: v.id("jobs"),
    candidateId: v.id("candidates"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("applications", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("shortlisted"),
      v.literal("rejected")
    ),
    aiScore: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const remove = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getWithDetails = query({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.id);
    if (!application) return null;

    const job = await ctx.db.get(application.jobId);
    const candidate = await ctx.db.get(application.candidateId);

    return { ...application, job, candidate };
  },
});

// Get all applications with full job and candidate details (for dashboard)
export const listWithDetails = query({
  args: {},
  handler: async (ctx) => {
    const applications = await ctx.db.query("applications").collect();

    const results = await Promise.all(
      applications.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        const candidate = await ctx.db.get(app.candidateId);
        return { ...app, job, candidate };
      })
    );

    return results.filter((r) => r.job && r.candidate);
  },
});

// Get dashboard stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();

    const applications = await ctx.db.query("applications").collect();
    const pending = applications.filter((a) => a.status === "pending");

    return {
      activeJobs: jobs.length,
      applications: applications.length,
      pending: pending.length,
    };
  },
});
