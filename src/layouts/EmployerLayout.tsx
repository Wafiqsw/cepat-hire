import { ReactNode, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { FloatingChatButton } from '../components/AIChat'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Menu,
  X,
  Wallet,
  LogOut,
} from 'lucide-react'

interface EmployerLayoutProps {
  children: ReactNode
}

const employerNavItems = [
  { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employer/joblist', label: 'My Job Posts', icon: Briefcase },
  { to: '/employer/applications', label: 'Applicants', icon: Users },
  { to: '/employer/payments', label: 'Payments', icon: Wallet },
]

export const EmployerLayout = ({ children }: EmployerLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf9f7' }}>
      <Header />

      <div className="flex-1 flex">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen lg:h-auto
            w-64 lg:w-72 z-40 lg:z-auto
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{ backgroundColor: '#f8eee7' }}
        >
          <div className="h-full overflow-y-auto border-r-2 pt-6 pb-20 lg:pb-6 flex flex-col" style={{ borderColor: '#94618e' }}>
            <div className="px-4 sm:px-6 mb-6">
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#94618e' }}>
                Employer Portal
              </h2>
            </div>

            <nav className="space-y-1 px-3 sm:px-4 flex-1">
              {employerNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ color: '#94618e' }}
                    activeProps={{
                      style: { backgroundColor: '#94618e', color: '#f8eee7' },
                      className: 'flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200',
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Logout Button */}
            <div className="px-3 sm:px-4 mt-4 border-t-2 pt-4" style={{ borderColor: '#94618e' }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  color: '#dc2626',
                  backgroundColor: 'transparent',
                  border: '2px solid #dc2626'
                }}
              >
                <LogOut size={20} />
                <span className="font-medium text-sm sm:text-base">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>

      <Footer />

      {/* AI Chat Assistant */}
      <FloatingChatButton />
    </div>
  )
}
