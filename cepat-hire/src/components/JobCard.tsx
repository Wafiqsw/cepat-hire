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
      <div
        className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2"
        style={{
          backgroundColor: '#f8eee7',
          borderColor: '#94618e',
        }}
      >
        {/* Header */}
        <div
          className="px-4 sm:px-6 py-4 border-b-2 flex items-start justify-between gap-3"
          style={{ borderBottomColor: '#94618e' }}
        >
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold mb-1 truncate" style={{ color: '#94618e' }} title={job.title}>
              {job.title}
            </h3>
            <p className="text-sm sm:text-base font-medium truncate" style={{ color: '#94618e', opacity: 0.8 }} title={job.company}>
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
        <div className="px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={16} style={{ color: '#94618e', opacity: 0.7 }} className="flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e' }} title={job.location}>
                {job.location}
              </span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <Briefcase size={16} style={{ color: '#94618e', opacity: 0.7 }} className="flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e' }}>
                {job.type}
              </span>
            </div>

            {job.salary && (
              <div className="flex items-center gap-2 min-w-0">
                <DollarSign size={16} style={{ color: '#94618e', opacity: 0.7 }} className="flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold truncate" style={{ color: '#94618e' }}>
                  {job.salary}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 min-w-0">
              <Clock size={16} style={{ color: '#94618e', opacity: 0.7 }} className="flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e', opacity: 0.7 }}>
                {job.postedDate}
              </span>
            </div>
          </div>

          {job.description && (
            <p
              className="text-xs sm:text-sm leading-relaxed line-clamp-2"
              style={{ color: '#94618e', opacity: 0.8 }}
              title={job.description}
            >
              {job.description}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className="px-4 sm:px-6 py-3 sm:py-4 border-t-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3"
          style={{ borderTopColor: '#94618e' }}
        >
          {variant === 'employer' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(job.id)}
                className="flex-1 justify-center"
              >
                <Edit size={14} className="sm:mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 justify-center"
              >
                <Trash2 size={14} className="sm:mr-1" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

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
