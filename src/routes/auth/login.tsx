import { createFileRoute, Link } from '@tanstack/react-router'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Button, Input, Checkbox } from '../../components'
import { useState } from 'react'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
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
      console.log('❌ Login validation failed:', errors)
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log('✅ LOGIN SUCCESSFUL!')
      console.log('📧 Email:', formData.email)
      console.log('🔒 Password:', formData.password)
      console.log('💾 Remember Me:', formData.rememberMe)
      console.log('📊 Full Form Data:', formData)

      setIsLoading(false)

      // You can redirect to dashboard here
      // navigate({ to: '/employer/dashboard' }) or '/seeker/dashboard'
    }, 1500)
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              setErrors({ ...errors, email: undefined })
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
              setErrors({ ...errors, password: undefined })
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
