import { Link } from '@tanstack/react-router'
import { Button } from './Button'
import { useState } from 'react'
import {
  ChevronDown,
  Home,
  Briefcase,
  Users,
  Search,
  FileText,
  BookOpen,
  Award,
  Building2,
  UserPlus,
  Menu,
  X,
} from 'lucide-react'

interface HeaderProps {
  showAuth?: boolean
}

export const Header = ({ showAuth = false }: HeaderProps) => {
  const [employerExpanded, setEmployerExpanded] = useState(false)
  const [seekerExpanded, setSeekerExpanded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="shadow-lg" style={{ backgroundColor: '#94618e' }}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-wide" style={{ color: '#f8eee7' }}>
            CEPATHIRE
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-opacity-20 transition-all"
            style={{ color: '#f8eee7', backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {showAuth && (
              <div className="flex items-center gap-2 mr-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="md">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="secondary" size="md">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
              style={{ color: '#f8eee7' }}
              activeProps={{
                className: 'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                style: { backgroundColor: '#f8eee7', color: '#94618e' }
              }}
            >
              <Home size={18} />
              <span className="font-medium">Home</span>
            </Link>

            {/* For Employers Dropdown - Only show when logged in */}
            {!showAuth && <div className="relative">
              <button
                onClick={() => setEmployerExpanded(!employerExpanded)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
                style={{ color: '#f8eee7' }}
              >
                <Briefcase size={18} />
                <span className="font-medium">For Employers</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${employerExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {employerExpanded && (
                <div
                  className="absolute top-full right-0 mt-2 w-56 rounded-lg shadow-xl overflow-hidden z-50"
                  style={{ backgroundColor: '#f8eee7' }}
                >
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-opacity-80"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <UserPlus size={18} />
                    <span className="font-medium">Post a Job</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Search size={18} />
                    <span className="font-medium">Search Candidates</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Building2 size={18} />
                    <span className="font-medium">Pricing Plans</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Award size={18} />
                    <span className="font-medium">Hiring Solutions</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <BookOpen size={18} />
                    <span className="font-medium">Resources</span>
                  </a>
                </div>
              )}
            </div>}

            {/* For Job Seekers Dropdown - Only show when logged in */}
            {!showAuth && <div className="relative">
              <button
                onClick={() => setSeekerExpanded(!seekerExpanded)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
                style={{ color: '#f8eee7' }}
              >
                <Users size={18} />
                <span className="font-medium">For Job Seekers</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${seekerExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {seekerExpanded && (
                <div
                  className="absolute top-full right-0 mt-2 w-56 rounded-lg shadow-xl overflow-hidden z-50"
                  style={{ backgroundColor: '#f8eee7' }}
                >
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Search size={18} />
                    <span className="font-medium">Browse Jobs</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FileText size={18} />
                    <span className="font-medium">Resume Builder</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Award size={18} />
                    <span className="font-medium">Career Advice</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <BookOpen size={18} />
                    <span className="font-medium">Interview Tips</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ color: '#94618e' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8dcd7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Briefcase size={18} />
                    <span className="font-medium">Salary Guide</span>
                  </a>
                </div>
              )}
            </div>}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-2">
            {showAuth && (
              <div className="flex flex-col gap-2 mb-4">
                <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="md" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" fullWidth>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{ color: '#f8eee7' }}
              onClick={() => setMobileMenuOpen(false)}
              activeProps={{
                className: 'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                style: { backgroundColor: '#f8eee7', color: '#94618e' }
              }}
            >
              <Home size={18} />
              <span className="font-medium">Home</span>
            </Link>

            {/* Mobile Employers Menu - Only show when logged in */}
            {!showAuth && <div>
              <button
                onClick={() => setEmployerExpanded(!employerExpanded)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200"
                style={{ color: '#f8eee7' }}
              >
                <div className="flex items-center gap-2">
                  <Briefcase size={18} />
                  <span className="font-medium">For Employers</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${employerExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {employerExpanded && (
                <div className="ml-6 mt-2 space-y-1">
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <UserPlus size={16} />
                    <span>Post a Job</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <Search size={16} />
                    <span>Search Candidates</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <Building2 size={16} />
                    <span>Pricing Plans</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <Award size={16} />
                    <span>Hiring Solutions</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <BookOpen size={16} />
                    <span>Resources</span>
                  </a>
                </div>
              )}
            </div>}

            {/* Mobile Seekers Menu - Only show when logged in */}
            {!showAuth && <div>
              <button
                onClick={() => setSeekerExpanded(!seekerExpanded)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200"
                style={{ color: '#f8eee7' }}
              >
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span className="font-medium">For Job Seekers</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${seekerExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {seekerExpanded && (
                <div className="ml-6 mt-2 space-y-1">
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <Search size={16} />
                    <span>Browse Jobs</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <FileText size={16} />
                    <span>Resume Builder</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <Award size={16} />
                    <span>Career Advice</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <BookOpen size={16} />
                    <span>Interview Tips</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    <Briefcase size={16} />
                    <span>Salary Guide</span>
                  </a>
                </div>
              )}
            </div>}
          </nav>
        )}
      </div>
    </header>
  )
}
