import { Calendar, CreditCard } from 'lucide-react'

type PaymentStatus = 'completed' | 'pending' | 'cancelled'

interface PaymentData {
  id: string
  amount: number
  currency?: string
  status: PaymentStatus
  date: string
  description?: string
  paymentMethod?: string
  transactionId?: string
}

interface PaymentCardProps {
  payment: PaymentData
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
  const statusStyle = getStatusStyles(payment.status)

  const formatCurrency = (amount: number, currency: string = 'RM') => {
    return `${currency} ${new Intl.NumberFormat('ms-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`
  }

  return (
    <div
      className={`p-5 rounded-2xl transition-all duration-200 border-2 hover:shadow-md ${className}`}
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        {/* Left - Description */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-lg mb-1"
            style={{ color: '#94618e' }}
          >
            {payment.description || 'Payment'}
          </h3>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#94618e', opacity: 0.6 }}>
            <Calendar size={14} />
            <span>{payment.date}</span>
          </div>
        </div>

        {/* Right - Amount */}
        <div className="text-right flex-shrink-0">
          <p
            className="font-bold text-2xl mb-1"
            style={{ color: '#94618e' }}
          >
            {formatCurrency(payment.amount, payment.currency)}
          </p>
          <div
            className="inline-flex px-3 py-1 rounded-full text-xs font-bold border-2"
            style={{
              backgroundColor: statusStyle.backgroundColor,
              borderColor: statusStyle.borderColor,
              color: statusStyle.textColor,
            }}
          >
            {statusStyle.text}
          </div>
        </div>
      </div>

      {/* Bottom - Payment Method & Transaction ID */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
        {payment.paymentMethod && (
          <div className="flex items-center gap-2">
            <CreditCard size={14} style={{ color: '#94618e', opacity: 0.6 }} />
            <span className="text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
              {payment.paymentMethod}
            </span>
          </div>
        )}
        {payment.transactionId && (
          <span className="text-xs font-mono" style={{ color: '#94618e', opacity: 0.5 }}>
            {payment.transactionId}
          </span>
        )}
      </div>
    </div>
  )
}
