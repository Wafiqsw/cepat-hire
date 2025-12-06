import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { useState, useEffect } from 'react'
import { AvatarPlaceholder, Button, Input, Loading, Skeleton } from '../../components'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowLeft, Save } from 'lucide-react'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/seeker/update-profile')({
  component: UpdateProfilePage,
})

function UpdateProfilePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])
  const { user } = useAuth()

  // Get candidate profile linked to authenticated user
  const candidate = useQuery(api.seeker.getCandidateByUserId,
    user?.id ? { userId: user.id as Id<"users"> } : "skip"
  )
  const candidateId = candidate?._id

  // Fetch profile from backend
  const profile = useQuery(api.seeker.getProfile,
    candidateId ? { candidateId } : "skip"
  )

  // Update mutation
  const updateProfile = useMutation(api.seeker.updateProfile)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.resumeText || profile.experience || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateId) return

    setIsSaving(true)
    try {
      await updateProfile({
        candidateId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        resumeText: formData.bio,
      })
      navigate({ to: '/seeker/profile' })
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Loading state - check candidate profile first
  if (candidate === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
              Loading...
            </div>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  // Candidate profile doesn't exist - for update-profile this is okay,
  // user can fill the form to create their profile
  // But we need candidateId to save, so show a message
  if (candidate === null) {
    return (
      <SeekerLayout>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
              Welcome!
            </h2>
            <p className="text-lg mb-6" style={{ color: '#94618e', opacity: 0.7 }}>
              Please contact support to set up your candidate profile.
            </p>
            <Button variant="primary" onClick={() => navigate({ to: '/seeker/browse-jobs' })}>
              Browse Jobs
            </Button>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  // Now candidateId is guaranteed to exist
  if (profile === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
              Loading...
            </div>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  const handleCancel = () => {
    navigate({ to: '/seeker/profile' })
  }

  if (isLoading) {
    return (
      <SeekerLayout>
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton variant="text" className="h-6 w-32 mb-4" />
            <Skeleton variant="text" className="h-9 w-40 mb-2" />
            <Skeleton variant="text" className="h-6 w-56" />
          </div>

          {/* Form Skeleton */}
          <div className="p-8 rounded-2xl border-2 mb-6" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
            {/* Avatar Skeleton */}
            <div className="mb-8 flex flex-col items-center">
              <Skeleton variant="circle" className="w-32 h-32 mb-3" />
              <Skeleton variant="text" className="h-4 w-48" />
            </div>

            {/* Form Fields Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton variant="text" className="h-5 w-24 mb-2" />
                  <Skeleton variant="rectangle" className="h-12 w-full rounded-xl" />
                </div>
              ))}
              <div>
                <Skeleton variant="text" className="h-5 w-24 mb-2" />
                <Skeleton variant="rectangle" className="h-24 w-full rounded-xl" />
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <Skeleton variant="rectangle" className="h-12 rounded-xl" />
            <Skeleton variant="rectangle" className="h-12 rounded-xl" />
          </div>

          {/* Loading Indicator */}
          <Loading size="lg" text="Loading profile editor..." />
        </div>
      </SeekerLayout>
    )
  }

  return (
    <SeekerLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 mb-4 transition-all duration-200 hover:opacity-70"
            style={{ color: '#94618e' }}
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Profile</span>
          </button>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
            Edit Profile
          </h1>
          <p className="text-base" style={{ color: '#94618e', opacity: 0.6 }}>
            Update your personal information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="p-8 rounded-2xl border-2 mb-6"
            style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
          >
            {/* Avatar Section */}
            <div className="mb-8 flex flex-col items-center">
              <AvatarPlaceholder
                name={formData.name}
                size="xl"
                uploadable={true}
                onUpload={(file) => {
                  console.log('Uploading file:', file)
                  // Here you would upload the file to your server
                }}
              />
              <p className="text-sm mt-3" style={{ color: '#94618e', opacity: 0.6 }}>
                Click avatar to upload new photo
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#94618e' }}>
                  Full Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#94618e' }}>
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#94618e' }}>
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  required
                  className="w-full"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#94618e' }}>
                  Location
                </label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter your location"
                  required
                  className="w-full"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#94618e' }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
                  style={{
                    backgroundColor: '#f8eee7',
                    borderColor: '#94618e',
                    color: '#94618e',
                  }}
                />
                <p className="text-xs mt-2" style={{ color: '#94618e', opacity: 0.6 }}>
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSaving}
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </SeekerLayout>
  )
}
