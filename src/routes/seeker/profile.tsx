import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { useAuth } from '../../contexts/AuthContext'
import {
  WorkHistoryList,
  WalletCard,
  Button,
  AvatarPlaceholder,
} from '../../components'
import { Mail, Phone, MapPin, Calendar, Edit, Briefcase } from 'lucide-react'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/seeker/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Get candidate profile linked to authenticated user
  const candidate = useQuery(api.seeker.getCandidateByUserId,
    user?.id ? { userId: user.id as Id<"users"> } : "skip"
  )
  const candidateId = candidate?._id

  // Fetch profile, work history and payment stats from backend
  const profile = useQuery(api.seeker.getProfile,
    candidateId ? { candidateId } : "skip"
  )
  const workHistoryData = useQuery(api.seeker.getWorkHistory,
    candidateId ? { candidateId } : "skip"
  )
  const paymentStats = useQuery(api.seeker.getMyPaymentStats,
    candidateId ? { candidateId } : "skip"
  )

  // Transform profile data
  const profileData = profile ? {
    name: profile.name || 'Unknown',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    joinDate: profile.createdAt
      ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Recently',
    bio: profile.resumeText || profile.experience || '',
  } : {
    name: 'Loading...',
    email: '',
    phone: '',
    location: '',
    joinDate: '',
    bio: '',
  }

  // Transform work history
  const workHistory = workHistoryData?.map((work) => ({
    id: work.id,
    company: work.company,
    position: work.position,
    location: work.location,
    startDate: work.startDate,
    endDate: work.endDate,
    description: work.description,
    isCurrentJob: work.isCurrentJob,
  })) || []

  // Wallet balance from payment stats
  const walletBalance = paymentStats?.totalEarnings || 0

  // Loading state - check candidate profile first
  if (candidate === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-7xl mx-auto space-y-8 px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
              Loading...
            </div>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  // Candidate profile doesn't exist
  if (candidate === null) {
    return (
      <SeekerLayout>
        <div className="max-w-7xl mx-auto space-y-8 px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
              Profile Not Found
            </h2>
            <p className="text-lg mb-6" style={{ color: '#94618e', opacity: 0.7 }}>
              Please create your profile to get started.
            </p>
            <Button variant="primary" onClick={() => navigate({ to: '/seeker/update-profile' })}>
              Create Profile
            </Button>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  // Now candidateId is guaranteed to exist
  if (profile === undefined || workHistoryData === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-7xl mx-auto space-y-8 px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
              Loading...
            </div>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  return (
    <SeekerLayout>
      <div className="max-w-7xl mx-auto space-y-8 px-4 py-6">
        {/* Profile Info and Wallet - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Profile Header Card */}
          <div
            className="p-8 rounded-2xl relative overflow-hidden shadow-lg h-full flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #94618e 0%, #7a4f73 100%)',
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10"
              style={{ backgroundColor: '#f8eee7' }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10"
              style={{ backgroundColor: '#f8eee7' }}
            />

            <div className="flex flex-col items-center text-center gap-6 flex-1 relative z-10">
              {/* Avatar with white background for contrast */}
              <div
                className="p-3 rounded-full shadow-xl"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                }}
              >
                <AvatarPlaceholder
                  name={profileData.name}
                  size="xl"
                  type="user"
                />
              </div>

              <div className="w-full flex-1 flex flex-col">
                <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                  <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#f8eee7' }}>
                    {profileData.name}
                  </h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate({ to: '/seeker/update-profile' })}
                  >
                    <Edit size={16} />
                    Edit
                  </Button>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-6 w-full max-w-lg mx-auto">
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg min-w-0"
                    style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
                  >
                    <Mail size={16} className="flex-shrink-0" style={{ color: '#f8eee7' }} />
                    <span className="truncate text-left" style={{ color: '#f8eee7' }}>{profileData.email}</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg min-w-0"
                    style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
                  >
                    <Phone size={16} className="flex-shrink-0" style={{ color: '#f8eee7' }} />
                    <span className="truncate text-left" style={{ color: '#f8eee7' }}>{profileData.phone}</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg min-w-0"
                    style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
                  >
                    <MapPin size={16} className="flex-shrink-0" style={{ color: '#f8eee7' }} />
                    <span className="truncate text-left" style={{ color: '#f8eee7' }}>{profileData.location}</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg min-w-0"
                    style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
                  >
                    <Calendar size={16} className="flex-shrink-0" style={{ color: '#f8eee7' }} />
                    <span className="truncate text-left" style={{ color: '#f8eee7' }}>Joined {profileData.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Card - Aligned with Profile */}
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
              <WalletCard balance={walletBalance} currency="RM" />

              {/* Quick Stats Card */}
              <div
                className="mt-6 p-6 rounded-xl shadow-md border-2"
                style={{
                  backgroundColor: '#f8eee7',
                  borderColor: '#94618e20'
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: '#94618e' }}>
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#94618e15' }}>
                    <p className="text-2xl font-bold" style={{ color: '#94618e' }}>
                      {workHistory.length}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#94618e', opacity: 0.7 }}>
                      Jobs Completed
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#94618e15' }}>
                    <p className="text-2xl font-bold" style={{ color: '#94618e' }}>
                      {workHistory.filter(job => job.isCurrentJob).length}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#94618e', opacity: 0.7 }}>
                      Active Jobs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work History Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-full shadow-md"
                style={{ backgroundColor: '#94618e' }}
              >
                <Briefcase size={24} style={{ color: '#f8eee7' }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#94618e' }}>
                  Work History
                </h2>
                <p className="text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
                  {workHistory.length} jobs completed
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate({ to: '/seeker/browse-jobs' })}
            >
              <Briefcase size={16} />
              Look for more work!
            </Button>
          </div>
          <WorkHistoryList workHistory={workHistory} />
        </div>
      </div>
    </SeekerLayout>
  )
}
