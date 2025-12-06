import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '../../components/Button'
import { JobCard } from '../../components/JobCard'
import { ApplicantCard } from '../../components/ApplicantCard'
import { Loading, Skeleton } from '../../components/Loading'
import { EmployerLayout } from '../../layouts/EmployerLayout'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/employer/dashboard')({
  component: RouteComponent,
})

// Helper to format relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 14) return '1 week ago'
  return `${Math.floor(days / 7)} weeks ago`
}

// Helper to format date
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function RouteComponent() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Fetch data from Convex - filtered by employer
  const stats = useQuery(api.applications.getStatsByEmployer,
    user?.id ? { employerId: user.id as Id<"users"> } : "skip"
  )
  const jobs = useQuery(api.jobs.listByEmployer,
    user?.id ? { employerId: user.id as Id<"users">, status: 'open' } : "skip"
  )
  const applicationsWithDetails = useQuery(api.applications.listByEmployer,
    user?.id ? { employerId: user.id as Id<"users"> } : "skip"
  )

  // Mutations
  const deleteJob = useMutation(api.jobs.remove)
  const updateApplicationStatus = useMutation(api.applications.updateStatus)

  // Transform jobs data for JobCard component
  const jobsForDisplay = jobs?.map((job) => ({
    id: job._id,
    title: job.title,
    company: job.company,
    location: job.location || 'Remote',
    type: job.type || 'Full-time',
    salary: job.salary,
    postedDate: formatRelativeTime(job.createdAt),
    description: job.description,
    image: job.image,
  })) || []

  // Transform applications data for ApplicantCard component
  const applicantsForDisplay = applicationsWithDetails?.map((app) => ({
    id: app._id,
    name: app.candidate?.name || 'Unknown',
    email: app.candidate?.email || '',
    phone: app.candidate?.phone || 'N/A',
    location: app.candidate?.location || 'N/A',
    position: app.job?.title || 'Unknown Position',
    experience: app.candidate?.experience || 'Not specified',
    appliedDate: formatDate(app.createdAt),
    status: app.status as 'pending' | 'reviewed' | 'shortlisted' | 'rejected',
  })) || []

  // Limit to 3 items for dashboard display
  const limitedJobs = jobsForDisplay.slice(0, 3)
  const limitedApplicants = applicantsForDisplay.slice(0, 3)

  const handleEditJob = (id: string) => {
    console.log('Edit job:', id)
    // TODO: Navigate to edit page
  }

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob({ id: id as Id<'jobs'> })
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  const handleViewApplicant = (id: string) => {
    console.log('View applicant:', id)
    // TODO: Navigate to applicant details
  }

  const handleAcceptApplicant = async (id: string) => {
    try {
      await updateApplicationStatus({
        id: id as Id<'applications'>,
        status: 'shortlisted',
      })
    } catch (error) {
      console.error('Failed to shortlist applicant:', error)
    }
  }

  const handleRejectApplicant = async (id: string) => {
    try {
      await updateApplicationStatus({
        id: id as Id<'applications'>,
        status: 'rejected',
      })
    } catch (error) {
      console.error('Failed to reject applicant:', error)
    }
  }

  // Loading state
  if (!stats || !jobs || !applicationsWithDetails) {
    return (
      <EmployerLayout>
        <div className="w-full max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#94618e' }}>
            DASHBOARD
          </h1>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" className="h-32" />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <Skeleton variant="card" className="h-24" />
              <div className="space-y-4">
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </div>
            </div>
          </div>

          {/* Centered Loading Indicator */}
          <Loading size="lg" text="Loading dashboard data..." />
        </div>
      </EmployerLayout>
    )
  }

  return (
    <EmployerLayout>
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Dashboard Title */}
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#94618e' }}>
          DASHBOARD
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Active Jobs Card */}
          <div
            className="rounded-2xl p-6 flex flex-col items-center justify-center"
            style={{ backgroundColor: '#5a3851' }}
          >
            <div className="text-5xl font-bold text-white mb-2">
              {stats.activeJobs}
            </div>
            <div className="text-sm font-semibold text-white uppercase tracking-wide">
              ACTIVE JOB{stats.activeJobs !== 1 ? 'S' : ''}
            </div>
          </div>

          {/* Applications Card */}
          <div
            className="rounded-2xl p-6 flex flex-col items-center justify-center"
            style={{ backgroundColor: '#5a3851' }}
          >
            <div className="text-5xl font-bold text-white mb-2">
              {stats.applications}
            </div>
            <div className="text-sm font-semibold text-white uppercase tracking-wide">
              APPLICATION{stats.applications !== 1 ? 'S' : ''}
            </div>
          </div>

          {/* Pending Card */}
          <div
            className="rounded-2xl p-6 flex flex-col items-center justify-center"
            style={{ backgroundColor: '#5a3851' }}
          >
            <div className="text-5xl font-bold text-white mb-2">
              {stats.pending}
            </div>
            <div className="text-sm font-semibold text-white uppercase tracking-wide">
              PENDING
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job Posting and Posted Jobs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Posting Section */}
            <div>
              <h2
                className="text-sm font-bold uppercase mb-3 tracking-wide"
                style={{ color: '#5a3851' }}
              >
                JOB POSTING
              </h2>
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: '#b8a0b3' }}
              >
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => navigate({ to: '/employer/joblist' })}
                >
                  CREATE A NEW JOB
                </Button>
              </div>
            </div>

            {/* Posted Jobs Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: '#5a3851' }}
                >
                  POSTED JOB{jobsForDisplay.length !== 1 ? 'S' : ''} ({jobsForDisplay.length})
                </h2>
                {jobsForDisplay.length > 3 && (
                  <button
                    onClick={() => navigate({ to: '/employer/joblist' })}
                    className="flex items-center gap-1 text-sm font-semibold transition-all duration-200 hover:gap-2"
                    style={{ color: '#94618e' }}
                  >
                    View More
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {limitedJobs.length === 0 ? (
                  <div
                    className="rounded-xl p-6 text-center"
                    style={{ backgroundColor: '#f8eee7', color: '#94618e' }}
                  >
                    No jobs posted yet. Create your first job posting!
                  </div>
                ) : (
                  limitedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      variant="employer"
                      job={job}
                      onEdit={handleEditJob}
                      onDelete={handleDeleteJob}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Applications Panel */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2
                className="text-sm font-bold uppercase tracking-wide"
                style={{ color: '#5a3851' }}
              >
                APPLICATION{applicantsForDisplay.length !== 1 ? 'S' : ''} ({applicantsForDisplay.length})
              </h2>
              {applicantsForDisplay.length > 3 && (
                <button
                  onClick={() => navigate({ to: '/employer/applications' })}
                  className="flex items-center gap-1 text-sm font-semibold transition-all duration-200 hover:gap-2"
                  style={{ color: '#94618e' }}
                >
                  View More
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
            <div className="space-y-4">
              {limitedApplicants.length === 0 ? (
                <div
                  className="rounded-xl p-6 text-center"
                  style={{ backgroundColor: '#f8eee7', color: '#94618e' }}
                >
                  No applications yet.
                </div>
              ) : (
                limitedApplicants.map((applicant) => (
                  <ApplicantCard
                    key={applicant.id}
                    applicant={applicant}
                    onViewDetails={handleViewApplicant}
                    onAccept={handleAcceptApplicant}
                    onReject={handleRejectApplicant}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </EmployerLayout>

  )
}
