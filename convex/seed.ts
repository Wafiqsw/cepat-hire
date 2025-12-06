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
      title: "Part-Time Barista",
      company: "Cafe Delight",
      description:
        "Join our friendly team! Make delicious coffee and serve customers. Flexible hours, weekends available. No experience needed, training provided.",
      requirements: ["Customer Service", "Team Player", "Flexible Schedule"],
      location: "Kuala Lumpur, Malaysia",
      salary: "RM 10 - RM 15/hour",
      type: "Part-time",
      benefits: "Free coffee, flexible hours, tips included",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      isRemote: false,
      status: "open",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    });

    const job2 = await ctx.db.insert("jobs", {
      title: "Retail Sales Assistant",
      company: "Fashion Outlet",
      description:
        "Help customers find perfect outfits. Part-time position with flexible schedule. Great for students. Commission available on sales.",
      requirements: ["Communication Skills", "Fashion Interest", "Sales Experience"],
      location: "Penang, Malaysia",
      salary: "RM 8 - RM 12/hour",
      type: "Part-time",
      benefits: "Staff discount, commission on sales",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      isRemote: false,
      status: "open",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    });

    const job3 = await ctx.db.insert("jobs", {
      title: "Food Delivery Rider",
      company: "Quick Eats",
      description:
        "Deliver food to customers. Own motorcycle required. Flexible working hours, choose your own schedule. Earn extra with tips and bonuses.",
      requirements: ["Motorcycle License", "Smartphone", "Know Local Area"],
      location: "Selangor, Malaysia",
      salary: "RM 12 - RM 18/hour",
      type: "Part-time",
      benefits: "Flexible hours, tips, bonuses for high performance",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80",
      isRemote: false,
      status: "open",
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    });

    // Additional jobs for variety
    const job4 = await ctx.db.insert("jobs", {
      title: "Tutor - Mathematics",
      company: "Learning Center",
      description:
        "Teach mathematics to secondary school students. Flexible hours, weekend classes available. Must have strong math background.",
      requirements: ["Math Degree", "Teaching Experience", "Patient"],
      location: "Kuala Lumpur, Malaysia",
      salary: "RM 25 - RM 40/hour",
      type: "Part-time",
      benefits: "Flexible schedule, rewarding work",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      isRemote: false,
      status: "open",
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    });

    const job5 = await ctx.db.insert("jobs", {
      title: "Warehouse Packer",
      company: "Logistics Hub",
      description:
        "Pack and prepare orders for shipment. Morning or evening shifts available. Physical work, good for staying active. Weekly pay.",
      requirements: ["Physical Fitness", "Attention to Detail", "Reliable"],
      location: "Johor Bahru, Malaysia",
      salary: "RM 9 - RM 13/hour",
      type: "Part-time",
      benefits: "Weekly pay, overtime available",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
      isRemote: false,
      status: "open",
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    });

    const job6 = await ctx.db.insert("jobs", {
      title: "Restaurant Server",
      company: "Family Dining",
      description:
        "Serve customers in a friendly family restaurant. Evening and weekend shifts. Tips included. Great team environment.",
      requirements: ["Customer Service", "Team Player", "Weekend Availability"],
      location: "Petaling Jaya, Malaysia",
      salary: "RM 10 - RM 14/hour",
      type: "Part-time",
      benefits: "Tips, free meals, great team",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      isRemote: false,
      status: "open",
      createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
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
      name: "Lee Wei Ming",
      email: "leewei@example.com",
      phone: "+60 14-567 8901",
      location: "Kuala Lumpur",
      experience: "2 years experience",
      resumeText:
        "Experienced delivery rider with knowledge of KL area. Owns motorcycle and has clean driving record.",
      skills: ["Delivery", "Customer Service", "Navigation", "Time Management"],
      status: "hired",
      createdAt: Date.now(),
    });

    const candidate4 = await ctx.db.insert("candidates", {
      name: "Nurul Aisyah",
      email: "nurul@example.com",
      phone: "+60 15-678 9012",
      location: "Kuala Lumpur",
      experience: "3 years experience",
      resumeText:
        "Mathematics tutor with degree in Applied Mathematics. Patient and good at explaining complex concepts.",
      skills: ["Mathematics", "Teaching", "Communication", "Patience"],
      status: "hired",
      createdAt: Date.now(),
    });

    const candidate5 = await ctx.db.insert("candidates", {
      name: "Muhammad Faris",
      email: "faris@example.com",
      phone: "+60 16-789 0123",
      location: "Johor Bahru",
      experience: "1 year experience",
      resumeText:
        "Reliable warehouse worker with attention to detail. Physically fit and punctual.",
      skills: ["Warehouse Operations", "Packing", "Inventory", "Physical Fitness"],
      status: "hired",
      createdAt: Date.now(),
    });

    const candidate6 = await ctx.db.insert("candidates", {
      name: "Amirah Sofea",
      email: "amirah@example.com",
      phone: "+60 17-890 1234",
      location: "Petaling Jaya",
      experience: "2 years experience",
      resumeText:
        "Friendly restaurant server with experience in family dining establishments. Great with customers.",
      skills: ["Customer Service", "Food Service", "Team Work", "Communication"],
      status: "hired",
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
      status: "shortlisted",
      createdAt: Date.now(),
    });

    await ctx.db.insert("applications", {
      jobId: job4,
      candidateId: candidate4,
      status: "shortlisted",
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("applications", {
      jobId: job5,
      candidateId: candidate5,
      status: "shortlisted",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("applications", {
      jobId: job6,
      candidateId: candidate6,
      status: "shortlisted",
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    });

    // Create sample payments
    await ctx.db.insert("payments", {
      jobId: job1,
      candidateId: candidate1,
      amount: 450.0,
      currency: "RM",
      status: "completed",
      dateRange: "10/11 - 1/12",
      description: "Part-Time Barista - 3 weeks completed • RM 90/day",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-2024-001234",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("payments", {
      jobId: job2,
      candidateId: candidate2,
      amount: 320.0,
      currency: "RM",
      status: "pending",
      dateRange: "20/11 - 5/12",
      description: "Retail Sales Assistant - 2 weeks completed • RM 80/day",
      paymentMethod: "Online Banking",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("payments", {
      jobId: job3,
      candidateId: candidate3,
      amount: 540.0,
      currency: "RM",
      status: "completed",
      dateRange: "25/11 - 2/12",
      description: "Food Delivery Rider - 1 week completed • RM 90/day",
      paymentMethod: "E-Wallet",
      transactionId: "TXN-2024-001220",
      createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("payments", {
      jobId: job4,
      candidateId: candidate4,
      amount: 800.0,
      currency: "RM",
      status: "completed",
      dateRange: "1/11 - 28/11",
      description: "Tutor - Mathematics - 20 hours completed • RM 100/day",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-2024-001180",
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("payments", {
      jobId: job5,
      candidateId: candidate5,
      amount: 600.0,
      currency: "RM",
      status: "pending",
      dateRange: "22/11 - 6/12",
      description: "Warehouse Packer - 2 weeks completed • RM 75/day",
      paymentMethod: "Bank Transfer",
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("payments", {
      jobId: job6,
      candidateId: candidate6,
      amount: 375.0,
      currency: "RM",
      status: "completed",
      dateRange: "18/11 - 25/11",
      description: "Restaurant Server - 1 week completed • RM 85/day",
      paymentMethod: "E-Wallet",
      transactionId: "TXN-2024-001150",
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: "Seed data created successfully",
      jobs: 6,
      candidates: 6,
      applications: 6,
      payments: 6,
    };
  },
});

// Clear all data (useful for re-seeding)
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = ["savedJobs", "payments", "applications", "candidates", "jobs", "conversations"];
    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }
    return { message: "All data cleared" };
  },
});
