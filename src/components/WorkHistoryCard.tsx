import { Calendar, MapPin, Briefcase, Star, Zap, Trophy } from 'lucide-react'

interface WorkHistoryData {
  id: string
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  description?: string
  isCurrentJob?: boolean
}

interface WorkHistoryCardProps {
  work: WorkHistoryData
  onClick?: (id: string) => void
  className?: string
}

const calculateDuration = (startDate: string, endDate: string, isCurrent: boolean) => {
  // Parse DD/MM/YYYY format
  const parseDate = (dateStr: string) => {
    if (dateStr === 'Present') return new Date()
    const [day, month, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const start = parseDate(startDate)
  const end = isCurrent ? new Date() : parseDate(endDate)

  // Calculate difference in milliseconds
  const diffMs = end.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  // Return appropriate unit based on duration
  if (diffDays === 0) {
    // Same day - show hours
    return { value: Math.max(1, diffHours), unit: 'hour' }
  } else if (diffDays < 30) {
    // Less than a month - show days
    return { value: diffDays + 1, unit: 'day' } // +1 to include both start and end day
  } else if (diffDays < 365) {
    // Less than a year - show months
    const months = Math.floor(diffDays / 30)
    return { value: months, unit: 'month' }
  } else {
    // A year or more - show years
    const years = Math.floor(diffDays / 365)
    return { value: years, unit: 'year' }
  }
}

export const WorkHistoryCard = ({
  work,
  onClick,
  className = '',
}: WorkHistoryCardProps) => {
  const duration = calculateDuration(work.startDate, work.endDate, work.isCurrentJob || false)

  // Determine gig level based on duration
  const getGigLevel = () => {
    if (duration.unit === 'month' || duration.unit === 'year') {
      return 'regular'
    } else if (duration.unit === 'day' && duration.value > 1) {
      return 'short'
    } else {
      return 'quick'
    }
  }

  const gigLevel = getGigLevel()

  const levelColors = {
    regular: { bg: '#94618e', text: '#f8eee7', badge: 'Regular' },
    short: { bg: '#4a2c49', text: '#f8eee7', badge: 'Short-term' },
    quick: { bg: '#d1c4cc', text: '#94618e', badge: 'Quick Gig' },
  }

  const level = levelColors[gigLevel]

  // Format duration display
  const formatDuration = () => {
    const plural = duration.value !== 1 ? 's' : ''
    return `${duration.value} ${duration.unit}${plural}`
  }

  return (
    <div
      className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-3 cursor-pointer group relative ${className}`}
      style={{
        backgroundColor: '#ffffff',
        borderColor: level.bg,
        borderWidth: '3px',
        transform: 'translateY(0)',
      }}
      onClick={() => onClick?.(work.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Top Accent Bar */}
      <div
        className="h-2"
        style={{
          background: `linear-gradient(90deg, ${level.bg} 0%, #f8eee7 100%)`,
        }}
      />

      <div className="px-6 py-5">
        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="p-3 rounded-xl flex-shrink-0"
            style={{
              backgroundColor: level.bg,
            }}
          >
            <Briefcase size={24} style={{ color: level.text }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-lg font-bold" style={{ color: '#94618e' }} title={work.position}>
                {work.position}
              </h3>
              {work.isCurrentJob && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: '#22c55e20' }}>
                  <Zap size={14} style={{ color: '#22c55e' }} />
                  <span className="text-xs font-bold" style={{ color: '#22c55e' }}>
                    ACTIVE
                  </span>
                </div>
              )}
            </div>
            <p className="text-base font-semibold mb-2" style={{ color: '#94618e', opacity: 0.8 }} title={work.company}>
              {work.company}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} style={{ color: '#94618e', opacity: 0.6 }} />
                <span className="text-sm" style={{ color: '#94618e', opacity: 0.8 }}>
                  {work.location}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} style={{ color: '#94618e', opacity: 0.6 }} />
                <span className="text-sm" style={{ color: '#94618e', opacity: 0.8 }}>
                  {work.startDate} - {work.isCurrentJob ? 'Present' : work.endDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {work.description && (
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: '#94618e', opacity: 0.7 }}
          >
            {work.description}
          </p>
        )}

        {/* Bottom Stats Bar */}
        <div className="flex items-center justify-between pt-3 border-t-2" style={{ borderColor: '#f8eee7' }}>
          <div className="flex items-center gap-2">
            <Trophy size={16} style={{ color: level.bg }} />
            <span className="text-sm font-bold" style={{ color: level.bg }}>
              {level.badge}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} style={{ color: '#fbbf24' }} fill="#fbbf24" />
            <span className="text-sm font-semibold" style={{ color: '#94618e', opacity: 0.7 }}>
              {formatDuration()}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: level.bg }}
      />
    </div>
  )
}

// Work History List Component
interface WorkHistoryListProps {
  workHistory: WorkHistoryData[]
  onClick?: (id: string) => void
}

export const WorkHistoryList = ({ workHistory, onClick }: WorkHistoryListProps) => {
  return (
    <div className="space-y-4">
      {workHistory.map((work) => (
        <WorkHistoryCard key={work.id} work={work} onClick={onClick} />
      ))}
    </div>
  )
}
