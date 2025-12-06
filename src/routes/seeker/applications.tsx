import { createFileRoute } from '@tanstack/react-router'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { useState } from 'react'
import { Filter, Briefcase, MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/seeker/applications')({
  component: ApplicationsPage,
})

type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'interviewing'

interface Application {
  id: string
  jobTitle: string
  company: string
  location: string
  appliedDate: string
  status: ApplicationStatus
  salary: string
  jobType: string
  description: string
}

function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('pending')

  // Mock application data
  const applications: Application[] = [
    {
      id: '1',
      jobTitle: 'Delivery Rider',
      company: 'FoodPanda',
      location: 'Kuala Lumpur',
      appliedDate: '05/12/2024',
      status: 'accepted',
      salary: 'RM 15-20/hour',
      jobType: 'Part-time',
      description: 'Deliver food orders around KL area. Flexible hours.',
    },
    {
      id: '2',
      jobTitle: 'Event Helper',
      company: 'Event Masters',
      location: 'Petaling Jaya',
      appliedDate: '04/12/2024',
      status: 'pending',
      salary: 'RM 200/day',
      jobType: 'Temporary',
      description: 'Help set up booths and equipment for weekend events.',
    },
    {
      id: '3',
      jobTitle: 'Warehouse Packer',
      company: 'Logistics Hub',
      location: 'Shah Alam',
      appliedDate: '03/12/2024',
      status: 'rejected',
      salary: 'RM 10/hour',
      jobType: 'Part-time',
      description: 'Pack and sort items in warehouse. Weekend shifts available.',
    },
    {
      id: '4',
      jobTitle: 'Promoter',
      company: 'Retail Solutions',
      location: 'Mid Valley',
      appliedDate: '02/12/2024',
      status: 'interviewing',
      salary: 'RM 80/day',
      jobType: 'Temporary',
      description: 'Promote products at shopping mall. Good communication skills needed.',
    },
    {
      id: '5',
      jobTitle: 'Cleaner',
      company: 'Clean Pro Services',
      location: 'Subang Jaya',
      appliedDate: '01/12/2024',
      status: 'pending',
      salary: 'RM 12/hour',
      jobType: 'Part-time',
      description: 'Office cleaning services. Morning or evening shifts.',
    },
  ]

  const filteredApplications = applications.filter(app => {
    return statusFilter === 'all' || app.status === statusFilter
  })

  const getStatusConfig = (status: ApplicationStatus) => {
    const configs = {
      pending: {
        icon: Clock,
        color: '#f59e0b',
        bgColor: '#fef3c7',
        text: 'Pending',
      },
      accepted: {
        icon: CheckCircle,
        color: '#10b981',
        bgColor: '#d1fae5',
        text: 'Accepted',
      },
      rejected: {
        icon: XCircle,
        color: '#ef4444',
        bgColor: '#fee2e2',
        text: 'Rejected',
      },
      interviewing: {
        icon: AlertCircle,
        color: '#3b82f6',
        bgColor: '#dbeafe',
        text: 'Interview',
      },
    }
    return configs[status]
  }

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    interviewing: applications.filter(a => a.status === 'interviewing').length,
  }

  return (
    <SeekerLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
            My Applications
          </h1>
          <p className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
            Track your job applications and their status
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} style={{ color: '#94618e' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#f8eee7',
                borderColor: '#94618e',
                color: '#94618e',
              }}
            >
              <option value="all">All Applications ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="accepted">Accepted ({statusCounts.accepted})</option>
              <option value="interviewing">Interview ({statusCounts.interviewing})</option>
              <option value="rejected">Rejected ({statusCounts.rejected})</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => {
              const statusConfig = getStatusConfig(app.status)
              const StatusIcon = statusConfig.icon

              return (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Left - Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="p-3 rounded-xl flex-shrink-0"
                          style={{ backgroundColor: '#94618e' }}
                        >
                          <Briefcase size={24} style={{ color: '#f8eee7' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold mb-1" style={{ color: '#94618e' }}>
                            {app.jobTitle}
                          </h3>
                          <p className="text-base font-semibold mb-2" style={{ color: '#94618e', opacity: 0.8 }}>
                            {app.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} style={{ color: '#94618e', opacity: 0.6 }} />
                              <span style={{ color: '#94618e', opacity: 0.8 }}>{app.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} style={{ color: '#94618e', opacity: 0.6 }} />
                              <span style={{ color: '#94618e', opacity: 0.8 }}>Applied: {app.appliedDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm mb-3" style={{ color: '#94618e', opacity: 0.7 }}>
                        {app.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: '#94618e20',
                            color: '#94618e',
                          }}
                        >
                          {app.jobType}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: '#94618e20',
                            color: '#94618e',
                          }}
                        >
                          {app.salary}
                        </span>
                      </div>
                    </div>

                    {/* Right - Status Badge */}
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 flex-shrink-0"
                      style={{
                        backgroundColor: statusConfig.bgColor,
                        borderColor: statusConfig.color,
                      }}
                    >
                      <StatusIcon size={18} style={{ color: statusConfig.color }} />
                      <span className="font-bold text-sm" style={{ color: statusConfig.color }}>
                        {statusConfig.text}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 rounded-2xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#94618e' }}>
              <p className="text-lg" style={{ color: '#94618e', opacity: 0.6 }}>
                No applications found
              </p>
            </div>
          )}
        </div>
      </div>
    </SeekerLayout>
  )
}
