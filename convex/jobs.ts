import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("open"), v.literal("closed"), v.literal("draft"))
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("jobs")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("jobs").collect();
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
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();

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
