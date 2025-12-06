import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Button, Input, Checkbox, PasswordStrengthChecklist } from '../../components'
import { AccountTypeModal } from '../../components/AccountTypeModal'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated, user, isLoading: authLoading } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    agreeToTerms?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate({ to: '/employer/dashboard' })
    }
  }, [isAuthenticated, user, navigate])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Show account type selection modal
    setShowAccountTypeModal(true)
  }

  const handleAccountTypeSelect = async (role: 'employer' | 'seeker') => {
    setIsLoading(true)
    setErrors({})

    const result = await register(
      formData.fullName,
      formData.email,
      formData.password,
      role
    )

    if (!result.success) {
      setErrors({ general: result.error || 'Registration failed' })
      setIsLoading(false)
      setShowAccountTypeModal(false)
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
            Create Account
          </h1>
          <p className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
            Join CEPATHIRE today
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

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value })
              setErrors({ ...errors, fullName: undefined, general: undefined })
            }}
            error={errors.fullName}
            fullWidth
          />

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

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                setErrors({ ...errors, password: undefined, general: undefined })
              }}
              error={errors.password}
              fullWidth
            />
            <PasswordStrengthChecklist password={formData.password} />
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value })
              setErrors({ ...errors, confirmPassword: undefined, general: undefined })
            }}
            error={errors.confirmPassword}
            fullWidth
          />

          {/* Terms */}
          <div>
            <Checkbox
              label="I agree to Terms & Conditions"
              checked={formData.agreeToTerms}
              onChange={(e) => {
                setFormData({ ...formData, agreeToTerms: e.target.checked })
                setErrors({ ...errors, agreeToTerms: undefined, general: undefined })
              }}
            />
            {errors.agreeToTerms && (
              <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="submit"
              loading={isLoading}
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p style={{ color: '#94618e', opacity: 0.7 }}>
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-semibold hover:underline"
              style={{ color: '#94618e' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Account Type Selection Modal */}
      <AccountTypeModal
        isOpen={showAccountTypeModal}
        onClose={() => setShowAccountTypeModal(false)}
        onSelect={handleAccountTypeSelect}
      />
    </AuthLayout>
  )
}
