import { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  showBackButton?: boolean
}

export const AuthLayout = ({ children, showBackButton = true }: AuthLayoutProps) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8eee7' }}>
      {/* Header with Back Button */}
      {showBackButton && (
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: '#94618e',
              color: '#f8eee7',
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Back</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer Text */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 text-center">
        <p className="text-xs sm:text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
          © 2024 CEPATHIRE. All rights reserved.
        </p>
      </div>
    </div>
  )
}
