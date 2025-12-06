import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { JobCard } from '../../components/JobCard'
import { JobForm } from '../../components/JobForm'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/employer/joblist')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)

  // Mock data - will be replaced with backend data
  const mockJobs = [
    {
      id: '1',
      title: 'Part-Time Barista',
      company: 'Cafe Delight',
      location: 'Kuala Lumpur, Malaysia',
      type: 'Part-time',
      salary: 'RM 10 - RM 15/hour',
      postedDate: '2 days ago',
      description: 'Join our friendly team! Make delicious coffee and serve customers. Flexible hours, weekends available. No experience needed, training provided.',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    },
    {
      id: '2',
      title: 'Retail Sales Assistant',
      company: 'Fashion Outlet',
      location: 'Penang, Malaysia',
      type: 'Part-time',
      salary: 'RM 8 - RM 12/hour',
      postedDate: '5 days ago',
      description: 'Help customers find perfect outfits. Part-time position with flexible schedule. Great for students. Commission available on sales.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    },
    {
      id: '3',
      title: 'Food Delivery Rider',
      company: 'Quick Eats',
      location: 'Selangor, Malaysia',
      type: 'Part-time',
      salary: 'RM 12 - RM 18/hour',
      postedDate: '1 week ago',
      description: 'Deliver food to customers. Own motorcycle required. Flexible working hours, choose your own schedule. Earn extra with tips and bonuses.',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80',
    },
    {
      id: '4',
      title: 'Tutor - Mathematics',
      company: 'Learning Center',
      location: 'Kuala Lumpur, Malaysia',
      type: 'Part-time',
      salary: 'RM 25 - RM 40/hour',
      postedDate: '3 days ago',
      description: 'Teach mathematics to secondary school students. Flexible hours, weekend classes available. Must have strong math background.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    },
    {
      id: '5',
      title: 'Warehouse Packer',
      company: 'Logistics Hub',
      location: 'Johor Bahru, Malaysia',
      type: 'Part-time',
      salary: 'RM 9 - RM 13/hour',
      postedDate: '1 day ago',
      description: 'Pack and prepare orders for shipment. Morning or evening shifts available. Physical work, good for staying active. Weekly pay.',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
    },
    {
      id: '6',
      title: 'Restaurant Server',
      company: 'Family Dining',
      location: 'Petaling Jaya, Malaysia',
      type: 'Part-time',
      salary: 'RM 10 - RM 14/hour',
      postedDate: '4 days ago',
      description: 'Serve customers in a friendly family restaurant. Evening and weekend shifts. Tips included. Great team environment.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    },
  ]

  const handleCreateJob = () => {
    setEditingJob(null)
    setIsFormOpen(true)
  }

  const handleEditJob = (id: string) => {
    const job = mockJobs.find((j) => j.id === id)
    if (job) {
      setEditingJob(job)
      setIsFormOpen(true)
    }
  }

  const handleDeleteJob = (id: string) => {
    console.log('Delete job:', id)
    // Will be implemented with backend
  }

  const handleFormSubmit = (data: any) => {
    if (editingJob) {
      console.log('Updating job:', editingJob.id, data)
      // Will be implemented with backend - update job
    } else {
      console.log('Creating new job:', data)
      // Will be implemented with backend - create job
    }
    setIsFormOpen(false)
    setEditingJob(null)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingJob(null)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#94618e' }}>
          JOB LIST
        </h1>
        <Button
          variant="primary"
          size="md"
          onClick={handleCreateJob}
          className="w-full sm:w-auto"
        >
          <Plus size={20} />
          CREATE A NEW JOB
        </Button>
      </div>

      {/* Job Count */}
      <div className="mb-6">
        <p className="text-base font-medium" style={{ color: '#94618e', opacity: 0.8 }}>
          Total Jobs: <span className="font-bold">{mockJobs.length}</span>
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockJobs.map((job) => (
          <JobCard
            key={job.id}
            variant="employer"
            job={job}
            onEdit={handleEditJob}
            onDelete={handleDeleteJob}
          />
        ))}
      </div>

      {/* Empty State (show when no jobs) */}
      {mockJobs.length === 0 && (
        <div
          className="rounded-xl p-12 text-center border-2 border-dashed"
          style={{ borderColor: '#94618e', backgroundColor: '#f8eee7' }}
        >
          <div className="max-w-md mx-auto">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#e8dcd7' }}
            >
              <Plus size={40} style={{ color: '#94618e' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#94618e' }}>
              No Jobs Posted Yet
            </h3>
            <p className="text-base mb-6" style={{ color: '#94618e', opacity: 0.7 }}>
              Start by creating your first job posting to attract talented candidates.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateJob}
            >
              <Plus size={20} />
              Create Your First Job
            </Button>
          </div>
        </div>
      )}

      {/* Job Form Modal */}
      <JobForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        mode={editingJob ? 'edit' : 'create'}
        initialData={editingJob || undefined}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
