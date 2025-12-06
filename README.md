# CEPATHIRE

**Connect Talent with Opportunity**

CEPATHIRE is a modern job hiring platform that connects employers with talented job seekers. Built with cutting-edge web technologies, it provides a seamless experience for posting jobs, browsing opportunities, and managing applications.

![CEPATHIRE](./src/logo.svg)

## 🌟 Features

### For Employers
- **Post Jobs Easily** - Create and manage job postings in minutes
- **Find Top Talent** - Connect with skilled professionals ready to join your team
- **Smart Matching** - Algorithm-based candidate matching
- **Applicant Management** - Review and manage job applications efficiently
- **Payment Integration** - Secure payment processing for job postings

### For Job Seekers
- **Browse Jobs** - Search and filter through thousands of job opportunities
- **Smart Matching** - Get matched with relevant job opportunities
- **Application Tracking** - Track all your job applications in one place
- **Save Jobs** - Bookmark interesting positions for later
- **Profile Management** - Create and update your professional profile
- **Work History** - Showcase your experience and skills

### Platform Features
- **Secure Authentication** - Enterprise-level security for user data
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
   git clone <repository-url>
   cd cepat-hire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add your Convex configuration:
   ```env
   VITE_CONVEX_URL=your_convex_url_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
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
|-------|-------------|
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
- [Convex Documentation](https://docs.convex.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

## 📄 License

This project is private and proprietary.

## 👥 Team

Built by a talented team of full-stack developers dedicated to creating the best job hiring experience.

---

**CEPATHIRE** - Making hiring fast, easy, and efficient. 🚀
