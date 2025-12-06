import { createFileRoute } from '@tanstack/react-router'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { useState } from 'react'
import { Bookmark, MapPin, DollarSign, Clock, X } from 'lucide-react'
import { Button } from '../../components'

export const Route = createFileRoute('/seeker/saved-jobs')({
  component: SavedJobsPage,
})

interface SavedJob {
  id: string
  title: string
  company: string
  location: string
  salary: string
  jobType: string
  postedDate: string
  description: string
}

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([
    {
      id: '1',
      title: 'Delivery Rider',
      company: 'GrabFood',
      location: 'Kuala Lumpur',
      salary: 'RM 15-20/hour',
      jobType: 'Part-time',
      postedDate: '2 days ago',
      description: 'Deliver food orders around KL area. Flexible hours, good tips. Must have own motorcycle.',
    },
    {
      id: '2',
      title: 'Event Setup Crew',
      company: 'Event Pro Malaysia',
      location: 'Petaling Jaya',
      salary: 'RM 200/day',
      jobType: 'Temporary',
      postedDate: '1 day ago',
      description: 'Help set up stages, booths, and equipment for corporate events and exhibitions.',
    },
    {
      id: '3',
      title: 'Warehouse Assistant',
      company: 'Shopee Logistics',
      location: 'Shah Alam',
      salary: 'RM 12/hour',
      jobType: 'Part-time',
      postedDate: '3 days ago',
      description: 'Sort and pack items in warehouse. Morning or evening shifts available.',
    },
    {
      id: '4',
      title: 'Promoter',
      company: 'Samsung Malaysia',
      location: 'Mid Valley',
      salary: 'RM 100/day',
      jobType: 'Temporary',
      postedDate: '5 days ago',
      description: 'Promote Samsung products at shopping mall. Good communication skills needed.',
    },
  ])

  const handleUnsave = (jobId: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId))
  }

  return (
    <SeekerLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
            Saved Jobs
          </h1>
          <p className="text-base" style={{ color: '#94618e', opacity: 0.6 }}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later
          </p>
        </div>

        {/* Jobs List */}
        {savedJobs.length > 0 ? (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-md relative"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleUnsave(job.id)}
                  className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:bg-red-50"
                  title="Remove from saved"
                >
                  <X size={20} style={{ color: '#94618e', opacity: 0.5 }} />
                </button>

                {/* Job Info */}
                <div className="pr-12">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #94618e 0%, #7a4f73 100%)'
                      }}
                    >
                      <Bookmark size={20} style={{ color: '#f8eee7' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-1" style={{ color: '#94618e' }}>
                        {job.title}
                      </h3>
                      <p className="text-base font-semibold mb-3" style={{ color: '#94618e', opacity: 0.7 }}>
                        {job.company}
                      </p>

                      {/* Job Details Row */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} style={{ color: '#94618e', opacity: 0.5 }} />
                          <span className="text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
                            {job.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} style={{ color: '#94618e', opacity: 0.5 }} />
                          <span className="text-sm font-bold" style={{ color: '#94618e' }}>
                            {job.salary}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} style={{ color: '#94618e', opacity: 0.5 }} />
                          <span className="text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
                            {job.postedDate}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm mb-4" style={{ color: '#94618e', opacity: 0.7 }}>
                        {job.description}
                      </p>

                      {/* Job Type Badge & Button */}
                      <div className="flex items-center gap-3">
                        <span
                          className="px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: '#94618e20',
                            color: '#94618e',
                          }}
                        >
                          {job.jobType}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => console.log('Apply to job:', job.id)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div
            className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: '#f8eee7' }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ backgroundColor: '#94618e20' }}
            >
              <Bookmark size={40} style={{ color: '#94618e', opacity: 0.4 }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#94618e' }}>
              No Saved Jobs Yet
            </h2>
            <p className="text-base mb-6" style={{ color: '#94618e', opacity: 0.6 }}>
              Start saving jobs you're interested in to easily find them later!
            </p>
            <Button
              variant="primary"
              onClick={() => console.log('Browse jobs')}
            >
              Browse Jobs
            </Button>
          </div>
        )}
      </div>
    </SeekerLayout>
  )
}
