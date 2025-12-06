import { createFileRoute } from '@tanstack/react-router'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { PaymentCard, WalletCard } from '../../components'
import { Filter, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/seeker/payments')({
  component: SeekerPayments,
})

function SeekerPayments() {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Sample payment data for job seeker
  const payments = [
    {
      id: '1',
      amount: 5000.00,
      currency: 'RM',
      status: 'completed' as const,
      date: 'Dec 3, 2024',
      description: 'Monthly salary - Frontend Developer',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-2024-001234',
      recipient: 'Your Account',
    },
    {
      id: '2',
      amount: 3500.00,
      currency: 'RM',
      status: 'pending' as const,
      date: 'Dec 5, 2024',
      description: 'Project milestone - UI/UX Design',
      paymentMethod: 'Online Banking',
      transactionId: 'TXN-2024-001235',
      recipient: 'Your Account',
    },
    {
      id: '3',
      amount: 1200.50,
      currency: 'RM',
      status: 'ongoing' as const,
      date: 'Dec 6, 2024',
      description: 'Freelance - Website Redesign',
      paymentMethod: 'E-Wallet',
      recipient: 'Your Account',
    },
    {
      id: '4',
      amount: 4200.00,
      currency: 'RM',
      status: 'completed' as const,
      date: 'Nov 25, 2024',
      description: 'Contract work - Mobile App Development',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-2024-001150',
      recipient: 'Your Account',
    },
    {
      id: '5',
      amount: 2800.00,
      currency: 'RM',
      status: 'completed' as const,
      date: 'Nov 20, 2024',
      description: 'Consulting - Tech Stack Advisory',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-2024-001100',
      recipient: 'Your Account',
    },
  ]

  const filteredPayments = payments.filter(payment => {
    return statusFilter === 'all' || payment.status === statusFilter
  })

  const totalEarnings = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingEarnings = payments
    .filter(p => p.status === 'pending' || p.status === 'ongoing')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <SeekerLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
            My Earnings
          </h1>
          <p className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
            Track your payments and manage your earnings
          </p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <WalletCard
              balance={totalEarnings}
              currency="RM"
              onWithdraw={() => console.log('Withdraw funds')}
            />
          </div>

          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#3b82f6' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} style={{ color: '#3b82f6' }} />
                <p className="text-sm" style={{ color: '#3b82f6', opacity: 0.7 }}>
                  Total Earned
                </p>
              </div>
              <h3 className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
                RM {totalEarnings.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs mt-2" style={{ color: '#3b82f6', opacity: 0.6 }}>
                Lifetime earnings from completed jobs
              </p>
            </div>

            <div className="p-6 rounded-xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#fbbf24' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} style={{ color: '#d97706' }} />
                <p className="text-sm" style={{ color: '#d97706', opacity: 0.9 }}>
                  Pending Amount
                </p>
              </div>
              <h3 className="text-2xl font-bold" style={{ color: '#d97706' }}>
                RM {pendingEarnings.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs mt-2" style={{ color: '#d97706', opacity: 0.7 }}>
                Awaiting payment confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: '#94618e' }}>
            Payment History
          </h2>

          <div className="flex items-center gap-2">
            <Filter size={20} style={{ color: '#94618e' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-full border-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#f8eee7',
                borderColor: '#94618e',
                color: '#94618e',
              }}
            >
              <option value="all">All Payments</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>
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
                No payments found
              </p>
            </div>
          )}
        </div>
      </div>
    </SeekerLayout>
  )
}
