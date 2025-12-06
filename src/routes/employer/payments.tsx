import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { EmployerLayout } from '../../layouts/EmployerLayout'
import { Modal, ModalActions, Button, Loading, Skeleton } from '../../components'
import {
  Wallet,
  Clock,
  CheckCircle,
  Filter,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/employer/payments')({
  component: EmployerPayments,
})

// Payment methods
const paymentMethods = [
  { id: 'online_banking', name: 'Online Banking', icon: Building2, color: '#3b82f6' },
  { id: 'ewallet', name: 'E-Wallet', icon: Wallet, color: '#8b5cf6' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: Building2, color: '#10b981' },
]

function EmployerPayments() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTransactionId, setLastTransactionId] = useState<string>('')

  const { user } = useAuth()

  // Fetch real data from Convex
  const paymentsData = useQuery(
    api.payments.listByEmployer,
    user?.id ? { employerId: user.id as Id<"users"> } : "skip"
  )
  const paymentStats = useQuery(
    api.payments.getStatsByEmployer,
    user?.id ? { employerId: user.id as Id<"users"> } : "skip"
  )

  // Payment mutations
  const updatePaymentStatus = useMutation(api.payments.updateStatus)

  // Transform payment data for display
  const payments = paymentsData?.map((payment) => ({
    id: payment._id,
    candidateName: payment.candidate?.name || 'Unknown',
    candidateImage: '',
    jobTitle: payment.job?.title || 'Unknown Job',
    jobLocation: payment.job?.location || 'N/A',
    workPeriod: payment.dateRange,
    totalAmount: payment.amount,
    status: payment.status === 'completed' ? 'paid' : payment.status,
    description: payment.description,
    transactionId: payment.transactionId,
    paidDate: payment.status === 'completed'
      ? new Date(payment.createdAt).toLocaleDateString('en-GB')
      : undefined,
  })) || []

  const filteredPayments = payments.filter(payment => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'pending') return payment.status === 'pending' || payment.status === 'ongoing'
    if (statusFilter === 'paid') return payment.status === 'paid'
    return true
  })

  // Calculate stats from real data
  const stats = {
    totalPending: paymentStats?.pending || 0,
    totalPaid: paymentStats?.completed || 0,
    pendingAmount: payments
      .filter(p => p.status === 'pending' || p.status === 'ongoing')
      .reduce((sum, p) => sum + p.totalAmount, 0),
    paidAmount: payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.totalAmount, 0),
  }

  const handlePayClick = (payment: typeof payments[0]) => {
    setSelectedPayment(payment)
    setShowPaymentModal(true)
  }

  const handleProceedToConfirm = () => {
    if (selectedPaymentMethod) {
      setShowPaymentModal(false)
      setShowConfirmModal(true)
    }
  }

  const handleConfirmPayment = async () => {
    if (!selectedPayment) return

    setIsProcessing(true)
    try {
      const transactionId = `TXN-${Date.now()}`
      await updatePaymentStatus({
        id: selectedPayment.id as Id<"payments">,
        status: 'completed',
        transactionId,
      })
      setLastTransactionId(transactionId)
      setShowConfirmModal(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetModals = () => {
    setShowPaymentModal(false)
    setShowConfirmModal(false)
    setShowSuccessModal(false)
    setSelectedPayment(null)
    setSelectedPaymentMethod(null)
  }

  // Loading state
  if (paymentsData === undefined || paymentStats === undefined) {
    return (
      <EmployerLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-8" style={{ color: '#94618e' }}>
            Payment Management
          </h1>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="card" className="h-32" />
            ))}
          </div>

          {/* Payment Cards Skeleton */}
          <div className="space-y-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" className="h-40" />
            ))}
          </div>

          {/* Loading Indicator */}
          <Loading size="lg" text="Loading payment management..." />
        </div>
      </EmployerLayout>
    )
  }

  return (
    <EmployerLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
            Payment Management
          </h1>
          <p className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
            Pay your workers and track payment history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="p-6 rounded-xl border-2 shadow-lg"
            style={{ backgroundColor: '#fff7ed', borderColor: '#fb923c' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#fed7aa' }}>
                <Clock size={20} style={{ color: '#ea580c' }} />
              </div>
              <h3 className="text-sm font-bold" style={{ color: '#ea580c' }}>
                Pending Payments
              </h3>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#ea580c' }}>
              {stats.totalPending}
            </p>
          </div>

          <div
            className="p-6 rounded-xl border-2 shadow-lg"
            style={{ backgroundColor: '#ecfdf5', borderColor: '#10b981' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#a7f3d0' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
              </div>
              <h3 className="text-sm font-bold" style={{ color: '#059669' }}>
                Completed
              </h3>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#059669' }}>
              {stats.totalPaid}
            </p>
          </div>

          <div
            className="p-6 rounded-xl border-2 shadow-lg"
            style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#fde68a' }}>
                <DollarSign size={20} style={{ color: '#d97706' }} />
              </div>
              <h3 className="text-sm font-bold" style={{ color: '#d97706' }}>
                Amount Due
              </h3>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#d97706' }}>
              RM {stats.pendingAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div
            className="p-6 rounded-xl border-2 shadow-lg"
            style={{ backgroundColor: '#f8eee7', borderColor: '#94618e' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#94618e20' }}>
                <Wallet size={20} style={{ color: '#94618e' }} />
              </div>
              <h3 className="text-sm font-bold" style={{ color: '#94618e' }}>
                Total Paid
              </h3>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#94618e' }}>
              RM {stats.paidAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: '#94618e' }}>
            Applicants to Pay
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
              <option value="all">All Status</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: payment.status === 'pending' || payment.status === 'ongoing' ? '#fb923c' : '#10b981',
                }}
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left: Candidate Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#94618e' }}
                    >
                      <span className="text-2xl font-bold" style={{ color: '#f8eee7' }}>
                        {payment.candidateName.charAt(0)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold mb-1" style={{ color: '#94618e' }}>
                            {payment.candidateName}
                          </h3>
                          <div className="flex items-center gap-4 flex-wrap text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
                            <span className="flex items-center gap-1">
                              <Briefcase size={14} />
                              {payment.jobTitle}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {payment.jobLocation}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {payment.workPeriod}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className="px-4 py-1.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: payment.status === 'pending' || payment.status === 'ongoing' ? '#fed7aa' : '#a7f3d0',
                            color: payment.status === 'pending' || payment.status === 'ongoing' ? '#ea580c' : '#059669',
                          }}
                        >
                          {payment.status === 'pending' || payment.status === 'ongoing' ? 'Pending Payment' : 'Paid'}
                        </span>
                      </div>

                      <p className="text-sm mb-3" style={{ color: '#94618e', opacity: 0.6 }}>
                        {payment.description}
                      </p>

                      {/* Transaction ID if paid */}
                      {payment.status === 'paid' && payment.transactionId && (
                        <div className="mt-2 text-xs" style={{ color: '#94618e', opacity: 0.5 }}>
                          Transaction ID: {payment.transactionId} • Paid on {payment.paidDate}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Action */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm mb-1" style={{ color: '#94618e', opacity: 0.6 }}>
                        Total Amount
                      </p>
                      <p className="text-3xl font-bold" style={{ color: '#94618e' }}>
                        RM {payment.totalAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {payment.status === 'pending' || payment.status === 'ongoing' ? (
                      <button
                        onClick={() => handlePayClick(payment)}
                        className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 flex items-center gap-2"
                        style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
                      >
                        Pay Now
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div
                        className="px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
                        style={{ backgroundColor: '#a7f3d0', color: '#059669' }}
                      >
                        <CheckCircle size={16} />
                        Paid
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 rounded-2xl border-2" style={{ backgroundColor: '#f8eee7', borderColor: '#94618e' }}>
              <p className="text-lg" style={{ color: '#94618e', opacity: 0.6 }}>
                No payments found matching your filter
              </p>
            </div>
          )}
        </div>

        {/* Payment Method Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={resetModals}
          variant="default"
          title="Select Payment Method"
          showIcon={false}
        >
          {selectedPayment && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div
                className="p-6 rounded-xl border-2"
                style={{ backgroundColor: '#f8eee7', borderColor: '#94618e' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#94618e', opacity: 0.6 }}>
                      Paying to
                    </p>
                    <h3 className="text-xl font-bold" style={{ color: '#94618e' }}>
                      {selectedPayment.candidateName}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: '#94618e', opacity: 0.7 }}>
                      {selectedPayment.jobTitle} • {selectedPayment.workPeriod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm mb-1" style={{ color: '#94618e', opacity: 0.6 }}>
                      Amount
                    </p>
                    <p className="text-3xl font-bold" style={{ color: '#94618e' }}>
                      RM {selectedPayment.totalAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: '#94618e' }}>
                  Choose Payment Method
                </label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className="w-full p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md"
                        style={{
                          backgroundColor: selectedPaymentMethod === method.id ? '#f8eee7' : '#ffffff',
                          borderColor: selectedPaymentMethod === method.id ? method.color : '#e5e7eb',
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${method.color}20` }}
                          >
                            <Icon size={24} style={{ color: method.color }} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-bold text-base" style={{ color: '#94618e' }}>
                              {method.name}
                            </p>
                          </div>
                          {selectedPaymentMethod === method.id && (
                            <CheckCircle size={20} style={{ color: method.color }} />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <ModalActions align="center">
                <Button variant="outline" onClick={resetModals}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleProceedToConfirm}
                  disabled={!selectedPaymentMethod}
                >
                  Proceed to Payment
                </Button>
              </ModalActions>
            </div>
          )}
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={resetModals}
          variant="default"
          title="Confirm Payment"
          showIcon={true}
        >
          {selectedPayment && selectedPaymentMethod && (
            <div className="space-y-6">
              <p className="text-base" style={{ color: '#94618e' }}>
                You are about to pay <span className="font-bold">{selectedPayment.candidateName}</span> for their work as <span className="font-bold">{selectedPayment.jobTitle}</span>.
              </p>

              {/* Payment Details */}
              <div
                className="p-6 rounded-xl space-y-3"
                style={{ backgroundColor: '#f8eee7', border: '2px solid #94618e' }}
              >
                <div className="flex justify-between items-center">
                  <span style={{ color: '#94618e', opacity: 0.7 }}>Recipient:</span>
                  <span className="font-bold" style={{ color: '#94618e' }}>
                    {selectedPayment.candidateName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#94618e', opacity: 0.7 }}>Work Period:</span>
                  <span className="font-bold" style={{ color: '#94618e' }}>
                    {selectedPayment.workPeriod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#94618e', opacity: 0.7 }}>Payment Method:</span>
                  <span className="font-bold" style={{ color: '#94618e' }}>
                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                  </span>
                </div>
                <div className="h-px" style={{ backgroundColor: '#94618e', opacity: 0.2 }} />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold" style={{ color: '#94618e' }}>
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold" style={{ color: '#94618e' }}>
                    RM {selectedPayment.totalAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <p className="text-sm text-center" style={{ color: '#94618e', opacity: 0.6 }}>
                This payment cannot be reversed. Please verify all details before confirming.
              </p>

              {/* Actions */}
              <ModalActions align="center">
                <Button variant="outline" onClick={resetModals} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                </Button>
              </ModalActions>
            </div>
          )}
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={resetModals}
          variant="success"
          title="Payment Successful!"
          showIcon={true}
        >
          {selectedPayment && (
            <div className="space-y-6">
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#a7f3d0' }}
                >
                  <CheckCircle size={40} style={{ color: '#059669' }} />
                </div>
                <p className="text-lg mb-2" style={{ color: '#94618e' }}>
                  You have successfully paid
                </p>
                <h3 className="text-2xl font-bold mb-1" style={{ color: '#94618e' }}>
                  {selectedPayment.candidateName}
                </h3>
                <p className="text-3xl font-bold" style={{ color: '#059669' }}>
                  RM {selectedPayment.totalAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981' }}
              >
                <p className="text-sm mb-1" style={{ color: '#059669', opacity: 0.7 }}>
                  Transaction ID
                </p>
                <p className="font-mono font-bold" style={{ color: '#059669' }}>
                  {lastTransactionId}
                </p>
              </div>

              <p className="text-sm text-center" style={{ color: '#94618e', opacity: 0.6 }}>
                A receipt has been sent to both you and {selectedPayment.candidateName}
              </p>

              {/* Actions */}
              <ModalActions align="center">
                <Button variant="primary" onClick={resetModals}>
                  Done
                </Button>
              </ModalActions>
            </div>
          )}
        </Modal>
      </div>
    </EmployerLayout>
  )
}
