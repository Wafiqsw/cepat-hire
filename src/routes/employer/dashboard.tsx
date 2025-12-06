import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../components/Button'
import { JobCard } from '../../components/JobCard'
import { ApplicantCard } from '../../components/ApplicantCard'

export const Route = createFileRoute('/employer/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  // Placeholder data - will be replaced with backend data
  const stats = {
    activeJobs: 20,
    applications: 5,
    pending: 7,
  }

  // Mock data for demonstration - will be replaced with real data
  const mockJobs = [
    {
      id: '1',
      title: 'Part-Time Barista',
      company: 'Cafe Delight',
      location: 'Kuala Lumpur, Malaysia',
      type: 'Part-time',
      salary: 'RM 10 - RM 15/hour',
      postedDate: '2 days ago',
      description: 'Join our friendly team! Make delicious coffee and serve customers.',
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
      description: 'Help customers find perfect outfits. Part-time position with flexible schedule.',
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
      description: 'Deliver food to customers. Own motorcycle required.',
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
      description: 'Teach mathematics to secondary school students.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    },
  ]

  const mockApplicants = [
    {
      id: '1',
      name: 'Ahmad Abdullah',
      email: 'ahmad@example.com',
      phone: '+60 12-345 6789',
      location: 'Kuala Lumpur',
      position: 'Senior Frontend Developer',
      experience: '5 years experience',
      appliedDate: 'Dec 5, 2025',
      status: 'pending' as const,
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      phone: '+60 13-456 7890',
      location: 'Selangor',
      position: 'Backend Engineer',
      experience: '3 years experience',
      appliedDate: 'Dec 4, 2025',
      status: 'reviewed' as const,
    },
  ]

  const handleEditJob = (id: string) => {
    console.log('Edit job:', id)
    // Will be implemented with backend
  }

  const handleDeleteJob = (id: string) => {
    console.log('Delete job:', id)
    // Will be implemented with backend
  }

  const handleViewApplicant = (id: string) => {
    console.log('View applicant:', id)
    // Will be implemented with backend
  }

  const handleAcceptApplicant = (id: string) => {
    console.log('Accept applicant:', id)
    // Will be implemented with backend
  }

  const handleRejectApplicant = (id: string) => {
    console.log('Reject applicant:', id)
    // Will be implemented with backend
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Dashboard Title */}
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#94618e' }}>
        DASHBOARD
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Active Jobs Card */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ backgroundColor: '#5a3851' }}
        >
          <div className="text-5xl font-bold text-white mb-2">
            {stats.activeJobs}
          </div>
          <div className="text-sm font-semibold text-white uppercase tracking-wide">
            ACTIVE JOB
          </div>
        </div>

        {/* Applications Card */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ backgroundColor: '#5a3851' }}
        >
          <div className="text-5xl font-bold text-white mb-2">
            {stats.applications}
          </div>
          <div className="text-sm font-semibold text-white uppercase tracking-wide">
            APPLICATIONS
          </div>
        </div>

        {/* Pending Card */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ backgroundColor: '#5a3851' }}
        >
          <div className="text-5xl font-bold text-white mb-2">
            {stats.pending}
          </div>
          <div className="text-sm font-semibold text-white uppercase tracking-wide">
            PENDING
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Posting and Posted Jobs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Posting Section */}
          <div>
            <h2
              className="text-sm font-bold uppercase mb-3 tracking-wide"
              style={{ color: '#5a3851' }}
            >
              JOB POSTING
            </h2>
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: '#b8a0b3' }}
            >
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
              >
                CREATE A NEW JOB
              </Button>
            </div>
          </div>

          {/* Posted Jobs Section */}
          <div>
            <h2
              className="text-sm font-bold uppercase mb-3 tracking-wide"
              style={{ color: '#5a3851' }}
            >
              POSTED JOB
            </h2>
            <div className="space-y-4">
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
          </div>
        </div>

        {/* Right Column - Applications Panel */}
        <div className="lg:col-span-1">
          <h2
            className="text-sm font-bold uppercase mb-3 tracking-wide"
            style={{ color: '#5a3851' }}
          >
            APPLICATIONS
          </h2>
          <div className="space-y-4">
            {mockApplicants.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onViewDetails={handleViewApplicant}
                onAccept={handleAcceptApplicant}
                onReject={handleRejectApplicant}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
