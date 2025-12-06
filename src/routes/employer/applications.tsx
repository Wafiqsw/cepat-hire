import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { ApplicantCard } from '../../components/ApplicantCard'
import { AvatarPlaceholder } from '../../components/ImagePlaceholder'
import { Modal, ModalActions } from '../../components/Modal'
import { ChevronLeft, Star, Mail, Phone, MapPin, Briefcase } from 'lucide-react'

export const Route = createFileRoute('/employer/applications')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Mock jobs data - will be replaced with backend data
  const mockJobs = [
    {
      id: '1',
      title: 'Part-Time Barista',
      company: 'Cafe Delight',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
      applicantsCount: 12,
    },
    {
      id: '2',
      title: 'Retail Sales Assistant',
      company: 'Fashion Outlet',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      applicantsCount: 8,
    },
    {
      id: '3',
      title: 'Food Delivery Rider',
      company: 'Quick Eats',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80',
      applicantsCount: 15,
    },
    {
      id: '4',
      title: 'Tutor - Mathematics',
      company: 'Learning Center',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      applicantsCount: 5,
    },
    {
      id: '5',
      title: 'Warehouse Packer',
      company: 'Logistics Hub',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
      applicantsCount: 20,
    },
    {
      id: '6',
      title: 'Restaurant Server',
      company: 'Family Dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      applicantsCount: 10,
    },
  ]

  // Mock applicants data - will be replaced with backend data
  const mockApplicants = [
    {
      id: '1',
      name: 'Ahmad Abdullah',
      email: 'ahmad@example.com',
      phone: '+60 12-345 6789',
      location: 'Kuala Lumpur',
      position: 'Part-Time Barista',
      skills: 'Customer Service, Coffee Making, Team Work',
      appliedDate: 'Dec 5, 2025',
      status: 'pending' as const,
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      phone: '+60 13-456 7890',
      location: 'Selangor',
      position: 'Part-Time Barista',
      skills: 'Communication, Sales, Organization',
      appliedDate: 'Dec 4, 2025',
      status: 'reviewed' as const,
    },
    {
      id: '3',
      name: 'Lee Wei Ming',
      email: 'leewei@example.com',
      phone: '+60 14-567 8901',
      location: 'Kuala Lumpur',
      position: 'Part-Time Barista',
      skills: 'Leadership, Multitasking, Problem Solving',
      appliedDate: 'Dec 3, 2025',
      status: 'shortlisted' as const,
    },
  ]

  const handleViewApplicants = (jobId: string) => {
    setSelectedJob(jobId)
  }

  const handleBackToJobs = () => {
    setSelectedJob(null)
  }

  const handleViewDetails = (id: string) => {
    const applicant = mockApplicants.find((a) => a.id === id)
    if (applicant) {
      setSelectedApplicant(applicant)
      setIsDetailsModalOpen(true)
    }
  }

  const handleApproveApplicant = (id: string) => {
    console.log('Approve applicant:', id)
    setIsDetailsModalOpen(false)
    // Will be implemented with backend
  }

  const handleShortlistApplicant = (id: string) => {
    console.log('Shortlist applicant:', id)
    setIsDetailsModalOpen(false)
    // Will be implemented with backend
  }

  const handleRejectApplicant = (id: string) => {
    console.log('Reject applicant:', id)
    setIsDetailsModalOpen(false)
    // Will be implemented with backend
  }

  const handleAcceptApplicant = (id: string) => {
    handleShortlistApplicant(id)
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedApplicant(null)
  }

  const selectedJobData = mockJobs.find((job) => job.id === selectedJob)

  return (
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
              {mockApplicants.length} Applicants
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
          {mockApplicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onViewDetails={handleViewDetails}
              onAccept={handleAcceptApplicant}
              onReject={handleRejectApplicant}
            />
          ))}
          
          {mockApplicants.length === 0 && (
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
          {mockJobs.map((job) => (
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
  )
}
