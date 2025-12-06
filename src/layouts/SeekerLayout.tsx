import { ReactNode, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import {
  LayoutDashboard,
  Search,
  Bookmark,
  FileText,
  User,
  Settings,
  Menu,
  X,
  Wallet,
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
  { to: '/seeker/settings', label: 'Settings', icon: Settings },
]

export const SeekerLayout = ({ children }: SeekerLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default to open on desktop

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf9f7' }}>
      <Header />

      <div className="flex-1 flex">
        {/* Sidebar Drawer */}
        <aside
          className={`
            fixed left-0 z-40
            w-64 sm:w-72
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{
            background: 'linear-gradient(180deg, #94618e 0%, #7a4f73 100%)',
            top: '64px',
            height: 'calc(100vh - 64px)'
          }}
        >
          <div className="h-full overflow-y-auto">
            {/* Sidebar Header with Toggle */}
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b-2" style={{ borderColor: 'rgba(248, 238, 231, 0.2)' }}>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: '#f8eee7' }}>
                Job Seeker Portal
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10"
                style={{ color: '#f8eee7' }}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 px-3 sm:px-4 py-4">
              {seekerNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10"
                    style={{ color: '#f8eee7' }}
                    activeProps={{
                      style: { backgroundColor: '#f8eee7', color: '#94618e' },
                      className: 'flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 font-semibold',
                    }}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Floating Toggle Button - Only visible when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-20 left-4 z-50 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
            style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Main Content - shifts when sidebar is open */}
        <main
          className={`
            flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'ml-64 sm:ml-72' : 'ml-0'}
          `}
          style={{ marginTop: '64px' }}
        >
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}
