import { useState } from 'react'
import { Input, Checkbox } from './Input'
import { Button } from './Button'
import { Modal } from './Modal'
import { X } from 'lucide-react'

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
}

interface JobFormProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'create' | 'edit'
  initialData?: Partial<JobFormData>
  onSubmit: (data: JobFormData) => void
}

export const JobForm = ({
  isOpen,
  onClose,
  mode = 'create',
  initialData,
  onSubmit,
}: JobFormProps) => {
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    type: initialData?.type || '',
    salary: initialData?.salary || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    benefits: initialData?.benefits || '',
    isRemote: initialData?.isRemote || false,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required'
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    if (!formData.type) {
      newErrors.type = 'Job type is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      onClose()
    }
  }

  const handleChange = (field: keyof JobFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(148, 97, 142, 0.4)' }}
        aria-hidden="true"
      />

      {/* Form Modal */}
      <div
        className="relative rounded-2xl shadow-2xl max-w-3xl w-full my-8 transform transition-all duration-300 scale-100 animate-modal-appear"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: '#f8eee7' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b-2" style={{ borderBottomColor: '#94618e' }}>
          <h2 className="text-2xl font-bold" style={{ color: '#94618e' }}>
            {mode === 'create' ? 'Post New Job' : 'Edit Job Posting'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#94618e'
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-5">
            {/* Job Title */}
            <Input
              label="Job Title *"
              placeholder="e.g. Senior Frontend Developer"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={errors.title}
              fullWidth
            />

            {/* Company & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Company Name *"
                placeholder="Your company name"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                error={errors.company}
                fullWidth
              />

              <Input
                label="Location *"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                error={errors.location}
                fullWidth
              />
            </div>

            {/* Job Type & Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                as="select"
                label="Job Type *"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                error={errors.type}
                fullWidth
                options={[
                  { value: '', label: 'Select job type' },
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'Contract', label: 'Contract' },
                  { value: 'Internship', label: 'Internship' },
                  { value: 'Temporary', label: 'Temporary' },
                ]}
              />

              <Input
                label="Salary Range"
                placeholder="e.g. $120k - $150k"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                fullWidth
              />
            </div>

            {/* Description */}
            <Input
              as="textarea"
              label="Job Description *"
              placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={errors.description}
              rows={5}
              fullWidth
            />

            {/* Requirements */}
            <Input
              as="textarea"
              label="Requirements"
              placeholder="List the qualifications, skills, and experience needed..."
              value={formData.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              rows={4}
              fullWidth
            />

            {/* Benefits */}
            <Input
              as="textarea"
              label="Benefits & Perks"
              placeholder="What benefits and perks do you offer?"
              value={formData.benefits}
              onChange={(e) => handleChange('benefits', e.target.value)}
              rows={3}
              fullWidth
            />

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <Checkbox
                label="This is a remote position"
                checked={formData.isRemote}
                onChange={(e) => handleChange('isRemote', e.target.checked)}
              />
              <Checkbox
                label="Post is active (visible to job seekers)"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div
          className="flex items-center justify-end gap-3 px-8 py-6 border-t-2"
          style={{ borderTopColor: '#94618e' }}
        >
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === 'create' ? 'Post Job' : 'Update Job'}
          </Button>
        </div>
      </div>
    </div>
  )
}
