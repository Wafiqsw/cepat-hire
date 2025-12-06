import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("open"), v.literal("closed"), v.literal("draft"))
    ),
  },
  handler: async (ctx, args) => {
    let jobs;
    if (args.status) {
      jobs = await ctx.db
        .query("jobs")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      jobs = await ctx.db.query("jobs").collect();
    }
    // Only return jobs that have an employerId (valid employer-owned jobs)
    // This ensures seekers only see jobs where the employer can actually view applications
    return jobs.filter((job) => job.employerId !== undefined);
  },
});

// List jobs for specific employer only
export const listByEmployer = query({
  args: {
    employerId: v.id("users"),
    status: v.optional(
      v.union(v.literal("open"), v.literal("closed"), v.literal("draft"))
    ),
  },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_employer", (q) => q.eq("employerId", args.employerId))
      .collect();

    if (args.status) {
      return jobs.filter((job) => job.status === args.status);
    }
    return jobs;
  },
});

export const get = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    employerId: v.optional(v.id("users")), // Link to employer who created the job
    title: v.string(),
    company: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
    type: v.optional(v.string()),
    benefits: v.optional(v.string()),
    image: v.optional(v.string()),
    isRemote: v.optional(v.boolean()),
    status: v.optional(
      v.union(v.literal("open"), v.literal("closed"), v.literal("draft"))
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobs", {
      ...args,
      status: args.status ?? "draft",
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("jobs"),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
    type: v.optional(v.string()),
    benefits: v.optional(v.string()),
    image: v.optional(v.string()),
    isRemote: v.optional(v.boolean()),
    status: v.optional(
      v.union(v.literal("open"), v.literal("closed"), v.literal("draft"))
    ),
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
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const search = query({
  args: {
    skills: v.optional(v.array(v.string())),
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allJobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();

    // Only return jobs that have an employerId (valid employer-owned jobs)
    const jobs = allJobs.filter((job) => job.employerId !== undefined);

    if (!args.skills?.length && !args.query) {
      return jobs;
    }

    return jobs.filter((job) => {
      const matchesSkills = args.skills?.some(
        (skill) =>
          job.requirements.some((req) =>
            req.toLowerCase().includes(skill.toLowerCase())
          ) ||
          job.description.toLowerCase().includes(skill.toLowerCase())
      );
      const matchesQuery =
        args.query &&
        (job.title.toLowerCase().includes(args.query.toLowerCase()) ||
          job.description.toLowerCase().includes(args.query.toLowerCase()));

      return matchesSkills || matchesQuery;
    });
  },
});
