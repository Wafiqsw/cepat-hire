import { useState } from 'react'
import { Download, Eye } from 'lucide-react'

type PaymentStatus = 'ongoing' | 'completed' | 'pending' | 'cancelled'

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
}

interface PaymentCardProps {
  payment: PaymentData
  onViewDetails?: (id: string) => void
  onDownloadReceipt?: (id: string) => void
  className?: string
}

const getStatusStyles = (status: PaymentStatus) => {
  const statusStyles = {
    ongoing: {
      backgroundColor: '#4ade80',
      color: '#ffffff',
      text: 'ONGOING',
    },
    completed: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      text: 'COMPLETED',
    },
    pending: {
      backgroundColor: '#fbbf24',
      color: '#ffffff',
      text: 'PENDING',
    },
    cancelled: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      text: 'CANCELLED',
    },
  }
  return statusStyles[status]
}

export const PaymentCard = ({
  payment,
  onViewDetails,
  onDownloadReceipt,
  className = '',
}: PaymentCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isDownloadHovered, setIsDownloadHovered] = useState(false)
  const statusStyle = getStatusStyles(payment.status)

  const formatCurrency = (amount: number, currency: string = 'RM') => {
    return `${currency} ${new Intl.NumberFormat('ms-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`
  }

  return (
    <div
      className={`flex items-center justify-between gap-4 px-6 py-4 rounded-full transition-all duration-200 border-2 ${className}`}
      style={{
        backgroundColor: '#f8eee7',
        borderColor: '#94618e',
      }}
    >
      {/* Left Section - Amount & Recipient */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-bold text-lg truncate"
          style={{ color: '#94618e' }}
        >
          {formatCurrency(payment.amount, payment.currency)}
        </h3>
        {payment.recipient && (
          <p
            className="text-sm truncate mt-0.5"
            style={{ color: '#94618e', opacity: 0.7 }}
          >
            {payment.recipient}
          </p>
        )}
      </div>

      {/* Middle Section - Description/Payment Method */}
      <div className="flex-1 min-w-0 hidden md:block">
        <p
          className="text-sm truncate"
          style={{ color: '#94618e', opacity: 0.9 }}
        >
          {payment.description || payment.paymentMethod || 'Payment'}
        </p>
        {payment.transactionId && (
          <p
            className="text-xs truncate mt-0.5"
            style={{ color: '#94618e', opacity: 0.5 }}
          >
            {payment.transactionId}
          </p>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <span
          className="px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide"
          style={{
            backgroundColor: statusStyle.backgroundColor,
            color: statusStyle.color,
          }}
        >
          {statusStyle.text}
        </span>
      </div>

      {/* Date */}
      <div className="flex-shrink-0 hidden lg:block">
        <span
          className="font-semibold text-sm whitespace-nowrap"
          style={{ color: '#94618e' }}
        >
          {payment.date}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(payment.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200 flex items-center gap-2"
            style={{
              backgroundColor: isHovered ? '#7a4f73' : '#94618e',
              color: '#f8eee7',
            }}
          >
            <Eye size={16} />
            <span className="hidden sm:inline">VIEW</span>
          </button>
        )}
        {onDownloadReceipt && payment.status === 'completed' && (
          <button
            onClick={() => onDownloadReceipt(payment.id)}
            onMouseEnter={() => setIsDownloadHovered(true)}
            onMouseLeave={() => setIsDownloadHovered(false)}
            className="px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200 flex items-center gap-2"
            style={{
              backgroundColor: isDownloadHovered ? '#7a4f73' : '#94618e',
              color: '#f8eee7',
            }}
          >
            <Download size={16} />
            <span className="hidden sm:inline">RECEIPT</span>
          </button>
        )}
      </div>
    </div>
  )
}
