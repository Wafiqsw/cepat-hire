import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { useAuth } from '../../contexts/AuthContext'
import { PaymentCard, Modal, ModalActions, Button } from '../../components'
import { Wallet, Clock, CheckCircle, AlertCircle, Filter, Building2 } from 'lucide-react'
import { useState } from 'react'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/seeker/payments')({
  component: SeekerPayments,
})

function SeekerPayments() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [accountNumber, setAccountNumber] = useState('')
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { user } = useAuth()

  // Get candidate profile linked to authenticated user
  const candidate = useQuery(api.seeker.getCandidateByUserId,
    user?.id ? { userId: user.id as Id<"users"> } : "skip"
  )
  const candidateId = candidate?._id

  // Withdrawal mutation
  const requestWithdrawal = useMutation(api.seeker.requestWithdrawal)

  // Fetch payments and stats from backend
  const paymentsData = useQuery(api.seeker.getMyPayments,
    candidateId ? { candidateId } : "skip"
  )
  const paymentStats = useQuery(api.seeker.getMyPaymentStats,
    candidateId ? { candidateId } : "skip"
  )

  // Malaysian banks
  const malaysianBanks = [
    { id: 'maybank', name: 'Maybank', color: '#FFD700' },
    { id: 'cimb', name: 'CIMB Bank', color: '#DC143C' },
    { id: 'public', name: 'Public Bank', color: '#E31837' },
    { id: 'rhb', name: 'RHB Bank', color: '#003DA5' },
    { id: 'hongleong', name: 'Hong Leong Bank', color: '#0066B3' },
    { id: 'ambank', name: 'AmBank', color: '#ED1C24' },
  ]

  // Transform payment data for display
  const payments = paymentsData?.map((payment) => ({
    id: payment._id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status as 'completed' | 'pending',
    date: new Date(payment.createdAt).toLocaleDateString('en-GB'),
    description: payment.description,
    paymentMethod: payment.paymentMethod,
    transactionId: payment.transactionId,
  })) || []

  const filteredPayments = payments.filter(payment => {
    return statusFilter === 'all' || payment.status === statusFilter
  })

  // Use stats from backend
  const totalBalance = paymentStats?.totalEarnings || 0
  const pendingEarnings = paymentStats?.pendingEarnings || 0
  const availableToWithdraw = paymentStats?.availableToWithdraw || 0

  // Loading state - check candidate profile first
  if (candidate === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
              Loading...
            </div>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  // Candidate profile doesn't exist
  if (candidate === null) {
    return (
      <SeekerLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
              Profile Not Found
            </h2>
            <p className="text-lg mb-6" style={{ color: '#94618e', opacity: 0.7 }}>
              Please create your profile to view your wallet.
            </p>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  // Now candidateId is guaranteed to exist
  if (paymentsData === undefined || paymentStats === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
              Loading...
            </div>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  return (
    <SeekerLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
            My Wallet
          </h1>
          <p className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
            Track your earnings and manage withdrawals
          </p>
        </div>

        {/* Wallet Cards - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance */}
          <div
            className="p-6 rounded-2xl shadow-lg border-2"
            style={{
              background: 'linear-gradient(135deg, #94618e 0%, #7a4f73 100%)',
              borderColor: '#7a4f73'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: 'rgba(248, 238, 231, 0.2)' }}
              >
                <Wallet size={24} style={{ color: '#f8eee7' }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: '#f8eee7' }}>
                Total Balance
              </h3>
            </div>
            <p className="text-4xl font-bold mb-2" style={{ color: '#f8eee7' }}>
              RM {totalBalance.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm" style={{ color: '#f8eee7', opacity: 0.8 }}>
              All earnings combined
            </p>
          </div>

          {/* Pending/Waiting */}
          <div
            className="p-6 rounded-2xl shadow-lg border-2"
            style={{
              backgroundColor: '#fff7ed',
              borderColor: '#fb923c'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: '#fed7aa' }}
              >
                <Clock size={24} style={{ color: '#ea580c' }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: '#ea580c' }}>
                Pending
              </h3>
            </div>
            <p className="text-4xl font-bold mb-2" style={{ color: '#ea580c' }}>
              RM {pendingEarnings.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
            </p>
            <div
              className="flex items-start gap-2 p-3 rounded-lg mt-3"
              style={{ backgroundColor: '#ffedd5' }}
            >
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#ea580c' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#ea580c' }}>
                Early withdrawal incurs 5% charge. Wait for completion to avoid fees.
              </p>
            </div>
          </div>

          {/* Available to Withdraw */}
          <div
            className="p-6 rounded-2xl shadow-lg border-2"
            style={{
              backgroundColor: '#ecfdf5',
              borderColor: '#10b981'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: '#a7f3d0' }}
              >
                <CheckCircle size={24} style={{ color: '#059669' }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: '#059669' }}>
                Available
              </h3>
            </div>
            <p className="text-4xl font-bold mb-2" style={{ color: '#059669' }}>
              RM {availableToWithdraw.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
            </p>
            <button
              className="w-full mt-3 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: '#059669',
                color: '#ffffff'
              }}
              onClick={() => setShowWithdrawModal(true)}
            >
              Withdraw Now
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: '#94618e' }}>
            Transaction History
          </h2>

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
              <option value="all">All Transactions</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Payment List */}
        <div className="space-y-3">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
              />
            ))
          ) : (
            <div className="text-center py-12 rounded-2xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#94618e' }}>
              <p className="text-lg" style={{ color: '#94618e', opacity: 0.6 }}>
                No transactions found
              </p>
            </div>
          )}
        </div>

        {/* Withdrawal Modal */}
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => {
            setShowWithdrawModal(false)
            setSelectedBank(null)
            setAccountNumber('')
          }}
          variant="default"
          title="Withdraw Funds"
          showIcon={false}
        >
          <div className="space-y-6">
            {/* Amount to Withdraw */}
            <div
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: '#ecfdf5', borderWidth: '2px', borderColor: '#10b981', borderStyle: 'solid' }}
            >
              <p className="text-sm mb-2" style={{ color: '#059669', opacity: 0.8 }}>
                Amount to Withdraw
              </p>
              <h3 className="text-3xl font-bold" style={{ color: '#059669' }}>
                RM {availableToWithdraw.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
              </h3>
            </div>

            {/* Select Bank */}
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: '#94618e' }}>
                Select Bank
              </label>
              <div className="grid grid-cols-2 gap-3">
                {malaysianBanks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className="p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor: selectedBank === bank.id ? '#f8eee7' : '#ffffff',
                      borderColor: selectedBank === bank.id ? '#94618e' : '#e5e7eb',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: bank.color }}
                      >
                        <Building2 size={20} style={{ color: '#ffffff' }} />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: '#94618e' }}>
                          {bank.name}
                        </p>
                      </div>
                      {selectedBank === bank.id && (
                        <CheckCircle size={20} style={{ color: '#94618e' }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Number Input */}
            {selectedBank && (
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#94618e' }}>
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter your account number"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#f8eee7',
                    borderColor: '#94618e',
                    color: '#94618e',
                  }}
                  maxLength={16}
                />
                <p className="text-xs mt-2" style={{ color: '#94618e', opacity: 0.6 }}>
                  Please ensure your account number is correct
                </p>
              </div>
            )}

            {/* Actions */}
            <ModalActions align="center">
              <Button
                variant="outline"
                onClick={() => {
                  setShowWithdrawModal(false)
                  setSelectedBank(null)
                  setAccountNumber('')
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  if (selectedBank && accountNumber.length >= 10 && candidateId && availableToWithdraw > 0) {
                    setIsWithdrawing(true)
                    try {
                      await requestWithdrawal({
                        candidateId,
                        amount: availableToWithdraw,
                        bankName: selectedBank,
                        accountNumber,
                      })
                      setShowWithdrawModal(false)
                      setSelectedBank(null)
                      setAccountNumber('')
                    } catch (error) {
                      console.error('Withdrawal failed:', error)
                    } finally {
                      setIsWithdrawing(false)
                    }
                  }
                }}
                disabled={!selectedBank || accountNumber.length < 10 || isWithdrawing || !candidateId}
              >
                {isWithdrawing ? 'Processing...' : 'Confirm Withdrawal'}
              </Button>
            </ModalActions>
          </div>
        </Modal>
      </div>
    </SeekerLayout >
  )
}
