import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    participantId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let messages;
    if (args.participantId) {
      messages = await ctx.db
        .query("conversations")
        .withIndex("by_participant", (idx) =>
          idx.eq("participantId", args.participantId)
        )
        .order("desc")
        .collect();
    } else {
      messages = await ctx.db.query("conversations").order("desc").collect();
    }

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
    let messages;

    if (args.participantId) {
      messages = await ctx.db
        .query("conversations")
        .withIndex("by_participant", (idx) =>
          idx.eq("participantId", args.participantId)
        )
        .order("desc")
        .take(count);
    } else {
      messages = await ctx.db
        .query("conversations")
        .order("desc")
        .take(count);
    }

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

export const getByParticipant = query({
  args: { participantId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_participant", (idx) =>
        idx.eq("participantId", args.participantId)
      )
      .order("asc")
      .collect();
  },
});

export const clear = mutation({
  args: { participantId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let messages;

    if (args.participantId) {
      messages = await ctx.db
        .query("conversations")
        .withIndex("by_participant", (idx) =>
          idx.eq("participantId", args.participantId)
        )
        .collect();
    } else {
      messages = await ctx.db.query("conversations").collect();
    }

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});
