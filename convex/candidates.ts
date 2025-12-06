import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("screening"),
        v.literal("interviewed"),
        v.literal("hired"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("candidates")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("candidates").collect();
  },
});

export const get = query({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("candidates")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    resumeText: v.optional(v.string()),
    skills: v.array(v.string()),
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("screening"),
        v.literal("interviewed"),
        v.literal("hired"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("candidates", {
      ...args,
      status: args.status ?? "new",
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("candidates"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    resumeText: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("screening"),
        v.literal("interviewed"),
        v.literal("hired"),
        v.literal("rejected")
      )
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
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const searchBySkills = query({
  args: { skills: v.array(v.string()) },
  handler: async (ctx, args) => {
    const candidates = await ctx.db.query("candidates").collect();
    return candidates.filter((candidate) =>
      args.skills.some((skill) =>
        candidate.skills.some((s) =>
          s.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );
  },
});
