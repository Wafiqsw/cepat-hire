import { createFileRoute } from '@tanstack/react-router'
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
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/employer/payments')({
  component: EmployerPayments,
})

// Mock data for applicants to pay
const mockApplicantsToPay = [
  {
    id: '1',
    candidateName: 'Ahmad Razak',
    candidateImage: '',
    jobTitle: 'Waiter',
    jobLocation: 'Kuala Lumpur',
    workPeriod: '15 Nov - 20 Nov 2024',
    hoursWorked: 40,
    hourlyRate: 15,
    totalAmount: 600,
    status: 'pending' as const,
    applicationDate: '12 Nov 2024',
    completionDate: '20 Nov 2024',
    description: '5 days waiter service at Cafe Delight during peak hours',
  },
  {
    id: '2',
    candidateName: 'Siti Aminah',
    candidateImage: '',
    jobTitle: 'Graphic Designer',
    jobLocation: 'Petaling Jaya',
    workPeriod: '1 Nov - 15 Nov 2024',
    hoursWorked: 80,
    hourlyRate: 25,
    totalAmount: 2000,
    status: 'pending' as const,
    applicationDate: '28 Oct 2024',
    completionDate: '15 Nov 2024',
    description: 'Logo redesign and brand identity package for startup company',
  },
  {
    id: '3',
    candidateName: 'Kumar Selvam',
    candidateImage: '',
    jobTitle: 'Delivery Rider',
    jobLocation: 'Shah Alam',
    workPeriod: '10 Nov - 17 Nov 2024',
    hoursWorked: 56,
    hourlyRate: 12,
    totalAmount: 672,
    status: 'pending' as const,
    applicationDate: '5 Nov 2024',
    completionDate: '17 Nov 2024',
    description: '1 week food delivery service covering Shah Alam area',
  },
  {
    id: '4',
    candidateName: 'Lisa Tan',
    candidateImage: '',
    jobTitle: 'Content Writer',
    jobLocation: 'Remote',
    workPeriod: '1 Nov - 30 Nov 2024',
    hoursWorked: 120,
    hourlyRate: 30,
    totalAmount: 3600,
    status: 'paid' as const,
    applicationDate: '25 Oct 2024',
    completionDate: '30 Nov 2024',
    paidDate: '1 Dec 2024',
    transactionId: 'TXN-20241201-001',
    description: 'Monthly content creation for blog and social media',
  },
  {
    id: '5',
    candidateName: 'Muhammad Ismail',
    candidateImage: '',
    jobTitle: 'Event Helper',
    jobLocation: 'Kuala Lumpur',
    workPeriod: '18 Nov 2024',
    hoursWorked: 8,
    hourlyRate: 18,
    totalAmount: 144,
    status: 'paid' as const,
    applicationDate: '10 Nov 2024',
    completionDate: '18 Nov 2024',
    paidDate: '19 Nov 2024',
    transactionId: 'TXN-20241119-002',
    description: 'Setup and teardown assistance for corporate event',
  },
  {
    id: '6',
    candidateName: 'Priya Menon',
    candidateImage: '',
    jobTitle: 'Data Entry Clerk',
    jobLocation: 'Cyberjaya',
    workPeriod: '5 Nov - 12 Nov 2024',
    hoursWorked: 48,
    hourlyRate: 14,
    totalAmount: 672,
    status: 'paid' as const,
    applicationDate: '1 Nov 2024',
    completionDate: '12 Nov 2024',
    paidDate: '13 Nov 2024',
    transactionId: 'TXN-20241113-003',
    description: 'Database entry and verification for inventory system',
  },
]

// Payment methods
const paymentMethods = [
  { id: 'online_banking', name: 'Online Banking', icon: Building2, color: '#3b82f6' },
  { id: 'ewallet', name: 'E-Wallet', icon: Wallet, color: '#8b5cf6' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: Building2, color: '#10b981' },
]

function EmployerPayments() {
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<typeof mockApplicantsToPay[0] | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const filteredApplicants = mockApplicantsToPay.filter(applicant => {
    return statusFilter === 'all' || applicant.status === statusFilter
  })

  // Calculate stats
  const stats = {
    totalPending: mockApplicantsToPay.filter(a => a.status === 'pending').length,
    totalPaid: mockApplicantsToPay.filter(a => a.status === 'paid').length,
    pendingAmount: mockApplicantsToPay
      .filter(a => a.status === 'pending')
      .reduce((sum, a) => sum + a.totalAmount, 0),
    paidAmount: mockApplicantsToPay
      .filter(a => a.status === 'paid')
      .reduce((sum, a) => sum + a.totalAmount, 0),
  }

  const handlePayClick = (applicant: typeof mockApplicantsToPay[0]) => {
    setSelectedApplicant(applicant)
    setShowPaymentModal(true)
  }

  const handleProceedToConfirm = () => {
    if (selectedPaymentMethod) {
      setShowPaymentModal(false)
      setShowConfirmModal(true)
    }
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update mock data (in real app, this would be API call)
    if (selectedApplicant) {
      const applicant = mockApplicantsToPay.find(a => a.id === selectedApplicant.id)
      if (applicant) {
        applicant.status = 'paid'
        applicant.paidDate = new Date().toLocaleDateString('en-GB')
        applicant.transactionId = `TXN-${Date.now()}`
      }
    }

    setIsProcessing(false)
    setShowConfirmModal(false)
    setShowSuccessModal(true)
  }

  const resetModals = () => {
    setShowPaymentModal(false)
    setShowConfirmModal(false)
    setShowSuccessModal(false)
    setSelectedApplicant(null)
    setSelectedPaymentMethod(null)
  }

  if (isLoading) {
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

          {/* Applicant Cards Skeleton */}
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

        {/* Applicants List */}
        <div className="space-y-4">
          {filteredApplicants.length > 0 ? (
            filteredApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: applicant.status === 'pending' ? '#fb923c' : '#10b981',
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
                        {applicant.candidateName.charAt(0)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold mb-1" style={{ color: '#94618e' }}>
                            {applicant.candidateName}
                          </h3>
                          <div className="flex items-center gap-4 flex-wrap text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
                            <span className="flex items-center gap-1">
                              <Briefcase size={14} />
                              {applicant.jobTitle}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {applicant.jobLocation}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {applicant.workPeriod}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className="px-4 py-1.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: applicant.status === 'pending' ? '#fed7aa' : '#a7f3d0',
                            color: applicant.status === 'pending' ? '#ea580c' : '#059669',
                          }}
                        >
                          {applicant.status === 'pending' ? 'Pending Payment' : 'Paid'}
                        </span>
                      </div>

                      <p className="text-sm mb-3" style={{ color: '#94618e', opacity: 0.6 }}>
                        {applicant.description}
                      </p>

                      {/* Work Details */}
                      <div className="flex items-center gap-6 text-sm" style={{ color: '#94618e' }}>
                        <div>
                          <span className="opacity-60">Hours Worked:</span>
                          <span className="font-bold ml-1">{applicant.hoursWorked}h</span>
                        </div>
                        <div>
                          <span className="opacity-60">Hourly Rate:</span>
                          <span className="font-bold ml-1">RM {applicant.hourlyRate}/h</span>
                        </div>
                        <div>
                          <span className="opacity-60">Completed:</span>
                          <span className="font-bold ml-1">{applicant.completionDate}</span>
                        </div>
                      </div>

                      {/* Transaction ID if paid */}
                      {applicant.status === 'paid' && applicant.transactionId && (
                        <div className="mt-2 text-xs" style={{ color: '#94618e', opacity: 0.5 }}>
                          Transaction ID: {applicant.transactionId} • Paid on {applicant.paidDate}
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
                        RM {applicant.totalAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {applicant.status === 'pending' ? (
                      <button
                        onClick={() => handlePayClick(applicant)}
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
                No applicants found matching your filter
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
          {selectedApplicant && (
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
                      {selectedApplicant.candidateName}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: '#94618e', opacity: 0.7 }}>
                      {selectedApplicant.jobTitle} • {selectedApplicant.workPeriod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm mb-1" style={{ color: '#94618e', opacity: 0.6 }}>
                      Amount
                    </p>
                    <p className="text-3xl font-bold" style={{ color: '#94618e' }}>
                      RM {selectedApplicant.totalAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
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
          {selectedApplicant && selectedPaymentMethod && (
            <div className="space-y-6">
              <p className="text-base" style={{ color: '#94618e' }}>
                You are about to pay <span className="font-bold">{selectedApplicant.candidateName}</span> for their work as <span className="font-bold">{selectedApplicant.jobTitle}</span>.
              </p>

              {/* Payment Details */}
              <div
                className="p-6 rounded-xl space-y-3"
                style={{ backgroundColor: '#f8eee7', border: '2px solid #94618e' }}
              >
                <div className="flex justify-between items-center">
                  <span style={{ color: '#94618e', opacity: 0.7 }}>Recipient:</span>
                  <span className="font-bold" style={{ color: '#94618e' }}>
                    {selectedApplicant.candidateName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#94618e', opacity: 0.7 }}>Work Period:</span>
                  <span className="font-bold" style={{ color: '#94618e' }}>
                    {selectedApplicant.workPeriod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#94618e', opacity: 0.7 }}>Hours Worked:</span>
                  <span className="font-bold" style={{ color: '#94618e' }}>
                    {selectedApplicant.hoursWorked} hours
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
                    RM {selectedApplicant.totalAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
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
          {selectedApplicant && (
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
                  {selectedApplicant.candidateName}
                </h3>
                <p className="text-3xl font-bold" style={{ color: '#059669' }}>
                  RM {selectedApplicant.totalAmount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
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
                  TXN-{Date.now()}
                </p>
              </div>

              <p className="text-sm text-center" style={{ color: '#94618e', opacity: 0.6 }}>
                A receipt has been sent to both you and {selectedApplicant.candidateName}
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
