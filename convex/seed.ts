import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingJobs = await ctx.db.query("jobs").first();
    if (existingJobs) {
      return { message: "Data already seeded" };
    }

    // Create sample jobs
    const job1 = await ctx.db.insert("jobs", {
      title: "Senior Frontend Developer",
      company: "Tech Corp",
      description:
        "We are looking for an experienced frontend developer to join our team. You will work on building modern web applications using React and TypeScript.",
      requirements: ["React", "TypeScript", "CSS", "3+ years experience"],
      location: "Kuala Lumpur",
      salary: "RM 8,000 - RM 12,000",
      type: "Full-time",
      status: "open",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    });

    const job2 = await ctx.db.insert("jobs", {
      title: "Backend Engineer",
      company: "Innovation Labs",
      description:
        "Join our backend team to build scalable APIs and services. Experience with Node.js and databases required.",
      requirements: ["Node.js", "PostgreSQL", "REST APIs", "Docker"],
      location: "Penang",
      salary: "RM 7,000 - RM 10,000",
      type: "Full-time",
      status: "open",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    });

    const job3 = await ctx.db.insert("jobs", {
      title: "UI/UX Designer",
      company: "Design Studio",
      description:
        "Create beautiful user experiences for our clients. Looking for someone with strong portfolio.",
      requirements: ["Figma", "Adobe XD", "UI Design", "User Research"],
      location: "Remote",
      salary: "RM 5,000 - RM 8,000",
      type: "Contract",
      status: "open",
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
    });

    // Create sample candidates
    const candidate1 = await ctx.db.insert("candidates", {
      name: "Ahmad Abdullah",
      email: "ahmad@example.com",
      phone: "+60 12-345 6789",
      location: "Kuala Lumpur",
      experience: "5 years experience",
      resumeText:
        "5 years of experience in frontend development. Expert in React, TypeScript, and modern CSS. Previously worked at Grab and Shopee.",
      skills: ["React", "TypeScript", "CSS", "JavaScript", "GraphQL"],
      status: "new",
      createdAt: Date.now(),
    });

    const candidate2 = await ctx.db.insert("candidates", {
      name: "Siti Nurhaliza",
      email: "siti@example.com",
      phone: "+60 13-456 7890",
      location: "Selangor",
      experience: "3 years experience",
      resumeText:
        "Backend developer with 3 years of experience. Strong background in Node.js, databases, and cloud infrastructure.",
      skills: ["Node.js", "PostgreSQL", "MongoDB", "Docker", "AWS"],
      status: "new",
      createdAt: Date.now(),
    });

    const candidate3 = await ctx.db.insert("candidates", {
      name: "Raj Kumar",
      email: "raj@example.com",
      phone: "+60 14-567 8901",
      location: "Penang",
      experience: "4 years experience",
      resumeText:
        "Full stack developer with 4 years experience. Comfortable with both frontend and backend work.",
      skills: ["JavaScript", "Python", "React", "Node.js", "SQL"],
      status: "screening",
      createdAt: Date.now(),
    });

    // Create sample applications
    await ctx.db.insert("applications", {
      jobId: job1,
      candidateId: candidate1,
      status: "pending",
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    });

    await ctx.db.insert("applications", {
      jobId: job2,
      candidateId: candidate2,
      status: "reviewed",
      notes: "Strong backend skills, scheduling interview",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    });

    await ctx.db.insert("applications", {
      jobId: job3,
      candidateId: candidate3,
      status: "pending",
      createdAt: Date.now(),
    });

    return {
      message: "Seed data created successfully",
      jobs: 3,
      candidates: 3,
      applications: 3,
    };
  },
});

// Clear all data (useful for re-seeding)
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = ["applications", "candidates", "jobs", "conversations"];
    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }
    return { message: "All data cleared" };
  },
});
