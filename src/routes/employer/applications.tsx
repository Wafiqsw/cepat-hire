import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '../../components/Button'
import { ApplicantCard } from '../../components/ApplicantCard'
import { AvatarPlaceholder } from '../../components/ImagePlaceholder'
import { Loading, Skeleton } from '../../components/Loading'
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
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showHireConfirmModal, setShowHireConfirmModal] = useState(false)
  const [showHireSuccessModal, setShowHireSuccessModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [workPeriod, setWorkPeriod] = useState('')
  const [isHiring, setIsHiring] = useState(false)
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
  const createEmployee = useMutation(api.employees.create)
  const createPayment = useMutation(api.payments.create)

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
      status: app.status as 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired',
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

  const handleHireApplicant = async (id: string) => {
    if (!user?.id || !selectedJob) return

    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount')
      return
    }
    if (!workPeriod.trim()) {
      alert('Please enter the work period')
      return
    }

    setIsHiring(true)
    try {
      // Find the application to get all necessary IDs
      const application = applicationsWithDetails?.find(app => app._id === id)
      if (!application) return

      // Update application status to 'hired'
      await updateApplicationStatus({
        id: id as Id<'applications'>,
        status: 'hired',
      })

      // Create employee record
      await createEmployee({
        jobId: application.jobId,
        candidateId: application.candidateId,
        employerId: user.id as Id<'users'>,
        applicationId: id as Id<'applications'>,
      })

      // Create payment record for the seeker
      await createPayment({
        jobId: application.jobId,
        candidateId: application.candidateId,
        amount: amount,
        currency: 'RM',
        status: 'pending',
        dateRange: workPeriod,
        description: `Payment for ${application.job?.title || 'job'}`,
        paymentMethod: 'pending',
      })

      setShowHireConfirmModal(false)
      setIsDetailsModalOpen(false)
      setPaymentAmount('')
      setWorkPeriod('')
      setShowHireSuccessModal(true)
    } catch (error) {
      console.error('Failed to hire applicant:', error)
      alert('Failed to hire applicant. Please try again.')
    } finally {
      setIsHiring(false)
    }
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

          {/* Job Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} variant="card" className="h-48" />
            ))}
          </div>

          {/* Loading Indicator */}
          <Loading size="lg" text="Loading applications..." />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsWithCounts.map((job) => (
              <div
                key={job.id}
                className="group rounded-2xl overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#94618e',
                }}
                onClick={() => handleViewApplicants(job.id)}
              >
                {/* Job Image with Overlay */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={job.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800'}
                    alt={job.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(148,97,142,0.95) 100%)',
                    }}
                  />

                  {/* Applicant Count Badge */}
                  <div className="absolute top-4 right-4">
                    <div
                      className="px-4 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-sm"
                      style={{
                        backgroundColor: job.applicantsCount > 0 ? '#10b981' : '#94618e',
                        color: '#ffffff',
                      }}
                    >
                      {job.applicantsCount} {job.applicantsCount === 1 ? 'Applicant' : 'Applicants'}
                    </div>
                  </div>

                  {/* Job Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: '#f8eee7', opacity: 0.9 }}>
                      {job.company}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 flex items-center justify-between" style={{ backgroundColor: '#f8eee7' }}>
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} style={{ color: '#94618e', opacity: 0.7 }} />
                    <span className="text-sm font-semibold" style={{ color: '#94618e' }}>
                      View Applications
                    </span>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                    style={{ backgroundColor: '#94618e' }}
                  >
                    <ChevronLeft size={18} style={{ color: '#f8eee7', transform: 'rotate(180deg)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  variant="danger"
                  size="lg"
                  onClick={() => {
                    setIsDetailsModalOpen(false)
                    setShowRejectModal(true)
                  }}
                  className="flex-1"
                >
                  ✕ REJECT
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setIsDetailsModalOpen(false)
                    setShowHireConfirmModal(true)
                  }}
                  className="flex-1"
                  style={{ backgroundColor: '#10b981' }}
                >
                  ✓ HIRE AS EMPLOYEE
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedApplicant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(148, 97, 142, 0.4)' }}
            aria-hidden="true"
          />
          <div
            className="relative rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#f8eee7' }}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
                <span className="text-4xl text-white">✕</span>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#94618e' }}>
                Reject {selectedApplicant.name}?
              </h2>
              <p className="text-base mb-6" style={{ color: '#94618e', opacity: 0.8 }}>
                Are you sure you want to reject this applicant? They will be notified about this decision.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1"
                >
                  CANCEL
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => {
                    handleRejectApplicant(selectedApplicant.id)
                    setShowRejectModal(false)
                  }}
                  className="flex-1"
                >
                  YES, REJECT
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hire Confirmation Modal */}
      {showHireConfirmModal && selectedApplicant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            if (!isHiring) {
              setShowHireConfirmModal(false)
              setPaymentAmount('')
              setWorkPeriod('')
            }
          }}
        >
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(148, 97, 142, 0.4)' }}
            aria-hidden="true"
          />
          <div
            className="relative rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#f8eee7' }}
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#10b981' }}>
                  <Briefcase size={32} style={{ color: '#ffffff' }} />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#94618e' }}>
                  Hire {selectedApplicant.name}?
                </h2>
                <p className="text-sm" style={{ color: '#94618e', opacity: 0.8 }}>
                  Enter the payment details for this worker
                </p>
              </div>

              {/* Payment Details Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#94618e' }}>
                    Payment Amount (RM)
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="e.g. 500.00"
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: '#94618e',
                      color: '#94618e',
                    }}
                    min="0"
                    step="0.01"
                    disabled={isHiring}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#94618e' }}>
                    Work Period
                  </label>
                  <input
                    type="text"
                    value={workPeriod}
                    onChange={(e) => setWorkPeriod(e.target.value)}
                    placeholder="e.g. 1 Dec - 15 Dec 2024"
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: '#94618e',
                      color: '#94618e',
                    }}
                    disabled={isHiring}
                  />
                </div>
              </div>

              <p className="text-xs text-center mb-4" style={{ color: '#94618e', opacity: 0.6 }}>
                This will create an employee record and a payment record for the worker.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setShowHireConfirmModal(false)
                    setPaymentAmount('')
                    setWorkPeriod('')
                  }}
                  className="flex-1"
                  disabled={isHiring}
                >
                  CANCEL
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleHireApplicant(selectedApplicant.id)}
                  className="flex-1"
                  style={{ backgroundColor: '#10b981' }}
                  disabled={isHiring || !paymentAmount || !workPeriod}
                >
                  {isHiring ? 'HIRING...' : 'YES, HIRE'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hire Success Modal */}
      {showHireSuccessModal && selectedApplicant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setShowHireSuccessModal(false)
            setSelectedApplicant(null)
          }}
        >
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(148, 97, 142, 0.4)' }}
            aria-hidden="true"
          />
          <div
            className="relative rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#f8eee7' }}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce" style={{ backgroundColor: '#10b981' }}>
                <span className="text-4xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#94618e' }}>
                Successfully Hired!
              </h2>
              <p className="text-base mb-6" style={{ color: '#94618e', opacity: 0.8 }}>
                {selectedApplicant.name} has been hired as an employee. The employee record has been created.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setShowHireSuccessModal(false)
                  setSelectedApplicant(null)
                }}
                className="w-full"
                style={{ backgroundColor: '#10b981' }}
              >
                DONE
              </Button>
            </div>
          </div>
        </div>
      )}
    </EmployerLayout>
  )
}
