import { Calendar, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { Download, Eye, X, User, Calendar, CreditCard, FileText, DollarSign, Clock } from 'lucide-react'

type PaymentStatus = 'completed' | 'pending' | 'cancelled'

interface JobData {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  image: string
}

interface PaymentData {
  id: string
  amount: number
  currency?: string
  status: PaymentStatus
  date: string
  description?: string
  paymentMethod?: string
  transactionId?: string
  recipient?: string
  job?: JobData
}

interface PaymentCardProps {
  payment: PaymentData
  onViewDetails?: (id: string) => void
  onDownloadReceipt?: (id: string) => void
  onApprovePayment?: (id: string) => void
  onRejectPayment?: (id: string) => void
  className?: string
}

const getStatusStyles = (status: PaymentStatus) => {
  const statusStyles = {
    completed: {
      backgroundColor: '#d1fae5',
      borderColor: '#10b981',
      textColor: '#059669',
      text: 'Completed',
    },
    pending: {
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b',
      textColor: '#d97706',
      text: 'Pending',
    },
    cancelled: {
      backgroundColor: '#fee2e2',
      borderColor: '#ef4444',
      textColor: '#dc2626',
      text: 'Cancelled',
    },
  }
  return statusStyles[status]
}

export const PaymentCard = ({
  payment,
  className = '',
}: PaymentCardProps) => {
  onViewDetails,
  onDownloadReceipt,
  onApprovePayment,
  onRejectPayment,
  className = '',
}: PaymentCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isDownloadHovered, setIsDownloadHovered] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const statusStyle = getStatusStyles(payment.status)

  const formatCurrency = (amount: number, currency: string = 'RM') => {
    return `${currency} ${new Intl.NumberFormat('ms-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`
  }

  const handleViewDetails = () => {
    setShowDetailsModal(true)
    onViewDetails?.(payment.id)
  }

  return (
    <div
      className={`rounded-2xl transition-all duration-200 border-2 shadow-md hover:shadow-lg overflow-hidden ${className}`}
      style={{
        backgroundColor: '#5a3851',
        borderColor: '#94618e',
      }}
    >
      {/* Header Section with Status and Date */}
      <div className="px-6 py-3 flex items-center justify-between border-b-2" style={{ borderBottomColor: '#94618e', backgroundColor: 'rgba(148, 97, 142, 0.1)' }}>
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span
            className="px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide shadow-sm"
            style={{
              backgroundColor: statusStyle.backgroundColor,
              color: statusStyle.color,
            }}
          >
            {statusStyle.text}
          </span>
          {/* Date */}
          <span
            className="font-semibold text-sm whitespace-nowrap"
            style={{ color: '#f8eee7', opacity: 0.9 }}
          >
            {payment.date}
          </span>
        </div>
        {payment.transactionId && (
          <p
            className="text-xs font-mono"
            style={{ color: '#f8eee7', opacity: 0.6 }}
          >
            {payment.transactionId}
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Left Section - Amount & Recipient */}
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-2xl mb-1"
              style={{ color: '#f8eee7' }}
            >
              {formatCurrency(payment.amount, payment.currency)}
            </h3>
            {payment.recipient && (
              <p
                className="text-sm font-medium truncate"
                style={{ color: '#f8eee7', opacity: 0.8 }}
              >
                {payment.recipient}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {payment.description && (
          <p
            className="text-sm mb-4"
            style={{ color: '#f8eee7', opacity: 0.9 }}
          >
            {payment.description}
          </p>
        )}

        {/* Payment Method */}
        {payment.paymentMethod && (
          <p
            className="text-xs mb-4"
            style={{ color: '#f8eee7', opacity: 0.7 }}
          >
            Payment Method: {payment.paymentMethod}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleViewDetails}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex-1 px-4 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              backgroundColor: isHovered ? '#f8eee7' : 'rgba(248, 238, 231, 0.1)',
              color: isHovered ? '#94618e' : '#f8eee7',
              border: '2px solid rgba(248, 238, 231, 0.3)',
            }}
          >
            <Eye size={16} />
            VIEW DETAILS
          </button>
          {onDownloadReceipt && payment.status === 'completed' && (
            <button
              onClick={() => onDownloadReceipt(payment.id)}
              onMouseEnter={() => setIsDownloadHovered(true)}
              onMouseLeave={() => setIsDownloadHovered(false)}
              className="flex-1 px-4 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: isDownloadHovered ? '#f8eee7' : 'rgba(248, 238, 231, 0.1)',
                color: isDownloadHovered ? '#94618e' : '#f8eee7',
                border: '2px solid rgba(248, 238, 231, 0.3)',
              }}
            >
              <Download size={16} />
              RECEIPT
            </button>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowDetailsModal(false)}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(148, 97, 142, 0.4)' }}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="relative rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#f8eee7' }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b-2 flex items-center justify-between" style={{ borderBottomColor: '#94618e' }}>
              <h2 className="text-xl font-bold" style={{ color: '#94618e' }}>
                PAYMENT DETAILS
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 rounded-full hover:bg-opacity-10 transition-all"
                style={{ color: '#94618e' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Job Details Section */}
              {payment.job && (
                <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: '#94618e' }}>
                  {/* Job Image */}
                  <div className="relative w-full h-32 overflow-hidden">
                    <img
                      src={payment.job.image}
                      alt={payment.job.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(90,56,81,0.9) 100%)',
                      }}
                    />
                    <div className="absolute bottom-2 left-4 right-4">
                      <h4 className="text-base font-bold text-white">
                        {payment.job.title}
                      </h4>
                    </div>
                  </div>
                  {/* Job Info */}
                  <div className="p-4" style={{ backgroundColor: '#5a3851' }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#f8eee7' }}>
                      {payment.job.company}
                    </p>
                    <p className="text-xs mb-2" style={{ color: '#f8eee7', opacity: 0.8 }}>
                      {payment.job.location} • {payment.job.type}
                    </p>
                    <p className="text-xs" style={{ color: '#f8eee7', opacity: 0.9 }}>
                      {payment.job.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#5a3851' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}>
                  <DollarSign size={24} style={{ color: '#f8eee7' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#f8eee7', opacity: 0.7 }}>
                    AMOUNT
                  </p>
                  <p className="text-lg font-bold" style={{ color: '#f8eee7' }}>
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                </div>
              </div>

              {/* Recipient */}
              {payment.recipient && (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(148, 97, 142, 0.1)' }}>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(148, 97, 142, 0.2)' }}>
                    <User size={24} style={{ color: '#94618e' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#94618e', opacity: 0.7 }}>
                      RECIPIENT
                    </p>
                    <p className="text-base font-bold" style={{ color: '#94618e' }}>
                      {payment.recipient}
                    </p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(148, 97, 142, 0.1)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(148, 97, 142, 0.2)' }}>
                  <FileText size={24} style={{ color: '#94618e' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: '#94618e', opacity: 0.7 }}>
                    STATUS
                  </p>
                  <span
                    className="px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide"
                    style={{
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color,
                    }}
                  >
                    {statusStyle.text}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(148, 97, 142, 0.1)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(148, 97, 142, 0.2)' }}>
                  <Calendar size={24} style={{ color: '#94618e' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#94618e', opacity: 0.7 }}>
                    DATE
                  </p>
                  <p className="text-base font-bold" style={{ color: '#94618e' }}>
                    {payment.date}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              {payment.paymentMethod && (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(148, 97, 142, 0.1)' }}>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(148, 97, 142, 0.2)' }}>
                    <CreditCard size={24} style={{ color: '#94618e' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#94618e', opacity: 0.7 }}>
                      PAYMENT METHOD
                    </p>
                    <p className="text-base font-bold" style={{ color: '#94618e' }}>
                      {payment.paymentMethod}
                    </p>
                  </div>
                </div>
              )}

              {/* Transaction ID */}
              {payment.transactionId && (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(148, 97, 142, 0.1)' }}>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(148, 97, 142, 0.2)' }}>
                    <FileText size={24} style={{ color: '#94618e' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#94618e', opacity: 0.7 }}>
                      TRANSACTION ID
                    </p>
                    <p className="text-sm font-mono font-bold" style={{ color: '#94618e' }}>
                      {payment.transactionId}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              {payment.description && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(148, 97, 142, 0.1)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#94618e', opacity: 0.7 }}>
                    DESCRIPTION
                  </p>
                  <p className="text-sm" style={{ color: '#94618e' }}>
                    {payment.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t-2" style={{ borderTopColor: '#94618e' }}>
              {payment.status === 'pending' ? (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onApprovePayment?.(payment.id)
                        setShowDetailsModal(false)
                      }}
                      className="flex-1 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
                    >
                      APPROVE PAYMENT
                    </button>
                    <button
                      onClick={() => {
                        onRejectPayment?.(payment.id)
                        setShowDetailsModal(false)
                      }}
                      className="flex-1 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                    >
                      REJECT
                    </button>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="w-full px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200"
                    style={{ backgroundColor: 'transparent', color: '#94618e', border: '2px solid #94618e' }}
                  >
                    CLOSE
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
                >
                  CLOSE
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
