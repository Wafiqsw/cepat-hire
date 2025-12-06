import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '../../components/Button'
import { JobForm } from '../../components/JobForm'
import { Plus } from 'lucide-react'
import { EmployerLayout } from '../../layouts/EmployerLayout'
import { useAuth } from '../../contexts/AuthContext'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/employer/joblist')({
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

interface JobFormData {
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string
  benefits: string
  isRemote: boolean
  isActive: boolean
  image?: string
}

function RouteComponent() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)
  const { user } = useAuth()

  // Fetch jobs from Convex - filtered by employer
  const jobs = useQuery(api.jobs.listByEmployer,
    user?.id ? { employerId: user.id as Id<"users"> } : "skip"
  )

  // Mutations
  const createJob = useMutation(api.jobs.create)
  const updateJob = useMutation(api.jobs.update)
  const deleteJob = useMutation(api.jobs.remove)

  const handleCreateJob = () => {
    setEditingJob(null)
    setIsFormOpen(true)
  }

  const handleEditJob = (id: string) => {
    const job = jobs?.find((j) => j._id === id)
    if (job) {
      // Transform Convex data to form format
      setEditingJob({
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location || '',
        type: job.type || '',
        salary: job.salary || '',
        description: job.description,
        requirements: job.requirements.join(', '),
        benefits: job.benefits || '',
        isRemote: job.isRemote || false,
        isActive: job.status === 'open',
        image: job.image || '',
      })
      setIsFormOpen(true)
    }
  }

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob({ id: id as Id<'jobs'> })
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  const handleFormSubmit = async (data: JobFormData) => {
    // Convert requirements string to array
    const requirementsArray = data.requirements
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0)

    try {
      if (editingJob) {
        // Update existing job
        await updateJob({
          id: editingJob.id as Id<'jobs'>,
          title: data.title,
          company: data.company,
          location: data.location || undefined,
          type: data.type || undefined,
          salary: data.salary || undefined,
          description: data.description,
          requirements: requirementsArray,
          benefits: data.benefits || undefined,
          image: data.image || undefined,
          isRemote: data.isRemote,
          status: data.isActive ? 'open' : 'draft',
        })
      } else {
        // Create new job - include employerId to link to this employer
        await createJob({
          employerId: user?.id as Id<"users">,
          title: data.title,
          company: data.company,
          location: data.location || undefined,
          type: data.type || undefined,
          salary: data.salary || undefined,
          description: data.description,
          requirements: requirementsArray,
          benefits: data.benefits || undefined,
          image: data.image || undefined,
          isRemote: data.isRemote,
          status: data.isActive ? 'open' : 'draft',
        })
      }
      setIsFormOpen(false)
      setEditingJob(null)
    } catch (error) {
      console.error('Failed to save job:', error)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingJob(null)
  }

  // Loading state
  if (jobs === undefined) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#94618e' }}>
          JOB LIST
        </h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
            Loading...
          </div>
        </div>
      </div>
    )
  }

  return (
    <EmployerLayout>
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#94618e' }}>
            JOB LIST
          </h1>
          <Button
            variant="primary"
            size="md"
            onClick={handleCreateJob}
            className="w-full sm:w-auto"
          >
            <Plus size={20} />
            CREATE A NEW JOB
          </Button>
        </div>

        {/* Job Count */}
        <div className="mb-6">
          <p className="text-base font-medium" style={{ color: '#94618e', opacity: 0.8 }}>
            Total Jobs: <span className="font-bold">{jobs.length}</span>
          </p>
        </div>

        {/* Jobs Grid */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-2xl overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all duration-300"
                style={{
                  backgroundColor: '#f8eee7',
                  borderColor: '#94618e',
                }}
              >
                {/* Job Image with Title Overlay */}
                <div className="relative w-full h-48 overflow-hidden">
                  {job.image ? (
                    <img
                      src={job.image}
                      alt={job.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: '#b8a0b3' }}
                    >
                      <span className="text-4xl">💼</span>
                    </div>
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(90,56,81,0.9) 100%)',
                    }}
                  />
                  {/* Job Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {job.title}
                    </h3>
                  </div>
                  {/* Status Badge */}
                  {job.status !== 'open' && (
                    <div className="absolute top-4 right-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: job.status === 'draft' ? '#fef9c3' : '#fee2e2',
                          color: job.status === 'draft' ? '#854d0e' : '#991b1b',
                        }}
                      >
                        {job.status === 'draft' ? 'Draft' : 'Closed'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div
                  className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  style={{ backgroundColor: '#5a3851' }}
                >
                  <div>
                    <p className="text-base font-semibold mb-1" style={{ color: '#f8eee7' }}>
                      {job.company}
                    </p>
                    <p className="text-sm" style={{ color: '#f8eee7', opacity: 0.8 }}>
                      {job.location || 'Location not specified'} • {job.type || 'Not specified'} • {job.salary || 'Salary not specified'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#f8eee7', opacity: 0.6 }}>
                      Posted {formatRelativeTime(job.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditJob(job._id)}
                      className="flex-1 sm:flex-none"
                    >
                      EDIT
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteJob(job._id)}
                      className="flex-1 sm:flex-none"
                    >
                      DELETE
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State (show when no jobs) */}
        {jobs.length === 0 && (
          <div
            className="rounded-xl p-12 text-center border-2 border-dashed"
            style={{ borderColor: '#94618e', backgroundColor: '#f8eee7' }}
          >
            <div className="max-w-md mx-auto">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#e8dcd7' }}
              >
                <Plus size={40} style={{ color: '#94618e' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#94618e' }}>
                No Jobs Posted Yet
              </h3>
              <p className="text-base mb-6" style={{ color: '#94618e', opacity: 0.7 }}>
                Start by creating your first job posting to attract talented candidates.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleCreateJob}
              >
                <Plus size={20} />
                Create Your First Job
              </Button>
            </div>
          </div>
        )}

        {/* Job Form Modal */}
        <JobForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          mode={editingJob ? 'edit' : 'create'}
          initialData={editingJob || undefined}
          onSubmit={handleFormSubmit}
        />
      </div>
    </EmployerLayout>
  )
}
