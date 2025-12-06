import { Link } from '@tanstack/react-router'
import { Button } from './Button'

interface HeaderProps {
  showAuth?: boolean
}

export const Header = ({ showAuth = false }: HeaderProps) => {
  return (
    <header className="shadow-lg" style={{ backgroundColor: '#94618e' }}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-wide" style={{ color: '#f8eee7' }}>
            CEPATHIRE
          </Link>

          {/* Auth Buttons - Only show on auth pages */}
          {showAuth && (
            <nav className="flex items-center gap-2">
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
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
