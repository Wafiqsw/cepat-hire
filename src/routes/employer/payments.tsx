import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { EmployerLayout } from '../../layouts/EmployerLayout'
import { PaymentCard } from '../../components'
import { Filter, Download, Search } from 'lucide-react'
import { useState } from 'react'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/employer/payments')({
  component: EmployerPayments,
})

function EmployerPayments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Fetch real data from Convex
  const paymentsWithDetails = useQuery(api.payments.listWithDetails)
  const stats = useQuery(api.payments.getStats)

  // Mutations
  const updatePaymentStatus = useMutation(api.payments.updateStatus)

  // Transform payments data for display
  const payments = paymentsWithDetails?.map((payment) => ({
    id: payment._id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status as 'completed' | 'pending' | 'ongoing' | 'cancelled',
    date: payment.dateRange,
    description: payment.description,
    paymentMethod: payment.paymentMethod,
    transactionId: payment.transactionId,
    recipient: payment.candidate?.name || 'Unknown',
    job: payment.job ? {
      id: payment.job._id,
      title: payment.job.title,
      company: payment.job.company,
      location: payment.job.location || 'Location not specified',
      type: payment.job.type || 'Part-time',
      salary: payment.job.salary || 'Salary not specified',
      description: payment.job.description,
      image: payment.job.image || '',
    } : undefined,
  })) || []

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const displayStats = {
    total: stats?.total || 0,
    completed: stats?.completed || 0,
    pending: stats?.pending || 0,
    totalPayments: stats?.totalPayments || 0,
  }

  // Handlers
  const handleApprovePayment = async (id: string) => {
    try {
      await updatePaymentStatus({
        id: id as Id<'payments'>,
        status: 'completed',
        transactionId: `TXN-${Date.now()}`,
      })
    } catch (error) {
      console.error('Failed to approve payment:', error)
    }
  }

  const handleRejectPayment = async (id: string) => {
    try {
      await updatePaymentStatus({
        id: id as Id<'payments'>,
        status: 'cancelled',
      })
    } catch (error) {
      console.error('Failed to reject payment:', error)
    }
  }

  // Loading state
  if (paymentsWithDetails === undefined || stats === undefined) {
    return (
      <EmployerLayout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#94618e' }}>
            Payment Management
          </h1>
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
              Loading...
            </div>
          </div>
        </div>
      </EmployerLayout>
    )
  }

  return (
    <EmployerLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
            Payment Management
          </h1>
          <p className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
            Track and manage all your payments to freelancers and employees
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#94618e' }}>
            <p className="text-sm mb-2" style={{ color: '#94618e', opacity: 0.7 }}>
              Total Paid
            </p>
            <h3 className="text-2xl font-bold" style={{ color: '#94618e' }}>
              RM {displayStats.total.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#3b82f6' }}>
            <p className="text-sm mb-2" style={{ color: '#3b82f6', opacity: 0.7 }}>
              Completed
            </p>
            <h3 className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
              {displayStats.completed}
            </h3>
          </div>
          <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#fbbf24' }}>
            <p className="text-sm mb-2" style={{ color: '#d97706', opacity: 0.9 }}>
              Pending
            </p>
            <h3 className="text-2xl font-bold" style={{ color: '#d97706' }}>
              {displayStats.pending}
            </h3>
          </div>
          <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#4ade80' }}>
            <p className="text-sm mb-2" style={{ color: '#16a34a', opacity: 0.9 }}>
              Total Payments
            </p>
            <h3 className="text-2xl font-bold" style={{ color: '#16a34a' }}>
              {displayStats.totalPayments}
            </h3>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: '#94618e', opacity: 0.5 }}
            />
            <input
              type="text"
              placeholder="Search by recipient or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#f8eee7',
                borderColor: '#94618e',
                color: '#94618e',
              }}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} style={{ color: '#94618e' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-full border-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#f8eee7',
                borderColor: '#94618e',
                color: '#94618e',
              }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
            onClick={() => console.log('Export payments')}
          >
            <Download size={20} />
            Export
          </button>
        </div>

        {/* Payment List */}
        <div className="space-y-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onViewDetails={(id) => console.log('View payment details:', id)}
                onDownloadReceipt={(id) => console.log('Download receipt:', id)}
                onApprovePayment={handleApprovePayment}
                onRejectPayment={handleRejectPayment}
              />
            ))
          ) : (
            <div className="text-center py-12 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#94618e' }}>
              <p className="text-lg" style={{ color: '#94618e', opacity: 0.6 }}>
                No payments found matching your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </EmployerLayout>
  )
}
