import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '../../components/Button'
import { ApplicantCard } from '../../components/ApplicantCard'
import { AvatarPlaceholder } from '../../components/ImagePlaceholder'
import { EmployerLayout } from '../../layouts/EmployerLayout'
import { useAuth } from '../../contexts/AuthContext'
import { ChevronLeft, Star, Mail, Phone, MapPin, Briefcase } from 'lucide-react'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/employer/applications')({
  component: RouteComponent,
})

// Helper to format date
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function RouteComponent() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const { user } = useAuth()

  // Fetch real data from Convex - filtered by employer
  const jobs = useQuery(api.jobs.listByEmployer,
    user?.id ? { employerId: user.id as Id<"users"> } : "skip"
  )
  const applicationsWithDetails = useQuery(api.applications.listByEmployer,
    user?.id ? { employerId: user.id as Id<"users"> } : "skip"
  )

  // Mutations
  const updateApplicationStatus = useMutation(api.applications.updateStatus)

  // Compute jobs with application counts
  const jobsWithCounts = jobs?.map((job) => {
    const applicantCount = applicationsWithDetails?.filter(
      (app) => app.jobId === job._id
    ).length || 0
    return {
      id: job._id,
      title: job.title,
      company: job.company,
      image: job.image,
      applicantsCount: applicantCount,
    }
  }) || []

  // Get applicants for selected job
  const applicantsForJob = selectedJob
    ? applicationsWithDetails?.filter((app) => app.jobId === selectedJob).map((app) => ({
        id: app._id,
        name: app.candidate?.name || 'Unknown',
        email: app.candidate?.email || '',
        phone: app.candidate?.phone || 'N/A',
        location: app.candidate?.location || 'N/A',
        position: app.job?.title || 'Unknown Position',
        skills: app.candidate?.skills?.join(', ') || 'Not specified',
        experience: app.candidate?.experience || 'Not specified',
        appliedDate: formatDate(app.createdAt),
        status: app.status as 'pending' | 'reviewed' | 'shortlisted' | 'rejected',
      })) || []
    : []

  const handleViewApplicants = (jobId: string) => {
    setSelectedJob(jobId)
  }

  const handleBackToJobs = () => {
    setSelectedJob(null)
  }

  const handleViewDetails = (id: string) => {
    const applicant = applicantsForJob.find((a) => a.id === id)
    if (applicant) {
      setSelectedApplicant(applicant)
      setIsDetailsModalOpen(true)
    }
  }

  const handleApproveApplicant = async (id: string) => {
    try {
      await updateApplicationStatus({
        id: id as Id<'applications'>,
        status: 'reviewed',
      })
      setIsDetailsModalOpen(false)
    } catch (error) {
      console.error('Failed to approve applicant:', error)
    }
  }

  const handleShortlistApplicant = async (id: string) => {
    try {
      await updateApplicationStatus({
        id: id as Id<'applications'>,
        status: 'shortlisted',
      })
      setIsDetailsModalOpen(false)
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
      setIsDetailsModalOpen(false)
    } catch (error) {
      console.error('Failed to reject applicant:', error)
    }
  }

  const handleAcceptApplicant = (id: string) => {
    handleShortlistApplicant(id)
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedApplicant(null)
  }

  const selectedJobData = jobsWithCounts.find((job) => job.id === selectedJob)

  // Loading state
  if (jobs === undefined || applicationsWithDetails === undefined) {
    return (
      <EmployerLayout>
        <div className="w-full max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#94618e' }}>
            APPLICATIONS
          </h1>
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
              Loading...
            </div>
          </div>
        </div>
      </EmployerLayout>
    )
  }

  return (
    <EmployerLayout>
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {selectedJob ? (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToJobs}
                className="mb-4"
              >
                <ChevronLeft size={16} />
                Back to Jobs
              </Button>
              <h1 className="text-3xl font-bold" style={{ color: '#94618e' }}>
                {selectedJobData?.title}
              </h1>
              <p className="text-base mt-2" style={{ color: '#94618e', opacity: 0.7 }}>
                {applicantsForJob.length} Applicant{applicantsForJob.length !== 1 ? 's' : ''}
              </p>
            </div>
          ) : (
            <h1 className="text-3xl font-bold" style={{ color: '#94618e' }}>
              APPLICATIONS
            </h1>
          )}
        </div>

        {selectedJob ? (
          /* Applicants List View */
          <div className="space-y-4">
            {applicantsForJob.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onViewDetails={handleViewDetails}
                onAccept={handleAcceptApplicant}
                onReject={handleRejectApplicant}
              />
            ))}

            {applicantsForJob.length === 0 && (
              <div
                className="rounded-xl p-12 text-center"
                style={{ backgroundColor: '#f8eee7', borderColor: '#94618e', borderWidth: '2px' }}
              >
                <p className="text-lg font-medium" style={{ color: '#94618e' }}>
                  No applicants yet for this position
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Jobs Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobsWithCounts.map((job) => (
            <div
              key={job.id}
              className="rounded-xl overflow-hidden border-2 shadow-md hover:shadow-xl transition-all duration-300"
              style={{
                backgroundColor: '#5a3851',
                borderColor: '#94618e',
              }}
            >
              {/* Job Image */}
              <div className="relative w-full h-40 overflow-hidden">
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(90,56,81,0.8) 100%)',
                  }}
                />
                {/* Job Title Overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white truncate">
                    {job.title}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    {job.company}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#f8eee7', opacity: 0.7 }}>
                    {job.applicantsCount} Applicants
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleViewApplicants(job.id)}
                >
                  VIEW APPLICANTS
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant Details Modal */}
      {isDetailsModalOpen && selectedApplicant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={handleCloseModal}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(148, 97, 142, 0.4)' }}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="relative rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#f8eee7' }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b-2" style={{ borderBottomColor: '#94618e' }}>
              <h2 className="text-xl font-bold text-center" style={{ color: '#94618e' }}>
                APPLICANT INFORMATION
              </h2>
            </div>

            {/* Content */}
            <div
              className="p-6 rounded-2xl mx-4 my-4"
              style={{ backgroundColor: '#5a3851' }}
            >
              {/* Profile Section */}
              <div className="flex flex-col items-center mb-5">
                <AvatarPlaceholder name={selectedApplicant.name} size="lg" />
                <h3 className="text-xl font-bold mt-3" style={{ color: '#f8eee7' }}>
                  {selectedApplicant.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={i < 4 ? '#fbbf24' : 'none'}
                      stroke={i < 4 ? '#fbbf24' : '#f8eee7'}
                      style={{ opacity: i < 4 ? 1 : 0.3 }}
                    />
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4
                  className="text-lg font-bold mb-3"
                  style={{ color: '#f8eee7' }}
                >
                  CONTACT INFORMATION
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-6 flex items-center justify-center"
                      style={{ color: '#f8eee7' }}
                    >
                      <Mail size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#f8eee7', opacity: 0.7 }}>
                        EMAIL:
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#f8eee7' }}>
                        {selectedApplicant.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-6 flex items-center justify-center"
                      style={{ color: '#f8eee7' }}
                    >
                      <Phone size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#f8eee7', opacity: 0.7 }}>
                        PHONE NO:
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#f8eee7' }}>
                        {selectedApplicant.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-6 flex items-center justify-center"
                      style={{ color: '#f8eee7' }}
                    >
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#f8eee7', opacity: 0.7 }}>
                        ADDRESS:
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#f8eee7' }}>
                        {selectedApplicant.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-6 flex items-center justify-center"
                      style={{ color: '#f8eee7' }}
                    >
                      <Briefcase size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#f8eee7', opacity: 0.7 }}>
                        SKILLS:
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#f8eee7' }}>
                        {selectedApplicant.skills}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleShortlistApplicant(selectedApplicant.id)}
                  className="flex-1"
                >
                  SHORTLISTED
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleApproveApplicant(selectedApplicant.id)}
                  className="flex-1"
                >
                  APPROVE
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => handleRejectApplicant(selectedApplicant.id)}
                  className="flex-1"
                >
                  REJECT
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </EmployerLayout>
  )
}
