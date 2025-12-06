import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { Briefcase, Wallet, Bookmark, User, TrendingUp, Clock } from 'lucide-react'
import { Button } from '../../components'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/seeker/dashboard')({
  component: DashboardPage,
})

// TODO: Replace with actual authenticated candidate ID
const MOCK_CANDIDATE_ID = "jn7e1p2s8t9r7ewxvb8x7s5z4h6z9rf5" as Id<"candidates">

function DashboardPage() {
  const navigate = useNavigate()

  // Fetch data from Convex
  const candidates = useQuery(api.candidates.list, {})
  const candidateId = candidates?.[0]?._id

  const dashboardStats = useQuery(api.seeker.getDashboardStats,
    candidateId ? { candidateId } : "skip"
  )
  const recentApplicationsData = useQuery(api.seeker.getRecentApplications,
    candidateId ? { candidateId, limit: 3 } : "skip"
  )

  // Transform stats
  const stats = dashboardStats ? {
    applications: {
      total: dashboardStats.applications.total,
      pending: dashboardStats.applications.pending,
      accepted: dashboardStats.applications.shortlisted,
      interviewing: dashboardStats.applications.reviewed,
    },
    earnings: {
      total: dashboardStats.earnings.total,
      thisMonth: dashboardStats.earnings.completed,
      available: dashboardStats.earnings.available,
    },
    savedJobs: dashboardStats.savedJobs,
    profileCompletion: dashboardStats.profileCompletion,
  } : {
    applications: { total: 0, pending: 0, accepted: 0, interviewing: 0 },
    earnings: { total: 0, thisMonth: 0, available: 0 },
    savedJobs: 0,
    profileCompletion: 0,
  }

  // Transform recent applications
  const recentApplications = recentApplicationsData?.map((app) => ({
    id: app._id,
    jobTitle: app.job?.title || 'Unknown Job',
    company: app.job?.company || 'Unknown Company',
    status: (app.status === 'shortlisted' ? 'accepted' :
             app.status === 'reviewed' ? 'interviewing' :
             app.status) as 'accepted' | 'pending' | 'rejected' | 'interviewing',
    appliedDate: new Date(app.createdAt).toLocaleDateString('en-GB'),
  })) || []

  const getStatusColor = (status: string) => {
    const colors = {
      accepted: '#10b981',
      pending: '#f59e0b',
      rejected: '#ef4444',
      interviewing: '#3b82f6',
    }
    return colors[status as keyof typeof colors] || '#94618e'
  }

  // Loading state
  if (dashboardStats === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
            Dashboard
          </h1>
          <p className="text-base" style={{ color: '#94618e', opacity: 0.6 }}>
            Welcome back! Here's your activity summary
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Applications Card */}
          <div
            className="p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            onClick={() => navigate({ to: '/seeker/applications' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#dbeafe' }}
              >
                <Briefcase size={24} style={{ color: '#3b82f6' }} />
              </div>
              <TrendingUp size={20} style={{ color: '#10b981' }} />
            </div>
            <h3 className="text-3xl font-bold mb-1" style={{ color: '#94618e' }}>
              {stats.applications.total}
            </h3>
            <p className="text-sm mb-3" style={{ color: '#94618e', opacity: 0.6 }}>
              Total Applications
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: '#fef3c7', color: '#d97706' }}
              >
                {stats.applications.pending} Pending
              </span>
              <span
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: '#d1fae5', color: '#059669' }}
              >
                {stats.applications.accepted} Accepted
              </span>
            </div>
          </div>

          {/* Earnings Card */}
          <div
            className="p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            onClick={() => navigate({ to: '/seeker/payments' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#d1fae5' }}
              >
                <Wallet size={24} style={{ color: '#10b981' }} />
              </div>
              <TrendingUp size={20} style={{ color: '#10b981' }} />
            </div>
            <h3 className="text-3xl font-bold mb-1" style={{ color: '#94618e' }}>
              RM {stats.earnings.total.toFixed(2)}
            </h3>
            <p className="text-sm mb-3" style={{ color: '#94618e', opacity: 0.6 }}>
              Total Earnings
            </p>
            <p className="text-xs" style={{ color: '#10b981' }}>
              RM {stats.earnings.available.toFixed(2)} available to withdraw
            </p>
          </div>

          {/* Saved Jobs Card */}
          <div
            className="p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            onClick={() => navigate({ to: '/seeker/saved-jobs' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#fef3c7' }}
              >
                <Bookmark size={24} style={{ color: '#f59e0b' }} />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1" style={{ color: '#94618e' }}>
              {stats.savedJobs}
            </h3>
            <p className="text-sm mb-3" style={{ color: '#94618e', opacity: 0.6 }}>
              Saved Jobs
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                navigate({ to: '/seeker/saved-jobs' })
              }}
            >
              View All
            </Button>
          </div>

          {/* Profile Card */}
          <div
            className="p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            onClick={() => navigate({ to: '/seeker/profile' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #94618e 0%, #7a4f73 100%)'
                }}
              >
                <User size={24} style={{ color: '#f8eee7' }} />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1" style={{ color: '#94618e' }}>
              {stats.profileCompletion}%
            </h3>
            <p className="text-sm mb-3" style={{ color: '#94618e', opacity: 0.6 }}>
              Profile Complete
            </p>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e5e7eb' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${stats.profileCompletion}%`,
                  background: 'linear-gradient(90deg, #94618e 0%, #7a4f73 100%)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: '#94618e' }}>
              Recent Applications
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/seeker/applications' })}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#94618e20' }}
                    >
                      <Briefcase size={20} style={{ color: '#94618e' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate" style={{ color: '#94618e' }}>
                        {app.jobTitle}
                      </h4>
                      <p className="text-sm" style={{ color: '#94618e', opacity: 0.6 }}>
                        {app.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} style={{ color: '#94618e', opacity: 0.5 }} />
                      <span className="text-xs" style={{ color: '#94618e', opacity: 0.6 }}>
                        {app.appliedDate}
                      </span>
                    </div>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(app.status) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #94618e 0%, #7a4f73 100%)'
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: '#f8eee7' }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="w-full"
              style={{
                backgroundColor: 'rgba(248, 238, 231, 0.1)',
                borderColor: '#f8eee7',
                color: '#f8eee7'
              }}
              onClick={() => console.log('Browse jobs')}
            >
              Browse Jobs
            </Button>
            <Button
              variant="outline"
              className="w-full"
              style={{
                backgroundColor: 'rgba(248, 238, 231, 0.1)',
                borderColor: '#f8eee7',
                color: '#f8eee7'
              }}
              onClick={() => navigate({ to: '/seeker/profile' })}
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="w-full"
              style={{
                backgroundColor: 'rgba(248, 238, 231, 0.1)',
                borderColor: '#f8eee7',
                color: '#f8eee7'
              }}
              onClick={() => navigate({ to: '/seeker/payments' })}
            >
              Withdraw Funds
            </Button>
          </div>
        </div>
      </div>
    </SeekerLayout>
  )
}
