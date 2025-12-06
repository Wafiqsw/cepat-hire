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
  experience?: string
  skills?: string
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
        className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:scale-[1.01] ${className}`}
        style={{
          backgroundColor: '#5a3851',
          borderColor: '#94618e',
        }}
      >
        {/* Header with Gradient */}
        <div
          className="px-5 py-4 flex items-center justify-between gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(148,97,142,0.15) 0%, rgba(90,56,81,0.05) 100%)',
          }}
        >
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <AvatarPlaceholder
              name={applicant.name}
              src={applicant.avatar}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold truncate" style={{ color: '#f8eee7' }} title={applicant.name}>
                {applicant.name}
              </h3>
              <p className="text-sm truncate" style={{ color: '#f8eee7', opacity: 0.8 }} title={`Applied for: ${applicant.position}`}>
                {applicant.position}
              </p>
            </div>
          </div>

          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 shadow-sm"
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
            }}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
              >
                <Mail size={16} style={{ color: '#f8eee7' }} />
              </div>
              <span className="text-sm truncate" style={{ color: '#f8eee7', opacity: 0.9 }} title={applicant.email}>
                {applicant.email}
              </span>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
              >
                <Phone size={16} style={{ color: '#f8eee7' }} />
              </div>
              <span className="text-sm truncate" style={{ color: '#f8eee7', opacity: 0.9 }} title={applicant.phone}>
                {applicant.phone}
              </span>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
              >
                <MapPin size={16} style={{ color: '#f8eee7' }} />
              </div>
              <span className="text-sm truncate" style={{ color: '#f8eee7', opacity: 0.9 }} title={applicant.location}>
                {applicant.location}
              </span>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
              >
                <Briefcase size={16} style={{ color: '#f8eee7' }} />
              </div>
              <span className="text-sm truncate" style={{ color: '#f8eee7', opacity: 0.9 }} title={applicant.skills || applicant.experience}>
                {applicant.skills || applicant.experience}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 min-w-0">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
              style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
            >
              <Clock size={16} style={{ color: '#f8eee7' }} />
            </div>
            <span className="text-sm" style={{ color: '#f8eee7', opacity: 0.8 }}>
              Applied on {applicant.appliedDate}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails?.(applicant.id)}
              className="flex-1 justify-center"
            >
              <FileText size={14} />
              View Details
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
