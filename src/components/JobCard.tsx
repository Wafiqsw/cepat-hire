import { useState } from 'react'
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  BookmarkPlus,
  ExternalLink,
} from 'lucide-react'
import { Button } from './Button'
import { Modal, ModalActions } from './Modal'

type JobCardVariant = 'employer' | 'seeker'

interface JobData {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary?: string
  postedDate: string
  description?: string
  image?: string
}

interface JobCardProps {
  variant: JobCardVariant
  job: JobData
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onApply?: (id: string) => void
  onSave?: (id: string) => void
}

export const JobCard = ({
  variant,
  job,
  onEdit,
  onDelete,
  onApply,
  onSave,
}: JobCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleDelete = () => {
    onDelete?.(job.id)
    setShowDeleteModal(false)
  }

  const handleApply = () => {
    onApply?.(job.id)
    setShowApplyModal(false)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.(job.id)
  }

  return (
    <>
      {variant === 'employer' ? (
        /* Employer variant with modern card design */
        <div
          className="rounded-xl overflow-hidden border-2 shadow-md hover:shadow-xl transition-all duration-300"
          style={{
            backgroundColor: '#5a3851',
            borderColor: '#94618e',
          }}
        >
          {/* Job Image with Title Overlay (optional) */}
          {job.image && (
            <div className="relative w-full h-48 overflow-hidden">
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
          )}

          {/* Card Content */}
          <div className="p-5">
            {!job.image && (
              <h3 className="text-lg font-bold mb-2" style={{ color: '#f8eee7' }}>
                {job.title}
              </h3>
            )}
            <p className="text-sm font-medium mb-2" style={{ color: '#f8eee7', opacity: 0.9 }}>
              {job.company}
            </p>
            <p className="text-xs mb-3" style={{ color: '#f8eee7', opacity: 0.7 }}>
              {job.location} • {job.type} • {job.salary}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit?.(job.id)}
                className="flex-1 justify-center"
              >
                EDIT
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 justify-center"
              >
                DELETE
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Default/Seeker variant */
        <div
          className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2"
          style={{
            backgroundColor: '#f8eee7',
            borderColor: '#94618e',
          }}
        >
          {/* Job Image */}
          {job.image && (
            <div className="relative w-full h-32 overflow-hidden">
              <img
                src={job.image}
                alt={job.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(148,97,142,0.1) 100%)',
                }}
              />
            </div>
          )}

          {/* Header */}
          <div
            className="px-4 py-3 border-b-2 flex items-start justify-between gap-3"
            style={{ borderBottomColor: '#94618e' }}
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold mb-1 truncate" style={{ color: '#94618e' }} title={job.title}>
                {job.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium truncate" style={{ color: '#94618e', opacity: 0.8 }} title={job.company}>
                {job.company}
              </p>
            </div>

            {variant === 'seeker' && (
              <button
                onClick={handleSave}
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: isSaved ? '#94618e' : 'transparent',
                  color: isSaved ? '#f8eee7' : '#94618e',
                }}
                aria-label="Save job"
              >
                <BookmarkPlus size={20} />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={14} style={{ color: '#94618e', opacity: 0.7 }} className="flex-shrink-0" />
                <span className="text-xs truncate" style={{ color: '#94618e' }} title={job.location}>
                  {job.location}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <Briefcase size={14} style={{ color: '#94618e', opacity: 0.7 }} className="flex-shrink-0" />
                <span className="text-xs truncate" style={{ color: '#94618e' }}>
                  {job.type}
                </span>
              </div>

              {job.salary && (
                <div className="flex items-center gap-2 min-w-0">
                  <DollarSign size={14} style={{ color: '#94618e', opacity: 0.7 }} className="flex-shrink-0" />
                  <span className="text-xs font-semibold truncate" style={{ color: '#94618e' }}>
                    {job.salary}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 min-w-0">
                <Clock size={14} style={{ color: '#94618e', opacity: 0.7 }} className="flex-shrink-0" />
                <span className="text-xs truncate" style={{ color: '#94618e', opacity: 0.7 }}>
                  {job.postedDate}
                </span>
              </div>
            </div>

            {job.description && (
              <p
                className="text-xs leading-relaxed line-clamp-2"
                style={{ color: '#94618e', opacity: 0.8 }}
                title={job.description}
              >
                {job.description}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div
            className="px-4 py-2.5 border-t-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            style={{ borderTopColor: '#94618e' }}
          >
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowApplyModal(true)}
              className="flex-1 justify-center"
            >
              Apply Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 justify-center"
            >
              <ExternalLink size={14} className="sm:mr-1" />
              <span className="hidden sm:inline">Details</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {variant === 'employer' && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          variant="fail"
          title="Delete Job Posting?"
        >
          <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
            Are you sure you want to delete the job posting for{' '}
            <strong>"{job.title}"</strong>? This action cannot be undone.
          </p>
          <ModalActions align="center">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Job
            </Button>
          </ModalActions>
        </Modal>
      )}

      {/* Apply Confirmation Modal */}
      {variant === 'seeker' && (
        <Modal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          variant="success"
          title="Apply for this Job?"
        >
          <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
            Are you sure you want to apply for the <strong>{job.title}</strong> position at{' '}
            <strong>{job.company}</strong>? Your profile and resume will be submitted to the employer.
          </p>
          <ModalActions align="center">
            <Button
              variant="outline"
              onClick={() => setShowApplyModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApply}>
              Yes, Apply
            </Button>
          </ModalActions>
        </Modal>
      )}
    </>
  )
}

// Job List Container (optional helper component)
interface JobListProps {
  variant: JobCardVariant
  jobs: JobData[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onApply?: (id: string) => void
  onSave?: (id: string) => void
}

export const JobList = ({
  variant,
  jobs,
  onEdit,
  onDelete,
  onApply,
  onSave,
}: JobListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          variant={variant}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          onApply={onApply}
          onSave={onSave}
        />
      ))}
    </div>
  )
}
