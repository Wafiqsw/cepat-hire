import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("completed"),
        v.literal("ongoing"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("payments")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("payments").collect();
  },
});

export const listWithDetails = query({
  args: {},
  handler: async (ctx) => {
    const payments = await ctx.db.query("payments").collect();

    const results = await Promise.all(
      payments.map(async (payment) => {
        const job = await ctx.db.get(payment.jobId);
        const candidate = await ctx.db.get(payment.candidateId);
        return { ...payment, job, candidate };
      })
    );

    return results.filter((r) => r.job && r.candidate);
  },
});

export const get = query({
  args: { id: v.id("payments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getWithDetails = query({
  args: { id: v.id("payments") },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.id);
    if (!payment) return null;

    const job = await ctx.db.get(payment.jobId);
    const candidate = await ctx.db.get(payment.candidateId);

    return { ...payment, job, candidate };
  },
});

export const create = mutation({
  args: {
    jobId: v.id("jobs"),
    candidateId: v.id("candidates"),
    amount: v.number(),
    currency: v.string(),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("completed"),
        v.literal("ongoing"),
        v.literal("cancelled")
      )
    ),
    dateRange: v.string(),
    description: v.string(),
    paymentMethod: v.string(),
    transactionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", {
      ...args,
      status: args.status ?? "pending",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("payments"),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("ongoing"),
      v.literal("cancelled")
    ),
    transactionId: v.optional(v.string()),
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
  args: { id: v.id("payments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const payments = await ctx.db.query("payments").collect();

    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const completed = payments.filter((p) => p.status === "completed").length;
    const pending = payments.filter((p) => p.status === "pending").length;
    const ongoing = payments.filter((p) => p.status === "ongoing").length;

    return {
      total,
      completed,
      pending,
      ongoing,
      totalPayments: payments.length,
    };
  },
});
