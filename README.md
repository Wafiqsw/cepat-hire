# README

# CEPATHIRE

**Connect Talent with Opportunity**

CEPATHIRE is an **AI-powered** job hiring platform that connects employers with talented job seekers. Leveraging cutting-edge agentic AI technology, CEPATHIRE revolutionizes the hiring process by enabling employers to create job postings through simple prompts and allowing job seekers to auto-apply to relevant positions with AI assistance.

![CEPATHIRE](./src/logo.svg)

CEPATHIRE

## 🤖 AI-Powered Features

### Agentic AI for Employers

**Create Job Postings with Natural Language Prompts**

Forget complex forms! Simply describe what you’re looking for, and our AI agent will:
- Generate complete, professional job descriptions
- Suggest appropriate salary ranges based on market data
- Recommend required skills and qualifications
- Format and structure the posting automatically

**Example Prompt:**
> “I need a part-time worker for my data entry project.”

The AI instantly creates a comprehensive job posting ready to publish!

### Agentic AI for Job Seekers

**Auto-Apply to Jobs with AI Assistance**

Our intelligent agent streamlines your job search:
- **Smart Job Discovery** - AI analyzes your profile and suggests matching opportunities
- **Automated Applications** - Simply prompt the AI to apply to jobs that match your criteria

**Example Prompt:**
> “Apply to all React developer positions in remote locations with salary above $100k”

The AI finds matching jobs and submits applications on your behalf!

## 🌟 Features

### For Employers

- **🤖 AI Job Posting Creation** - Create complete job postings using natural language prompts
- **Post Jobs in Seconds** - No complex forms - just describe what you need
- **AI-Generated Descriptions** - Professional job descriptions created automatically
- **Find Top Talent** - Connect with skilled professionals ready to join your team
- **Smart Matching** - AI-powered candidate matching algorithm
- **Applicant Management** - Review and manage job applications efficiently

### For Job Seekers

- **🤖 AI Auto-Apply** - Apply to multiple jobs automatically with simple prompts
- **AI Job Matching** - Get personalized job recommendations based on your profile
- **Smart Job Discovery** - AI analyzes and suggests the best opportunities for you
- **Automated Cover Letters** - AI generates tailored cover letters for each application
- **Browse Jobs** - Search and filter through thousands of job opportunities
- **Application Tracking** - Track all your AI-assisted and manual applications
- **Save Jobs** - Bookmark interesting positions for later
- **Profile Management** - Create and update your professional profile
- **Work History** - Showcase your experience and skills

### Platform Features

- **Agentic AI Technology** - Advanced AI agents that understand and execute complex tasks
- **Natural Language Processing** - Communicate with the platform using everyday language
- **Secure Authentication** - Security for user data
- **Real-time Updates** - Powered by Convex for real-time data synchronization
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Built with Tailwind CSS for a beautiful user experience
- **Fast Performance** - Optimized with Vite and TanStack Router

## 🚀 Tech Stack

- **Frontend Framework**: React 19
- **Routing**: TanStack Router (File-based routing)
- **State Management**: TanStack Query (React Query)
- **Backend**: Convex (Real-time database and backend)
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Deployment**: Cloudflare Workers
- **Language**: TypeScript
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## 🛠️ Installation

1. **Clone the repository**
    
    ```bash
    git clone <repository-url>cd cepat-hire
    ```
    
2. **Install dependencies**
    
    ```bash
    npm install
    ```
    
3. **Set up environment variables**
    
    Create a `.env.local` file in the root directory and add your Convex configuration:
    
    ```
    VITE_CONVEX_URL=your_convex_url_here
    ```
    
4. **Start the development server**
    
    ```bash
    npm run dev
    ```
    
    The application will be available at `http://localhost:3000`
    

## 📦 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run serve` | Preview production build |
| `npm test` | Run tests with Vitest |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run check` | Format and lint code |
| `npm run deploy` | Deploy to Cloudflare Workers |

## 🏗️ Project Structure

```
cepat-hire/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── JobCard.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layouts/             # Layout components
│   │   └── StandardLayout.tsx
│   ├── routes/              # File-based routing
│   │   ├── index.tsx        # Landing page
│   │   ├── home.tsx         # Main dashboard
│   │   ├── auth/            # Authentication routes
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── seeker/          # Job seeker routes
│   │   │   ├── browse-jobs.tsx
│   │   │   ├── applications.tsx
│   │   │   ├── saved-jobs.tsx
│   │   │   └── profile.tsx
│   │   └── employer/        # Employer routes
│   │       └── payments.tsx
│   ├── data/                # Data utilities
│   ├── router.tsx           # Router configuration
│   └── styles.css           # Global styles
├── convex/                  # Convex backend
│   └── _generated/          # Auto-generated Convex files
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc          # Cloudflare Workers config
```

## 🎨 Styling

This project uses **Tailwind CSS 4** for styling. The design system includes:
- Custom color palette with brand colors
- Responsive utilities for mobile-first design
- Component-based styling approach
- Smooth transitions and animations

## 🔐 Authentication

CEPATHIRE supports two types of user accounts:
- **Job Seekers** - For individuals looking for employment
- **Employers** - For companies posting job opportunities

Authentication is handled securely with Convex backend integration.

## 🗄️ Database

The application uses **Convex** as its backend and database solution, providing:
- Real-time data synchronization
- Type-safe queries and mutations
- Serverless architecture
- Built-in authentication

## 🧪 Testing

Run tests using Vitest:

```bash
npm test
```

The project includes:
- Unit tests for components
- Integration tests for key features
- Testing utilities from @testing-library/react

## 🚢 Deployment

### Cloudflare Workers

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

# Building For Productions

Build for production:

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 🔧 Configuration Files

- **vite.config.ts** - Vite configuration
- **tsconfig.json** - TypeScript configuration
- **eslint.config.js** - ESLint rules
- **prettier.config.js** - Prettier formatting rules
- **wrangler.jsonc** - Cloudflare Workers deployment config

## 📱 Key Routes

| Route | Description |
| --- | --- |
| `/` | Landing page with platform overview |
| `/auth/login` | User login |
| `/auth/register` | User registration |
| `/home` | Main dashboard |
| `/seeker/browse-jobs` | Browse available jobs |
| `/seeker/applications` | View job applications |
| `/seeker/saved-jobs` | Saved job listings |
| `/seeker/profile` | Job seeker profile |
| `/employer/payments` | Employer payment management |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Quality

This project maintains high code quality standards:

- **ESLint** - Configured with TanStack ESLint config
- **Prettier** - Consistent code formatting
- **TypeScript** - Type safety throughout the codebase
- **Testing** - Comprehensive test coverage with Vitest

Run quality checks:

```bash
npm run check
```

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use, modify the dev script in `package.json`:

```json
"dev": "vite dev --port 3001"
```

### Convex Connection Issues

Ensure your `.env.local` file has the correct `VITE_CONVEX_URL` value from your Convex dashboard.

### Build Errors

Clear the cache and reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Convex Documentation](https://docs.convex.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## 📄 License

This project is private and proprietary.

## 👥 Team

Built by a talented team of full-stack developers dedicated to creating the best job hiring experience.

---

**CEPATHIRE** - Making hiring fast, easy, and efficient. 🚀