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
      company: "TechCorp",
      description:
        "We are looking for an experienced frontend developer to join our team. You will work on building modern web applications using React and TypeScript.",
      requirements: ["React", "TypeScript", "CSS", "3+ years experience"],
      location: "Remote",
      salary: "$120k - $150k",
      status: "open",
      createdAt: Date.now(),
    });

    const job2 = await ctx.db.insert("jobs", {
      title: "Backend Engineer",
      company: "DataFlow Inc",
      description:
        "Join our backend team to build scalable APIs and services. Experience with Node.js and databases required.",
      requirements: ["Node.js", "PostgreSQL", "REST APIs", "Docker"],
      location: "San Francisco, CA",
      salary: "$130k - $160k",
      status: "open",
      createdAt: Date.now(),
    });

    const job3 = await ctx.db.insert("jobs", {
      title: "Full Stack Developer",
      company: "StartupXYZ",
      description:
        "Early-stage startup looking for a versatile developer who can work across the stack.",
      requirements: ["JavaScript", "Python", "React", "AWS"],
      location: "New York, NY",
      salary: "$100k - $140k",
      status: "open",
      createdAt: Date.now(),
    });

    // Create sample candidates
    const candidate1 = await ctx.db.insert("candidates", {
      name: "Alice Chen",
      email: "alice@example.com",
      resumeText:
        "5 years of experience in frontend development. Expert in React, TypeScript, and modern CSS. Previously worked at Google and Meta.",
      skills: ["React", "TypeScript", "CSS", "JavaScript", "GraphQL"],
      status: "new",
      createdAt: Date.now(),
    });

    const candidate2 = await ctx.db.insert("candidates", {
      name: "Bob Smith",
      email: "bob@example.com",
      resumeText:
        "Backend developer with 4 years of experience. Strong background in Node.js, databases, and cloud infrastructure.",
      skills: ["Node.js", "PostgreSQL", "MongoDB", "Docker", "AWS"],
      status: "new",
      createdAt: Date.now(),
    });

    const candidate3 = await ctx.db.insert("candidates", {
      name: "Carol Williams",
      email: "carol@example.com",
      resumeText:
        "Full stack developer with 3 years experience. Comfortable with both frontend and backend work. Quick learner.",
      skills: ["JavaScript", "Python", "React", "Node.js", "SQL"],
      status: "screening",
      createdAt: Date.now(),
    });

    // Create sample applications
    await ctx.db.insert("applications", {
      jobId: job1,
      candidateId: candidate1,
      status: "pending",
      createdAt: Date.now(),
    });

    await ctx.db.insert("applications", {
      jobId: job2,
      candidateId: candidate2,
      status: "reviewing",
      notes: "Strong backend skills, scheduling interview",
      createdAt: Date.now(),
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
