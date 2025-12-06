import { useState } from 'react'
import { FileText, ChevronRight, Clock } from 'lucide-react'
import { AvatarPlaceholder } from './ImagePlaceholder'
import { Button } from './Button'
import { Modal, ModalActions } from './Modal'

interface ApplicantData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  position: string
  experience?: string
  skills?: string
  appliedDate: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'
  avatar?: string
}

interface ApplicantCardProps {
  applicant: ApplicantData
  onViewDetails?: (id: string) => void
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  className?: string
}

const getStatusStyle = (status: ApplicantData['status']) => {
  const styles = {
    pending: {
      bg: '#fef9c3',
      text: '#854d0e',
      label: 'Pending Review',
    },
    reviewed: {
      bg: '#e0e7ff',
      text: '#3730a3',
      label: 'Reviewed',
    },
    shortlisted: {
      bg: '#dcfce7',
      text: '#166534',
      label: 'Shortlisted',
    },
    rejected: {
      bg: '#fee2e2',
      text: '#991b1b',
      label: 'Rejected',
    },
    hired: {
      bg: '#bbf7d0',
      text: '#15803d',
      label: 'Hired',
    },
  }
  return styles[status] || styles.pending
}

export const ApplicantCard = ({
  applicant,
  onViewDetails,
  onAccept,
  onReject,
  className = '',
}: ApplicantCardProps) => {
  const [showShortlistModal, setShowShortlistModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const statusStyle = getStatusStyle(applicant.status)

  const handleShortlist = () => {
    onAccept?.(applicant.id)
    setShowShortlistModal(false)
  }

  const handleReject = () => {
    onReject?.(applicant.id)
    setShowRejectModal(false)
  }

  return (
    <>
      <div
        className={`group rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border hover:scale-[1.02] ${className}`}
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
        }}
      >
        {/* Header Section */}
        <div
          className="px-6 py-5 border-b"
          style={{ borderBottomColor: '#f3f4f6' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="relative">
                <AvatarPlaceholder
                  name={applicant.name}
                  src={applicant.avatar}
                  size="xl"
                />
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#10b981' }}
                  title="Active"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold mb-1" style={{ color: '#1f2937' }} title={applicant.name}>
                  {applicant.name}
                </h3>
                <p className="text-sm font-medium mb-2" style={{ color: '#6b7280' }} title={applicant.position}>
                  {applicant.position}
                </p>
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: '#9ca3af' }} />
                  <span className="text-xs" style={{ color: '#9ca3af' }}>
                    Applied {applicant.appliedDate}
                  </span>
                </div>
              </div>
            </div>

            <span
              className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
              }}
            >
              {statusStyle.label}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div
          className="px-6 py-4 border-t flex items-center gap-3"
          style={{ backgroundColor: '#f9fafb', borderTopColor: '#f3f4f6' }}
        >
          <button
            onClick={() => onViewDetails?.(applicant.id)}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 border-2"
            style={{
              backgroundColor: '#ffffff',
              color: '#94618e',
              borderColor: '#94618e',
            }}
          >
            <FileText size={16} />
            View Full Profile
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Shortlist Confirmation Modal */}
      <Modal
        isOpen={showShortlistModal}
        onClose={() => setShowShortlistModal(false)}
        variant="success"
        title="Shortlist Applicant?"
      >
        <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
          Are you sure you want to shortlist <strong>{applicant.name}</strong> for the{' '}
          <strong>{applicant.position}</strong> position? They will be notified about this decision.
        </p>
        <ModalActions align="center">
          <Button
            variant="outline"
            onClick={() => setShowShortlistModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleShortlist}>
            Yes, Shortlist
          </Button>
        </ModalActions>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        variant="fail"
        title="Reject Applicant?"
      >
        <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
          Are you sure you want to reject <strong>{applicant.name}</strong>'s application for{' '}
          <strong>{applicant.position}</strong>? This action will notify the applicant.
        </p>
        <ModalActions align="center">
          <Button
            variant="outline"
            onClick={() => setShowRejectModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Yes, Reject
          </Button>
        </ModalActions>
      </Modal>
    </>
  )
}

// Applicant List Component
interface ApplicantListProps {
  applicants: ApplicantData[]
  onViewDetails?: (id: string) => void
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
}

export const ApplicantList = ({
  applicants,
  onViewDetails,
  onAccept,
  onReject,
}: ApplicantListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {applicants.map((applicant) => (
        <ApplicantCard
          key={applicant.id}
          applicant={applicant}
          onViewDetails={onViewDetails}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  )
}
