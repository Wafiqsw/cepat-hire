import { createFileRoute, Link } from '@tanstack/react-router'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Button, Input, Checkbox, PasswordStrengthChecklist } from '../../components'
import { AccountTypeModal } from '../../components/AccountTypeModal'
import { useState } from 'react'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', // 'employer' or 'seeker'
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    role?: string
    agreeToTerms?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false)

  const validateForm = () => {
    const newErrors: typeof errors = {}

    // Full Name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      console.log('❌ Registration validation failed:', errors)
      return
    }

    // Show account type selection modal
    setShowAccountTypeModal(true)
  }

  const handleAccountTypeSelect = (role: 'employer' | 'seeker') => {
    setFormData({ ...formData, role })
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log('✅ REGISTRATION SUCCESSFUL!')
      console.log('👤 Full Name:', formData.fullName)
      console.log('📧 Email:', formData.email)
      console.log('🔒 Password:', formData.password)
      console.log('👔 Account Type:', role === 'employer' ? 'Employer' : 'Job Seeker')
      console.log('✔️ Agreed to Terms:', formData.agreeToTerms)
      console.log('📊 Full Form Data:', {
        fullName: formData.fullName,
        email: formData.email,
        role: role,
        agreeToTerms: formData.agreeToTerms,
      })

      setIsLoading(false)

      // You can redirect to dashboard here based on role
      // if (role === 'employer') navigate({ to: '/employer/dashboard' })
      // else navigate({ to: '/seeker/dashboard' })
    }, 1500)
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

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value })
              setErrors({ ...errors, fullName: undefined })
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
              setErrors({ ...errors, email: undefined })
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
                setErrors({ ...errors, password: undefined })
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
              setErrors({ ...errors, confirmPassword: undefined })
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
                setErrors({ ...errors, agreeToTerms: undefined })
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
