import { mutation } from "./_generated/server";

// Password hash for "password123" - using bcrypt format
const PASSWORD_HASH = "$2a$10$rQEY7GbJxMBkQPvAY.Ysku8KvJ8PZZ8T.Vj8HQlJ5JQmZcV5ZmQmu";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingJobs = await ctx.db.query("jobs").first();
    if (existingJobs) {
      return { message: "Data already seeded" };
    }

    // ============================================
    // EMPLOYERS (10 employers)
    // ============================================
    const employers: any[] = [];
    const employerData = [
      { name: "Ahmad Rizal", email: "employer1@test.com", company: "TechCorp Malaysia" },
      { name: "Sarah Tan", email: "employer2@test.com", company: "Retail World Sdn Bhd" },
      { name: "Kumar Subramaniam", email: "employer3@test.com", company: "Food Paradise" },
      { name: "Lim Wei Ling", email: "employer4@test.com", company: "Logistics Express" },
      { name: "Fatimah Hassan", email: "employer5@test.com", company: "Education Hub" },
      { name: "David Wong", email: "employer6@test.com", company: "Healthcare Plus" },
      { name: "Aishah Binti Ali", email: "employer7@test.com", company: "Fashion Forward" },
      { name: "Raj Patel", email: "employer8@test.com", company: "Auto Services" },
      { name: "Michelle Lee", email: "employer9@test.com", company: "Digital Marketing Co" },
      { name: "Hafiz Rahman", email: "employer10@test.com", company: "Construction Pro" },
    ];

    for (const emp of employerData) {
      const id = await ctx.db.insert("users", {
        name: emp.name,
        email: emp.email,
        passwordHash: PASSWORD_HASH,
        role: "employer",
        createdAt: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      });
      employers.push({ id, ...emp });
    }

    // ============================================
    // SEEKERS (20 seekers)
    // ============================================
    const seekers: any[] = [];
    const seekerData = [
      { name: "Ali bin Ahmad", email: "seeker1@test.com", location: "Kuala Lumpur" },
      { name: "Mei Ling Tan", email: "seeker2@test.com", location: "Penang" },
      { name: "Ravi Kumar", email: "seeker3@test.com", location: "Johor Bahru" },
      { name: "Nurul Huda", email: "seeker4@test.com", location: "Selangor" },
      { name: "Jason Lim", email: "seeker5@test.com", location: "Kuala Lumpur" },
      { name: "Siti Aminah", email: "seeker6@test.com", location: "Melaka" },
      { name: "Kelvin Ong", email: "seeker7@test.com", location: "Penang" },
      { name: "Farah Nadia", email: "seeker8@test.com", location: "Selangor" },
      { name: "Muthu Krishnan", email: "seeker9@test.com", location: "Ipoh" },
      { name: "Amanda Chong", email: "seeker10@test.com", location: "Kuala Lumpur" },
      { name: "Ibrahim Hassan", email: "seeker11@test.com", location: "Johor Bahru" },
      { name: "Grace Wong", email: "seeker12@test.com", location: "Kuching" },
      { name: "Aziz Mahmud", email: "seeker13@test.com", location: "Kota Kinabalu" },
      { name: "Priya Devi", email: "seeker14@test.com", location: "Selangor" },
      { name: "Boon Heng", email: "seeker15@test.com", location: "Kuala Lumpur" },
      { name: "Zainab Omar", email: "seeker16@test.com", location: "Penang" },
      { name: "Andy Tan", email: "seeker17@test.com", location: "Selangor" },
      { name: "Roslan Karim", email: "seeker18@test.com", location: "Melaka" },
      { name: "Christina Yap", email: "seeker19@test.com", location: "Kuala Lumpur" },
      { name: "Hafizul Azmi", email: "seeker20@test.com", location: "Johor Bahru" },
    ];

    for (const seeker of seekerData) {
      const id = await ctx.db.insert("users", {
        name: seeker.name,
        email: seeker.email,
        passwordHash: PASSWORD_HASH,
        role: "seeker",
        createdAt: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      });
      seekers.push({ id, ...seeker });
    }

    // ============================================
    // JOBS (35 jobs across employers)
    // ============================================
    const jobs: any[] = [];
    const jobData = [
      // TechCorp Malaysia jobs
      { employer: 0, title: "Part-Time Barista", company: "Cafe Delight", description: "Join our friendly team! Make delicious coffee and serve customers. Flexible hours, weekends available.", requirements: ["Customer Service", "Team Player", "Flexible Schedule"], location: "Kuala Lumpur, Malaysia", salary: "RM 10 - RM 15/hour", type: "Part-time", benefits: "Free coffee, flexible hours, tips included", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80", isRemote: false, status: "open" },
      { employer: 0, title: "Software Developer Intern", company: "TechCorp Malaysia", description: "Learn and grow with our development team. Work on real projects using modern technologies.", requirements: ["Programming basics", "Eager to learn", "Team player"], location: "Kuala Lumpur, Malaysia", salary: "RM 1500 - RM 2000/month", type: "Internship", benefits: "Learning opportunities, mentorship", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80", isRemote: true, status: "open" },
      { employer: 0, title: "IT Support Specialist", company: "TechCorp Malaysia", description: "Provide technical support to office staff. Troubleshoot hardware and software issues.", requirements: ["IT Knowledge", "Problem Solving", "Communication"], location: "Kuala Lumpur, Malaysia", salary: "RM 2500 - RM 3500/month", type: "Full-time", benefits: "Medical insurance, annual bonus", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80", isRemote: false, status: "open" },

      // Retail World jobs
      { employer: 1, title: "Retail Sales Assistant", company: "Fashion Outlet", description: "Help customers find perfect outfits. Part-time position with flexible schedule.", requirements: ["Communication Skills", "Fashion Interest", "Sales Experience"], location: "Penang, Malaysia", salary: "RM 8 - RM 12/hour", type: "Part-time", benefits: "Staff discount, commission on sales", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80", isRemote: false, status: "open" },
      { employer: 1, title: "Store Supervisor", company: "Retail World Sdn Bhd", description: "Supervise daily store operations. Lead a team of sales associates.", requirements: ["Leadership", "Retail Experience", "Customer Service"], location: "Kuala Lumpur, Malaysia", salary: "RM 3000 - RM 4000/month", type: "Full-time", benefits: "Staff discount, medical benefits", image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80", isRemote: false, status: "open" },
      { employer: 1, title: "Visual Merchandiser", company: "Retail World Sdn Bhd", description: "Create attractive store displays. Design window displays and floor layouts.", requirements: ["Creative", "Design Skills", "Retail Knowledge"], location: "Selangor, Malaysia", salary: "RM 2500 - RM 3500/month", type: "Full-time", benefits: "Creative freedom, employee discount", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", isRemote: false, status: "open" },

      // Food Paradise jobs
      { employer: 2, title: "Food Delivery Rider", company: "Quick Eats", description: "Deliver food to customers. Own motorcycle required. Flexible working hours.", requirements: ["Motorcycle License", "Smartphone", "Know Local Area"], location: "Selangor, Malaysia", salary: "RM 12 - RM 18/hour", type: "Part-time", benefits: "Flexible hours, tips, bonuses", image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80", isRemote: false, status: "open" },
      { employer: 2, title: "Restaurant Server", company: "Family Dining", description: "Serve customers in a friendly family restaurant. Evening and weekend shifts.", requirements: ["Customer Service", "Team Player", "Weekend Availability"], location: "Petaling Jaya, Malaysia", salary: "RM 10 - RM 14/hour", type: "Part-time", benefits: "Tips, free meals, great team", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", isRemote: false, status: "open" },
      { employer: 2, title: "Kitchen Helper", company: "Food Paradise", description: "Assist chefs in food preparation. Clean and organize kitchen.", requirements: ["Basic Cooking", "Hygiene Awareness", "Team Player"], location: "Kuala Lumpur, Malaysia", salary: "RM 1800 - RM 2200/month", type: "Full-time", benefits: "Free meals, skill development", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", isRemote: false, status: "open" },
      { employer: 2, title: "Cafe Manager", company: "Coffee Corner", description: "Manage daily cafe operations. Handle staff scheduling and inventory.", requirements: ["F&B Experience", "Leadership", "Customer Service"], location: "Bangsar, Malaysia", salary: "RM 3500 - RM 4500/month", type: "Full-time", benefits: "Performance bonus, meals included", image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80", isRemote: false, status: "open" },

      // Logistics Express jobs
      { employer: 3, title: "Warehouse Packer", company: "Logistics Hub", description: "Pack and prepare orders for shipment. Morning or evening shifts available.", requirements: ["Physical Fitness", "Attention to Detail", "Reliable"], location: "Johor Bahru, Malaysia", salary: "RM 9 - RM 13/hour", type: "Part-time", benefits: "Weekly pay, overtime available", image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80", isRemote: false, status: "open" },
      { employer: 3, title: "Delivery Driver", company: "Logistics Express", description: "Drive company van to deliver packages. Valid driving license required.", requirements: ["Driving License", "Navigation Skills", "Customer Service"], location: "Selangor, Malaysia", salary: "RM 2200 - RM 2800/month", type: "Full-time", benefits: "Fuel allowance, insurance", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80", isRemote: false, status: "open" },
      { employer: 3, title: "Inventory Clerk", company: "Logistics Express", description: "Manage warehouse inventory. Track incoming and outgoing shipments.", requirements: ["Computer Skills", "Organization", "Attention to Detail"], location: "Port Klang, Malaysia", salary: "RM 2000 - RM 2500/month", type: "Full-time", benefits: "Medical benefits, stable hours", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", isRemote: false, status: "open" },

      // Education Hub jobs
      { employer: 4, title: "Tutor - Mathematics", company: "Learning Center", description: "Teach mathematics to secondary school students. Flexible hours, weekend classes.", requirements: ["Math Degree", "Teaching Experience", "Patient"], location: "Kuala Lumpur, Malaysia", salary: "RM 25 - RM 40/hour", type: "Part-time", benefits: "Flexible schedule, rewarding work", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", isRemote: false, status: "open" },
      { employer: 4, title: "English Tutor", company: "Education Hub", description: "Teach English to students of various ages. Help with grammar and conversation.", requirements: ["English Proficiency", "Teaching Skills", "Patient"], location: "Penang, Malaysia", salary: "RM 30 - RM 50/hour", type: "Part-time", benefits: "Flexible hours, online option", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", isRemote: true, status: "open" },
      { employer: 4, title: "Admin Assistant - School", company: "International School", description: "Handle administrative tasks. Manage student records and communication.", requirements: ["Computer Skills", "Organization", "Communication"], location: "Kuala Lumpur, Malaysia", salary: "RM 2200 - RM 2800/month", type: "Full-time", benefits: "School holidays off, medical", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80", isRemote: false, status: "open" },

      // Healthcare Plus jobs
      { employer: 5, title: "Clinic Receptionist", company: "Healthcare Plus", description: "Greet patients and manage appointments. Handle billing and records.", requirements: ["Customer Service", "Computer Skills", "Professional"], location: "Subang Jaya, Malaysia", salary: "RM 2000 - RM 2500/month", type: "Full-time", benefits: "Medical benefits, stable hours", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80", isRemote: false, status: "open" },
      { employer: 5, title: "Healthcare Assistant", company: "Senior Care Home", description: "Assist elderly residents with daily activities. Provide companionship.", requirements: ["Caring Nature", "Patient", "Physical Fitness"], location: "Klang, Malaysia", salary: "RM 1800 - RM 2200/month", type: "Full-time", benefits: "Training provided, meals", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80", isRemote: false, status: "open" },
      { employer: 5, title: "Pharmacy Assistant", company: "MediCare Pharmacy", description: "Assist pharmacist with dispensing. Manage inventory and customer service.", requirements: ["Science Background", "Attention to Detail", "Customer Service"], location: "Kuala Lumpur, Malaysia", salary: "RM 2000 - RM 2600/month", type: "Full-time", benefits: "Staff discount, medical", image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80", isRemote: false, status: "open" },

      // Fashion Forward jobs
      { employer: 6, title: "Fashion Stylist", company: "Fashion Forward", description: "Style clients for photoshoots and events. Create trendy looks.", requirements: ["Fashion Knowledge", "Creativity", "Communication"], location: "Kuala Lumpur, Malaysia", salary: "RM 3000 - RM 4500/month", type: "Full-time", benefits: "Wardrobe allowance, events", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", isRemote: false, status: "open" },
      { employer: 6, title: "Social Media Manager", company: "Fashion Forward", description: "Manage brand social media accounts. Create engaging content.", requirements: ["Social Media Skills", "Creativity", "Fashion Interest"], location: "Kuala Lumpur, Malaysia", salary: "RM 2800 - RM 3800/month", type: "Full-time", benefits: "Flexible hours, creative work", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80", isRemote: true, status: "open" },
      { employer: 6, title: "Sales Associate - Boutique", company: "Chic Boutique", description: "Sell high-end fashion items. Provide personal styling advice.", requirements: ["Fashion Sense", "Sales Skills", "Customer Service"], location: "Pavilion KL, Malaysia", salary: "RM 2200 - RM 3000/month + commission", type: "Full-time", benefits: "Wardrobe discount, commission", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80", isRemote: false, status: "open" },

      // Auto Services jobs
      { employer: 7, title: "Car Wash Attendant", company: "Sparkle Auto Wash", description: "Clean and wash vehicles. Interior and exterior detailing.", requirements: ["Attention to Detail", "Physical Fitness", "Reliable"], location: "Petaling Jaya, Malaysia", salary: "RM 8 - RM 11/hour", type: "Part-time", benefits: "Tips, flexible hours", image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80", isRemote: false, status: "open" },
      { employer: 7, title: "Mechanic Assistant", company: "Auto Services", description: "Assist mechanics with vehicle repairs. Learn automotive skills.", requirements: ["Basic Mechanical Knowledge", "Physical Fitness", "Eager to Learn"], location: "Shah Alam, Malaysia", salary: "RM 1800 - RM 2400/month", type: "Full-time", benefits: "Skills training, tools provided", image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80", isRemote: false, status: "open" },
      { employer: 7, title: "Customer Service - Auto", company: "Auto Services", description: "Handle customer inquiries. Schedule service appointments.", requirements: ["Communication", "Computer Skills", "Customer Service"], location: "Shah Alam, Malaysia", salary: "RM 2000 - RM 2500/month", type: "Full-time", benefits: "Service discount, stable hours", image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80", isRemote: false, status: "open" },

      // Digital Marketing Co jobs
      { employer: 8, title: "Content Writer", company: "Digital Marketing Co", description: "Write engaging blog posts and articles. SEO knowledge a plus.", requirements: ["Writing Skills", "SEO Knowledge", "Creativity"], location: "Kuala Lumpur, Malaysia", salary: "RM 2500 - RM 3500/month", type: "Full-time", benefits: "Remote option, flexible hours", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80", isRemote: true, status: "open" },
      { employer: 8, title: "Graphic Designer", company: "Digital Marketing Co", description: "Create visual content for digital campaigns. Design social media graphics.", requirements: ["Adobe Suite", "Creativity", "Design Skills"], location: "Kuala Lumpur, Malaysia", salary: "RM 2800 - RM 4000/month", type: "Full-time", benefits: "Creative freedom, portfolio building", image: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80", isRemote: true, status: "open" },
      { employer: 8, title: "Digital Marketing Intern", company: "Digital Marketing Co", description: "Learn digital marketing skills. Assist with campaigns and analytics.", requirements: ["Marketing Interest", "Social Media Savvy", "Eager to Learn"], location: "Kuala Lumpur, Malaysia", salary: "RM 1200 - RM 1500/month", type: "Internship", benefits: "Learning opportunities, mentorship", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", isRemote: true, status: "open" },

      // Construction Pro jobs
      { employer: 9, title: "Site Supervisor", company: "Construction Pro", description: "Supervise construction activities. Ensure safety and quality standards.", requirements: ["Construction Experience", "Leadership", "Safety Knowledge"], location: "Johor Bahru, Malaysia", salary: "RM 3500 - RM 5000/month", type: "Full-time", benefits: "Site allowance, insurance", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", isRemote: false, status: "open" },
      { employer: 9, title: "General Worker", company: "Construction Pro", description: "Assist with construction tasks. Physical work on building sites.", requirements: ["Physical Fitness", "Reliability", "Team Player"], location: "Various Locations, Malaysia", salary: "RM 70 - RM 100/day", type: "Contract", benefits: "Daily pay, meals provided", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80", isRemote: false, status: "open" },
      { employer: 9, title: "Project Coordinator", company: "Construction Pro", description: "Coordinate project activities. Manage schedules and documentation.", requirements: ["Project Management", "Communication", "Computer Skills"], location: "Kuala Lumpur, Malaysia", salary: "RM 3000 - RM 4000/month", type: "Full-time", benefits: "Career growth, medical benefits", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", isRemote: false, status: "open" },

      // Additional varied jobs
      { employer: 0, title: "Data Entry Clerk", company: "BPO Services", description: "Enter data into computer systems accurately. Work from home option available.", requirements: ["Typing Skills", "Attention to Detail", "Computer Literate"], location: "Remote, Malaysia", salary: "RM 1800 - RM 2200/month", type: "Full-time", benefits: "Work from home, flexible hours", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", isRemote: true, status: "open" },
      { employer: 1, title: "Event Crew", company: "Event Solutions", description: "Set up and manage events. Weekend and evening work.", requirements: ["Physical Fitness", "Team Player", "Flexible Schedule"], location: "Kuala Lumpur, Malaysia", salary: "RM 80 - RM 120/day", type: "Part-time", benefits: "Free meals at events, networking", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", isRemote: false, status: "open" },
      { employer: 2, title: "Promoter", company: "Brand Promotions", description: "Promote products at malls and events. Engage with customers.", requirements: ["Communication", "Outgoing Personality", "Sales Skills"], location: "Various Locations, Malaysia", salary: "RM 80 - RM 150/day", type: "Part-time", benefits: "Product samples, flexible days", image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&q=80", isRemote: false, status: "open" },
    ];

    for (let i = 0; i < jobData.length; i++) {
      const job = jobData[i];
      const id = await ctx.db.insert("jobs", {
        employerId: employers[job.employer].id,
        title: job.title,
        company: job.company,
        description: job.description,
        requirements: job.requirements,
        location: job.location,
        salary: job.salary,
        type: job.type,
        benefits: job.benefits,
        image: job.image,
        isRemote: job.isRemote,
        status: job.status as "open" | "closed" | "draft",
        createdAt: Date.now() - (i + 1) * 24 * 60 * 60 * 1000,
      });
      jobs.push({ id, ...job });
    }

    // ============================================
    // CANDIDATES (40 candidates linked to seekers)
    // ============================================
    const candidates: any[] = [];
    const candidateData = [
      { seeker: 0, name: "Ali bin Ahmad", email: "seeker1@test.com", phone: "+60 12-111 1111", location: "Kuala Lumpur", experience: "2 years experience", resumeText: "Experienced barista and customer service professional. Worked at Starbucks for 2 years.", skills: ["Coffee Making", "Customer Service", "POS Systems", "Team Work"] },
      { seeker: 1, name: "Mei Ling Tan", email: "seeker2@test.com", phone: "+60 12-222 2222", location: "Penang", experience: "3 years experience", resumeText: "Retail professional with experience in fashion retail. Strong sales track record.", skills: ["Sales", "Fashion", "Customer Service", "Visual Merchandising"] },
      { seeker: 2, name: "Ravi Kumar", email: "seeker3@test.com", phone: "+60 12-333 3333", location: "Johor Bahru", experience: "4 years experience", resumeText: "Experienced delivery rider with own motorcycle. Know JB area well.", skills: ["Delivery", "Navigation", "Customer Service", "Time Management"] },
      { seeker: 3, name: "Nurul Huda", email: "seeker4@test.com", phone: "+60 12-444 4444", location: "Selangor", experience: "5 years experience", resumeText: "Mathematics teacher with degree in Applied Math. Patient and experienced tutor.", skills: ["Mathematics", "Teaching", "Communication", "Patience", "Algebra"] },
      { seeker: 4, name: "Jason Lim", email: "seeker5@test.com", phone: "+60 12-555 5555", location: "Kuala Lumpur", experience: "1 year experience", resumeText: "Fresh graduate in Computer Science. Eager to learn software development.", skills: ["JavaScript", "Python", "HTML/CSS", "Problem Solving"] },
      { seeker: 5, name: "Siti Aminah", email: "seeker6@test.com", phone: "+60 12-666 6666", location: "Melaka", experience: "3 years experience", resumeText: "Restaurant server with F&B experience. Great with customers.", skills: ["F&B Service", "Customer Service", "Team Work", "Communication"] },
      { seeker: 6, name: "Kelvin Ong", email: "seeker7@test.com", phone: "+60 12-777 7777", location: "Penang", experience: "2 years experience", resumeText: "Warehouse worker with experience in packing and inventory.", skills: ["Warehouse Operations", "Inventory", "Packing", "Physical Fitness"] },
      { seeker: 7, name: "Farah Nadia", email: "seeker8@test.com", phone: "+60 12-888 8888", location: "Selangor", experience: "4 years experience", resumeText: "Admin professional with strong computer skills. Experience in healthcare.", skills: ["Administration", "Microsoft Office", "Data Entry", "Communication"] },
      { seeker: 8, name: "Muthu Krishnan", email: "seeker9@test.com", phone: "+60 12-999 9999", location: "Ipoh", experience: "6 years experience", resumeText: "Experienced mechanic with certification. Specialized in car repairs.", skills: ["Automotive Repair", "Diagnostics", "Customer Service", "Problem Solving"] },
      { seeker: 9, name: "Amanda Chong", email: "seeker10@test.com", phone: "+60 13-111 1111", location: "Kuala Lumpur", experience: "3 years experience", resumeText: "Graphic designer with portfolio in digital marketing materials.", skills: ["Adobe Photoshop", "Illustrator", "InDesign", "Creativity"] },
      { seeker: 10, name: "Ibrahim Hassan", email: "seeker11@test.com", phone: "+60 13-222 2222", location: "Johor Bahru", experience: "5 years experience", resumeText: "Construction supervisor with safety certification.", skills: ["Construction", "Safety", "Leadership", "Project Management"] },
      { seeker: 11, name: "Grace Wong", email: "seeker12@test.com", phone: "+60 13-333 3333", location: "Kuching", experience: "2 years experience", resumeText: "Content writer with SEO knowledge. English and Malay fluent.", skills: ["Writing", "SEO", "Content Marketing", "Social Media"] },
      { seeker: 12, name: "Aziz Mahmud", email: "seeker13@test.com", phone: "+60 13-444 4444", location: "Kota Kinabalu", experience: "3 years experience", resumeText: "Delivery driver with clean record. Own vehicle.", skills: ["Driving", "Navigation", "Customer Service", "Time Management"] },
      { seeker: 13, name: "Priya Devi", email: "seeker14@test.com", phone: "+60 13-555 5555", location: "Selangor", experience: "4 years experience", resumeText: "Healthcare assistant with elderly care experience.", skills: ["Healthcare", "Patient Care", "First Aid", "Empathy"] },
      { seeker: 14, name: "Boon Heng", email: "seeker15@test.com", phone: "+60 13-666 6666", location: "Kuala Lumpur", experience: "2 years experience", resumeText: "IT support professional with networking knowledge.", skills: ["IT Support", "Networking", "Troubleshooting", "Customer Service"] },
      { seeker: 15, name: "Zainab Omar", email: "seeker16@test.com", phone: "+60 13-777 7777", location: "Penang", experience: "3 years experience", resumeText: "English tutor with TESL certification. Online teaching experience.", skills: ["English", "Teaching", "Online Education", "Communication"] },
      { seeker: 16, name: "Andy Tan", email: "seeker17@test.com", phone: "+60 13-888 8888", location: "Selangor", experience: "1 year experience", resumeText: "Social media manager for small businesses. Instagram and TikTok expert.", skills: ["Social Media", "Content Creation", "Marketing", "Photography"] },
      { seeker: 17, name: "Roslan Karim", email: "seeker18@test.com", phone: "+60 13-999 9999", location: "Melaka", experience: "4 years experience", resumeText: "Event crew with experience in large-scale events.", skills: ["Event Management", "Physical Fitness", "Team Work", "Setup"] },
      { seeker: 18, name: "Christina Yap", email: "seeker19@test.com", phone: "+60 14-111 1111", location: "Kuala Lumpur", experience: "5 years experience", resumeText: "Fashion stylist with magazine and advertising experience.", skills: ["Fashion Styling", "Trend Analysis", "Communication", "Creativity"] },
      { seeker: 19, name: "Hafizul Azmi", email: "seeker20@test.com", phone: "+60 14-222 2222", location: "Johor Bahru", experience: "3 years experience", resumeText: "Promoter with excellent communication skills. Bilingual.", skills: ["Promotion", "Sales", "Communication", "Customer Engagement"] },
      // Additional candidates without seeker accounts
      { seeker: null, name: "Lee Chun Wei", email: "leechunwei@email.com", phone: "+60 14-333 3333", location: "Kuala Lumpur", experience: "2 years experience", resumeText: "Cafe barista with latte art skills.", skills: ["Coffee Making", "Latte Art", "Customer Service"] },
      { seeker: null, name: "Aisha Binti Yusof", email: "aishayusof@email.com", phone: "+60 14-444 4444", location: "Selangor", experience: "1 year experience", resumeText: "Part-time student worker seeking flexible jobs.", skills: ["Customer Service", "Quick Learner", "Flexible"] },
      { seeker: null, name: "Daniel Fernandez", email: "danielf@email.com", phone: "+60 14-555 5555", location: "Penang", experience: "4 years experience", resumeText: "Restaurant supervisor with F&B management experience.", skills: ["F&B Management", "Leadership", "Customer Service", "Inventory"] },
      { seeker: null, name: "Nur Syafiqah", email: "nursyafiqah@email.com", phone: "+60 14-666 6666", location: "Kuala Lumpur", experience: "2 years experience", resumeText: "Pharmacy assistant with medical knowledge.", skills: ["Pharmacy", "Customer Service", "Inventory", "Medical Knowledge"] },
      { seeker: null, name: "Kevin Teo", email: "kevinteo@email.com", phone: "+60 14-777 7777", location: "Johor Bahru", experience: "3 years experience", resumeText: "Warehouse supervisor with logistics experience.", skills: ["Warehouse Management", "Logistics", "Leadership", "Inventory"] },
      { seeker: null, name: "Fatimah Zahra", email: "fatimahz@email.com", phone: "+60 14-888 8888", location: "Selangor", experience: "5 years experience", resumeText: "Senior healthcare worker with nursing background.", skills: ["Nursing", "Patient Care", "Healthcare", "First Aid"] },
      { seeker: null, name: "Marcus Loh", email: "marcusloh@email.com", phone: "+60 14-999 9999", location: "Kuala Lumpur", experience: "2 years experience", resumeText: "Digital marketing specialist with Google Ads certification.", skills: ["Digital Marketing", "Google Ads", "SEO", "Analytics"] },
      { seeker: null, name: "Intan Suria", email: "intansuria@email.com", phone: "+60 15-111 1111", location: "Melaka", experience: "3 years experience", resumeText: "Visual merchandiser with retail display experience.", skills: ["Visual Merchandising", "Retail", "Creativity", "Design"] },
      { seeker: null, name: "Raymond Ng", email: "raymondng@email.com", phone: "+60 15-222 2222", location: "Penang", experience: "4 years experience", resumeText: "IT technician with hardware and software expertise.", skills: ["IT Support", "Hardware Repair", "Software", "Networking"] },
      { seeker: null, name: "Salmah Ismail", email: "salmahismail@email.com", phone: "+60 15-333 3333", location: "Kuala Lumpur", experience: "6 years experience", resumeText: "Executive assistant with corporate experience.", skills: ["Administration", "Executive Support", "Scheduling", "Communication"] },
      { seeker: null, name: "Vincent Chow", email: "vincentchow@email.com", phone: "+60 15-444 4444", location: "Selangor", experience: "2 years experience", resumeText: "Car wash detailer with premium vehicle experience.", skills: ["Auto Detailing", "Customer Service", "Attention to Detail"] },
      { seeker: null, name: "Zainal Abidin", email: "zainalabidin@email.com", phone: "+60 15-555 5555", location: "Johor Bahru", experience: "7 years experience", resumeText: "Construction foreman with project management skills.", skills: ["Construction", "Project Management", "Leadership", "Safety"] },
      { seeker: null, name: "Emily Tan", email: "emilytan@email.com", phone: "+60 15-666 6666", location: "Kuala Lumpur", experience: "3 years experience", resumeText: "Fashion retail manager with luxury brand experience.", skills: ["Retail Management", "Fashion", "Customer Service", "Sales"] },
      { seeker: null, name: "Ahmad Firdaus", email: "ahmadfirdaus@email.com", phone: "+60 15-777 7777", location: "Selangor", experience: "2 years experience", resumeText: "Delivery rider with excellent area knowledge.", skills: ["Delivery", "Navigation", "Customer Service", "Motorcycling"] },
      { seeker: null, name: "Cheng Mei Fong", email: "chengmeifong@email.com", phone: "+60 15-888 8888", location: "Penang", experience: "4 years experience", resumeText: "Senior tutor in Science and Mathematics.", skills: ["Teaching", "Science", "Mathematics", "Patience"] },
      { seeker: null, name: "Rashid Omar", email: "rashidomar@email.com", phone: "+60 15-999 9999", location: "Kuala Lumpur", experience: "3 years experience", resumeText: "Event coordinator with corporate event experience.", skills: ["Event Coordination", "Planning", "Communication", "Logistics"] },
      { seeker: null, name: "Jasmine Lee", email: "jasminelee@email.com", phone: "+60 16-111 1111", location: "Selangor", experience: "2 years experience", resumeText: "Social media content creator with photography skills.", skills: ["Content Creation", "Photography", "Social Media", "Editing"] },
      { seeker: null, name: "Muhammad Iqbal", email: "muhammadiqbal@email.com", phone: "+60 16-222 2222", location: "Johor Bahru", experience: "5 years experience", resumeText: "Store manager with multi-store management experience.", skills: ["Store Management", "Sales", "Leadership", "Inventory"] },
      { seeker: null, name: "Susan Wong", email: "susanwong@email.com", phone: "+60 16-333 3333", location: "Kuala Lumpur", experience: "3 years experience", resumeText: "Clinic receptionist with medical admin experience.", skills: ["Medical Admin", "Reception", "Customer Service", "Scheduling"] },
      { seeker: null, name: "Arif Zakaria", email: "arifzakaria@email.com", phone: "+60 16-444 4444", location: "Melaka", experience: "2 years experience", resumeText: "Kitchen helper with culinary school background.", skills: ["Cooking", "Kitchen Operations", "Food Prep", "Hygiene"] },
    ];

    const statuses: ("new" | "screening" | "interviewed" | "hired" | "rejected")[] = ["new", "screening", "interviewed", "hired", "rejected"];

    for (let i = 0; i < candidateData.length; i++) {
      const candidate = candidateData[i];
      const id = await ctx.db.insert("candidates", {
        userId: candidate.seeker !== null ? seekers[candidate.seeker].id : undefined,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        location: candidate.location,
        experience: candidate.experience,
        resumeText: candidate.resumeText,
        skills: candidate.skills,
        status: statuses[i % statuses.length],
        createdAt: Date.now() - (i + 1) * 24 * 60 * 60 * 1000,
      });
      candidates.push({ id, ...candidate });
    }

    // ============================================
    // APPLICATIONS (60 applications)
    // ============================================
    const applications: any[] = [];
    const applicationStatuses: ("pending" | "reviewed" | "shortlisted" | "rejected" | "hired")[] = ["pending", "reviewed", "shortlisted", "rejected", "hired"];

    for (let i = 0; i < 60; i++) {
      const jobIndex = i % jobs.length;
      const candidateIndex = i % candidates.length;
      const status = applicationStatuses[i % applicationStatuses.length];

      const id = await ctx.db.insert("applications", {
        jobId: jobs[jobIndex].id,
        candidateId: candidates[candidateIndex].id,
        status: status,
        aiScore: Math.floor(Math.random() * 40) + 60, // 60-100
        notes: status === "reviewed" ? "Reviewed by HR team" : status === "shortlisted" ? "Strong candidate, schedule interview" : undefined,
        createdAt: Date.now() - (i + 1) * 12 * 60 * 60 * 1000, // Every 12 hours
      });
      applications.push({ id, jobIndex, candidateIndex, status });
    }

    // ============================================
    // EMPLOYEES (25 hired employees)
    // ============================================
    const hiredApps = applications.filter(app => app.status === "hired");
    for (let i = 0; i < Math.min(25, hiredApps.length); i++) {
      const app = hiredApps[i];
      const job = jobs[app.jobIndex];
      await ctx.db.insert("employees", {
        jobId: jobs[app.jobIndex].id,
        candidateId: candidates[app.candidateIndex].id,
        employerId: employers[job.employer].id,
        applicationId: app.id,
        hiredDate: Date.now() - (i * 3 + 5) * 24 * 60 * 60 * 1000,
        status: i % 5 === 0 ? "inactive" : "active",
        salary: job.salary,
        startDate: Date.now() - (i * 3) * 24 * 60 * 60 * 1000,
      });
    }

    // ============================================
    // PAYMENTS (35 payments)
    // ============================================
    const paymentStatuses: ("pending" | "completed" | "ongoing" | "cancelled")[] = ["pending", "completed", "ongoing", "cancelled"];
    const paymentMethods = ["Bank Transfer", "E-Wallet", "Online Banking", "Cash"];

    for (let i = 0; i < 35; i++) {
      const jobIndex = i % jobs.length;
      const candidateIndex = i % candidates.length;
      const status = paymentStatuses[i % paymentStatuses.length];
      const amount = (Math.floor(Math.random() * 20) + 5) * 50; // 250-1250 RM

      await ctx.db.insert("payments", {
        jobId: jobs[jobIndex].id,
        candidateId: candidates[candidateIndex].id,
        amount: amount,
        currency: "RM",
        status: status,
        dateRange: `${1 + (i % 28)}/${11 + Math.floor(i / 28)} - ${7 + (i % 24)}/${12}`,
        description: `${jobs[jobIndex].title} - Work completed • RM ${Math.floor(amount / 7)}/day`,
        paymentMethod: paymentMethods[i % paymentMethods.length],
        transactionId: status === "completed" ? `TXN-2024-00${1000 + i}` : undefined,
        createdAt: Date.now() - (i + 1) * 2 * 24 * 60 * 60 * 1000,
      });
    }

    // ============================================
    // SAVED JOBS (30 saved jobs)
    // ============================================
    for (let i = 0; i < 30; i++) {
      const candidateIndex = i % 20; // Only first 20 candidates have accounts
      const jobIndex = (i * 3) % jobs.length;

      await ctx.db.insert("savedJobs", {
        candidateId: candidates[candidateIndex].id,
        jobId: jobs[jobIndex].id,
        savedAt: Date.now() - (i + 1) * 6 * 60 * 60 * 1000,
      });
    }

    // ============================================
    // WITHDRAWALS (25 withdrawals)
    // ============================================
    const withdrawalStatuses: ("pending" | "approved" | "completed" | "rejected")[] = ["pending", "approved", "completed", "rejected"];
    const banks = ["Maybank", "CIMB Bank", "Public Bank", "RHB Bank", "Hong Leong Bank", "AmBank", "Bank Islam"];

    for (let i = 0; i < 25; i++) {
      const candidateIndex = i % 20;
      const amount = (Math.floor(Math.random() * 10) + 2) * 100; // 200-1200 RM

      await ctx.db.insert("withdrawals", {
        candidateId: candidates[candidateIndex].id,
        amount: amount,
        bankName: banks[i % banks.length],
        accountNumber: `${1234567890 + i * 111}`,
        status: withdrawalStatuses[i % withdrawalStatuses.length],
        createdAt: Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000,
      });
    }

    // ============================================
    // CONVERSATIONS (20 conversation messages)
    // ============================================
    const conversationMessages = [
      { role: "user", content: "Hi, I'm looking for a part-time job" },
      { role: "assistant", content: "Hello! I'd be happy to help you find a part-time job. What type of work are you interested in?" },
      { role: "user", content: "I'm a student and I need flexible hours" },
      { role: "assistant", content: "Great! We have several flexible part-time positions. Would you prefer retail, F&B, or office work?" },
      { role: "user", content: "F&B sounds good" },
      { role: "assistant", content: "We have barista, server, and kitchen helper positions available. Shall I show you the details?" },
      { role: "user", content: "How do I apply for the barista job?" },
      { role: "assistant", content: "You can click on the job listing and fill out the application form. Would you like me to guide you through the process?" },
      { role: "user", content: "What's the salary for delivery riders?" },
      { role: "assistant", content: "Delivery riders typically earn RM 12-18 per hour, plus tips and bonuses for high performance." },
    ];

    for (let i = 0; i < conversationMessages.length; i++) {
      await ctx.db.insert("conversations", {
        participantId: `user_${Math.floor(i / 4)}`,
        role: conversationMessages[i].role as "user" | "assistant",
        content: conversationMessages[i].content,
        timestamp: Date.now() - (conversationMessages.length - i) * 5 * 60 * 1000,
      });
    }

    return {
      message: "Comprehensive seed data created successfully!",
      counts: {
        employers: employers.length,
        seekers: seekers.length,
        jobs: jobs.length,
        candidates: candidates.length,
        applications: 60,
        employees: Math.min(25, hiredApps.length),
        payments: 35,
        savedJobs: 30,
        withdrawals: 25,
        conversations: conversationMessages.length,
      },
      totalEntries: employers.length + seekers.length + jobs.length + candidates.length + 60 + Math.min(25, hiredApps.length) + 35 + 30 + 25 + conversationMessages.length,
    };
  },
});

// Clear all data (useful for re-seeding)
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = ["employees", "withdrawals", "savedJobs", "payments", "applications", "candidates", "jobs", "conversations", "sessions", "users"];
    let deleted = 0;
    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
        deleted++;
      }
    }
    return { message: "All data cleared", deletedCount: deleted };
  },
});
