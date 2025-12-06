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
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'Kuala Lumpur',
      type: 'Full-time',
      salary: 'RM 8,000 - RM 12,000',
      postedDate: '2 days ago',
      description: 'Looking for an experienced frontend developer...',
    },
    {
      id: '2',
      title: 'Backend Engineer',
      company: 'Innovation Labs',
      location: 'Penang',
      type: 'Full-time',
      salary: 'RM 7,000 - RM 10,000',
      postedDate: '5 days ago',
      description: 'Join our backend team to build scalable APIs...',
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      type: 'Contract',
      salary: 'RM 5,000 - RM 8,000',
      postedDate: '1 week ago',
      description: 'Create beautiful user experiences...',
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
