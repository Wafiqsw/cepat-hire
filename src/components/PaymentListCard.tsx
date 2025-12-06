import { useState } from 'react'

type PaymentStatus = 'ongoing' | 'completed' | 'pending' | 'cancelled'

interface PaymentListCardProps {
  name: string
  status: PaymentStatus
  date: string
  onView?: () => void
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

export const PaymentListCard = ({ name, status, date, onView }: PaymentListCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const statusStyle = getStatusStyles(status)

  return (
    <div
      className="flex items-center justify-between px-6 py-4 rounded-full transition-all duration-200"
      style={{
        backgroundColor: '#4a2c49',
      }}
    >
      {/* Left Section - Name */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-lg truncate"
          style={{ color: '#f8eee7' }}
        >
          {name}
        </h3>
      </div>

      {/* Middle Section - Status */}
      <div className="flex-shrink-0 mx-6">
        <span
          className="px-6 py-1.5 rounded-full font-bold text-sm uppercase tracking-wide"
          style={{
            backgroundColor: statusStyle.backgroundColor,
            color: statusStyle.color,
          }}
        >
          {statusStyle.text}
        </span>
      </div>

      {/* Right Section - Date and Button */}
      <div className="flex items-center gap-6">
        <span
          className="font-semibold text-lg whitespace-nowrap"
          style={{ color: '#f8eee7' }}
        >
          {date}
        </span>
        <button
          onClick={onView}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="px-8 py-2 rounded-full font-bold text-base uppercase tracking-wide transition-all duration-200"
          style={{
            backgroundColor: isHovered ? '#7a4f73' : '#94618e',
            color: '#f8eee7',
          }}
        >
          VIEW
        </button>
      </div>
    </div>
  )
}
