import { ReactNode, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Search,
  Bookmark,
  FileText,
  User,
  Menu,
  X,
  Wallet,
  LogOut,
} from 'lucide-react'

interface SeekerLayoutProps {
  children: ReactNode
}

const seekerNavItems = [
  { to: '/seeker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/seeker/browse-jobs', label: 'Browse Jobs', icon: Search },
  { to: '/seeker/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { to: '/seeker/applications', label: 'My Applications', icon: FileText },
  { to: '/seeker/payments', label: 'My Earnings', icon: Wallet },
  { to: '/seeker/profile', label: 'Profile', icon: User },
]

export const SeekerLayout = ({ children }: SeekerLayoutProps) => {
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
        {/* Sidebar Drawer */}
        <aside
          className={`
            h-[calc(100vh-4rem)] z-40
            transition-all duration-300 ease-in-out
            shadow-xl overflow-hidden
            ${sidebarOpen ? 'w-64 sm:w-72' : 'w-0'}
          `}
          style={{ backgroundColor: '#f8eee7' }}
        >
          <div className="h-full overflow-y-auto border-r-2 pt-6 pb-6 flex flex-col w-64 sm:w-72 shrink-0" style={{ borderColor: '#94618e' }}>
            {/* Header with Close Button */}
            <div className="px-4 sm:px-6 mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#94618e' }}>
                Job Seeker Portal
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-opacity-10 transition-all duration-200"
                style={{ backgroundColor: '#94618e20' }}
                aria-label="Close sidebar"
              >
                <X size={20} style={{ color: '#94618e' }} />
              </button>
            </div>

            <nav className="space-y-1 px-3 sm:px-4 flex-1">
              {seekerNavItems.map((item) => {
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

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
          {/* Menu Toggle Button - Shows when drawer is closed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed top-20 left-4 z-50 p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}
