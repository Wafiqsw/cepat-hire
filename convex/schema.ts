import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Auth tables
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("employer"), v.literal("seeker")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  // Job tables
  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
    type: v.optional(v.string()), // Full-time, Part-time, Contract, etc.
    status: v.union(v.literal("open"), v.literal("closed"), v.literal("draft")),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    resumeText: v.optional(v.string()),
    experience: v.optional(v.string()), // e.g., "5 years experience"
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
    participantId: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
  }).index("by_participant", ["participantId", "timestamp"]),

  applications: defineTable({
    jobId: v.id("jobs"),
    candidateId: v.id("candidates"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("shortlisted"),
      v.literal("rejected")
    ),
    aiScore: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_job", ["jobId"])
    .index("by_candidate", ["candidateId"]),
});
