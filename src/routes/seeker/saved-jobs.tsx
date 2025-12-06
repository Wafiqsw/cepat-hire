import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { Bookmark, MapPin, DollarSign, Clock, X } from 'lucide-react'
import { Button } from '../../components'
import { useAuth } from '../../contexts/AuthContext'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/seeker/saved-jobs')({
  component: SavedJobsPage,
})

function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 14) return '1 week ago'
  return `${Math.floor(days / 7)} weeks ago`
}

function SavedJobsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Get candidate profile linked to authenticated user
  const candidate = useQuery(api.seeker.getCandidateByUserId,
    user?.id ? { userId: user.id as Id<"users"> } : "skip"
  )
  const candidateId = candidate?._id

  // Fetch saved jobs from backend
  const savedJobsData = useQuery(api.seeker.getSavedJobs,
    candidateId ? { candidateId } : "skip"
  )

  // Mutations
  const unsaveJob = useMutation(api.seeker.unsaveJob)
  const applyToJob = useMutation(api.seeker.applyToJob)

  // Transform data for display
  const savedJobs = savedJobsData
    ?.filter((saved) => saved !== null)
    .map((saved) => ({
      id: saved._id,
      jobId: saved.jobId,
      title: saved.job?.title || 'Unknown Job',
      company: saved.job?.company || 'Unknown Company',
      location: saved.job?.location || 'Remote',
      salary: saved.job?.salary || 'Competitive',
      jobType: saved.job?.type || 'Part-time',
      postedDate: saved.job?.createdAt
        ? formatTimeAgo(saved.job.createdAt)
        : 'Recently',
      description: saved.job?.description || '',
    })) || []

  const handleUnsave = async (jobId: Id<"jobs">) => {
    if (!candidateId) return
    try {
      await unsaveJob({ candidateId, jobId })
    } catch (error) {
      console.error('Failed to unsave job:', error)
    }
  }

  const handleApply = async (jobId: Id<"jobs">) => {
    if (!candidateId) {
      alert('Please complete your profile before applying')
      return
    }
    try {
      await applyToJob({ candidateId, jobId })
      // Optionally unsave after applying
      await unsaveJob({ candidateId, jobId })
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Failed to apply:', error)
      alert('Failed to apply. You may have already applied to this job.')
    }
  }

  // Loading state - check candidate profile first
  if (candidate === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
              Profile Not Found
            </h2>
            <p className="text-lg mb-6" style={{ color: '#94618e', opacity: 0.7 }}>
              Please create your profile to save jobs.
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
  if (savedJobsData === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
            Saved Jobs
          </h1>
          <p className="text-base" style={{ color: '#94618e', opacity: 0.6 }}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later
          </p>
        </div>

        {/* Jobs List */}
        {savedJobs.length > 0 ? (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-md relative"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleUnsave(job.jobId)}
                  className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:bg-red-50"
                  title="Remove from saved"
                >
                  <X size={20} style={{ color: '#94618e', opacity: 0.5 }} />
                </button>

                {/* Job Info */}
                <div className="pr-12">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #94618e 0%, #7a4f73 100%)'
                      }}
                    >
                      <Bookmark size={20} style={{ color: '#f8eee7' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-1" style={{ color: '#94618e' }}>
                        {job.title}
                      </h3>
                      <p className="text-base font-semibold mb-3" style={{ color: '#94618e', opacity: 0.7 }}>
                        {job.company}
                      </p>

                      {/* Job Details Row */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} style={{ color: '#94618e', opacity: 0.5 }} />
                          <span className="text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
                            {job.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} style={{ color: '#94618e', opacity: 0.5 }} />
                          <span className="text-sm font-bold" style={{ color: '#94618e' }}>
                            {job.salary}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} style={{ color: '#94618e', opacity: 0.5 }} />
                          <span className="text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
                            {job.postedDate}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm mb-4" style={{ color: '#94618e', opacity: 0.7 }}>
                        {job.description}
                      </p>

                      {/* Job Type Badge & Button */}
                      <div className="flex items-center gap-3">
                        <span
                          className="px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: '#94618e20',
                            color: '#94618e',
                          }}
                        >
                          {job.jobType}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApply(job.jobId)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div
            className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: '#f8eee7' }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ backgroundColor: '#94618e20' }}
            >
              <Bookmark size={40} style={{ color: '#94618e', opacity: 0.4 }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#94618e' }}>
              No Saved Jobs Yet
            </h2>
            <p className="text-base mb-6" style={{ color: '#94618e', opacity: 0.6 }}>
              Start saving jobs you're interested in to easily find them later!
            </p>
            <Button
              variant="primary"
              onClick={() => navigate({ to: '/seeker/browse-jobs' })}
            >
              Browse Jobs
            </Button>
          </div>
        )}
      </div>
    </SeekerLayout>
  )
}
