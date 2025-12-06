import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Button, Input, Checkbox } from '../../components'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'seeker') {
        navigate({ to: '/seeker/dashboard' })
      } else {
        navigate({ to: '/employer/dashboard' })
      }
    }
  }, [isAuthenticated, user, navigate])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    const result = await login(formData.email, formData.password)

    if (!result.success) {
      setErrors({ general: result.error || 'Login failed' })
      setIsLoading(false)
    }
    // Navigation happens automatically via useEffect when user is set
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
            Loading...
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#94618e' }}>
            Welcome Back
          </h1>
          <p className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
            Sign in to continue
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div
            className="mb-4 p-3 rounded-lg text-center"
            style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
          >
            {errors.general}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              setErrors({ ...errors, email: undefined, general: undefined })
            }}
            error={errors.email}
            fullWidth
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value })
              setErrors({ ...errors, password: undefined, general: undefined })
            }}
            error={errors.password}
            fullWidth
          />

          <div className="flex items-center justify-between pt-2">
            <Checkbox
              label="Remember me"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            />
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="submit"
              loading={isLoading}
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p style={{ color: '#94618e', opacity: 0.7 }}>
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="font-semibold hover:underline"
              style={{ color: '#94618e' }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
