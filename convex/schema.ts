import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
    status: v.union(v.literal("open"), v.literal("closed"), v.literal("draft")),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    resumeText: v.optional(v.string()),
    skills: v.array(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("screening"),
      v.literal("interviewed"),
      v.literal("hired"),
      v.literal("rejected")
    ),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  conversations: defineTable({
    participantId: v.optional(v.string()), // could be candidateId or null for general
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
  }).index("by_participant", ["participantId", "timestamp"]),

  applications: defineTable({
    jobId: v.id("jobs"),
    candidateId: v.id("candidates"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    aiScore: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_job", ["jobId"])
    .index("by_candidate", ["candidateId"]),
});
