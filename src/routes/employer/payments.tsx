import { createFileRoute } from '@tanstack/react-router'
import { EmployerLayout } from '../../layouts/EmployerLayout'
import { PaymentCard } from '../../components'
import { Filter, Download, Search } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/employer/payments')({
  component: EmployerPayments,
})

function EmployerPayments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Sample payment data - job completion payments
  const payments = [
    {
      id: '1',
      amount: 450.00,
      currency: 'RM',
      status: 'completed' as const,
      date: 'Dec 3, 2024',
      description: 'Part-Time Barista - 3 weeks completed',
      jobTitle: 'Part-Time Barista',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-2024-001234',
      recipient: 'Ahmad Abdullah',
      hoursWorked: 90,
      ratePerHour: 'RM 10/hour',
    },
    {
      id: '2',
      amount: 320.00,
      currency: 'RM',
      status: 'pending' as const,
      date: 'Dec 5, 2024',
      description: 'Retail Sales Assistant - 2 weeks completed',
      jobTitle: 'Retail Sales Assistant',
      paymentMethod: 'Online Banking',
      transactionId: 'TXN-2024-001235',
      recipient: 'Siti Nurhaliza',
      hoursWorked: 40,
      ratePerHour: 'RM 8/hour',
    },
    {
      id: '3',
      amount: 540.00,
      currency: 'RM',
      status: 'completed' as const,
      date: 'Dec 2, 2024',
      description: 'Food Delivery Rider - 1 week completed',
      jobTitle: 'Food Delivery Rider',
      paymentMethod: 'E-Wallet',
      transactionId: 'TXN-2024-001220',
      recipient: 'Lee Wei Ming',
      hoursWorked: 36,
      ratePerHour: 'RM 15/hour',
    },
    {
      id: '4',
      amount: 800.00,
      currency: 'RM',
      status: 'completed' as const,
      date: 'Nov 28, 2024',
      description: 'Tutor - Mathematics - 20 hours completed',
      jobTitle: 'Tutor - Mathematics',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-2024-001180',
      recipient: 'Nurul Aisyah',
      hoursWorked: 20,
      ratePerHour: 'RM 40/hour',
    },
    {
      id: '5',
      amount: 600.00,
      currency: 'RM',
      status: 'pending' as const,
      date: 'Dec 6, 2024',
      description: 'Warehouse Packer - 2 weeks completed',
      jobTitle: 'Warehouse Packer',
      paymentMethod: 'Bank Transfer',
      recipient: 'Muhammad Faris',
      hoursWorked: 75,
      ratePerHour: 'RM 8/hour',
    },
    {
      id: '6',
      amount: 375.00,
      currency: 'RM',
      status: 'completed' as const,
      date: 'Nov 25, 2024',
      description: 'Restaurant Server - 1 week completed',
      jobTitle: 'Restaurant Server',
      paymentMethod: 'E-Wallet',
      transactionId: 'TXN-2024-001150',
      recipient: 'Amirah Sofea',
      hoursWorked: 30,
      ratePerHour: 'RM 12.50/hour',
    },
  ]

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    totalPayments: payments.length,
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
              RM {stats.total.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#3b82f6' }}>
            <p className="text-sm mb-2" style={{ color: '#3b82f6', opacity: 0.7 }}>
              Completed
            </p>
            <h3 className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
              {stats.completed}
            </h3>
          </div>
          <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#fbbf24' }}>
            <p className="text-sm mb-2" style={{ color: '#d97706', opacity: 0.9 }}>
              Pending
            </p>
            <h3 className="text-2xl font-bold" style={{ color: '#d97706' }}>
              {stats.pending}
            </h3>
          </div>
          <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#4ade80' }}>
            <p className="text-sm mb-2" style={{ color: '#16a34a', opacity: 0.9 }}>
              Total Payments
            </p>
            <h3 className="text-2xl font-bold" style={{ color: '#16a34a' }}>
              {stats.totalPayments}
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
