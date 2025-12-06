import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new employee record when hiring an applicant
export const create = mutation({
    args: {
        jobId: v.id("jobs"),
        candidateId: v.id("candidates"),
        employerId: v.id("users"),
        applicationId: v.id("applications"),
        salary: v.optional(v.string()),
        startDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const employeeId = await ctx.db.insert("employees", {
            jobId: args.jobId,
            candidateId: args.candidateId,
            employerId: args.employerId,
            applicationId: args.applicationId,
            hiredDate: Date.now(),
            status: "active",
            salary: args.salary,
            startDate: args.startDate,
        });
        return employeeId;
    },
});

// Get all employees for an employer
export const listByEmployer = query({
    args: { employerId: v.id("users") },
    handler: async (ctx, args) => {
        const employees = await ctx.db
            .query("employees")
            .withIndex("by_employer", (q) => q.eq("employerId", args.employerId))
            .collect();

        // Enrich with job and candidate details
        const enrichedEmployees = await Promise.all(
            employees.map(async (employee) => {
                const job = await ctx.db.get(employee.jobId);
                const candidate = await ctx.db.get(employee.candidateId);
                return {
                    ...employee,
                    job,
                    candidate,
                };
            })
        );

        return enrichedEmployees;
    },
});

// Get all employees for a specific job
export const listByJob = query({
    args: { jobId: v.id("jobs") },
    handler: async (ctx, args) => {
        const employees = await ctx.db
            .query("employees")
            .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
            .collect();

        // Enrich with candidate details
        const enrichedEmployees = await Promise.all(
            employees.map(async (employee) => {
                const candidate = await ctx.db.get(employee.candidateId);
                return {
                    ...employee,
                    candidate,
                };
            })
        );

        return enrichedEmployees;
    },
});

// Update employee status
export const updateStatus = mutation({
    args: {
        id: v.id("employees"),
        status: v.union(v.literal("active"), v.literal("inactive")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: args.status,
        });
    },
});
