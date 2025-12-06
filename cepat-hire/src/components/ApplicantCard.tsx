import { useState } from 'react'
import { Mail, Phone, MapPin, Briefcase, FileText, ChevronRight, Clock } from 'lucide-react'
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
  experience: string
  appliedDate: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
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
  }
  return styles[status]
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
        className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${className}`}
        style={{
          backgroundColor: '#f8eee7',
          borderColor: '#94618e',
        }}
      >
      {/* Header */}
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 border-b-2 flex items-center justify-between gap-3"
        style={{ borderBottomColor: '#94618e' }}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <AvatarPlaceholder
            name={applicant.name}
            src={applicant.avatar}
            size="md"
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: '#94618e' }} title={applicant.name}>
              {applicant.name}
            </h3>
            <p className="text-xs sm:text-sm truncate" style={{ color: '#94618e', opacity: 0.7 }} title={`Applied for: ${applicant.position}`}>
              Applied for: {applicant.position}
            </p>
          </div>
        </div>

        <span
          className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0"
          style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
          }}
        >
          {statusStyle.label}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <Mail size={14} style={{ color: '#94618e', opacity: 0.6 }} className="flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e' }} title={applicant.email}>
              {applicant.email}
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <Phone size={14} style={{ color: '#94618e', opacity: 0.6 }} className="flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e' }} title={applicant.phone}>
              {applicant.phone}
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={14} style={{ color: '#94618e', opacity: 0.6 }} className="flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e' }} title={applicant.location}>
              {applicant.location}
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <Briefcase size={14} style={{ color: '#94618e', opacity: 0.6 }} className="flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e' }} title={applicant.experience}>
              {applicant.experience}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 sm:mb-4 min-w-0">
          <Clock size={14} style={{ color: '#94618e', opacity: 0.6 }} className="flex-shrink-0" />
          <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e', opacity: 0.7 }}>
            Applied on {applicant.appliedDate}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 border-t-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3"
        style={{ borderTopColor: '#94618e' }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails?.(applicant.id)}
          className="flex-1 justify-center"
        >
          <FileText size={14} className="sm:mr-1" />
          <span className="hidden sm:inline">View Details</span>
          <span className="sm:hidden">Details</span>
        </Button>

        {applicant.status === 'pending' && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowShortlistModal(true)}
              className="flex-1 justify-center"
            >
              Shortlist
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowRejectModal(true)}
              className="flex-1 justify-center"
            >
              Reject
            </Button>
          </>
        )}
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
