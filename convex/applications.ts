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
      v.literal("reviewing"),
      v.literal("accepted"),
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
