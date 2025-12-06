import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    participantId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("conversations");

    if (args.participantId) {
      q = q.withIndex("by_participant", (idx) =>
        idx.eq("participantId", args.participantId)
      );
    }

    const messages = await q.order("desc").collect();
    const limited = args.limit ? messages.slice(0, args.limit) : messages;
    return limited.reverse(); // Return in chronological order
  },
});

export const getRecent = query({
  args: {
    participantId: v.optional(v.string()),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count ?? 10;
    let q = ctx.db.query("conversations");

    if (args.participantId) {
      q = q.withIndex("by_participant", (idx) =>
        idx.eq("participantId", args.participantId)
      );
    }

    const messages = await q.order("desc").take(count);
    return messages.reverse();
  },
});

export const add = mutation({
  args: {
    participantId: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const clear = mutation({
  args: { participantId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("conversations");

    if (args.participantId) {
      q = q.withIndex("by_participant", (idx) =>
        idx.eq("participantId", args.participantId)
      );
    }

    const messages = await q.collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});
