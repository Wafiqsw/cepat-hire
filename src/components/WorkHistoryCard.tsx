import { Calendar, MapPin, Briefcase, ChevronRight } from 'lucide-react'

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

export const WorkHistoryCard = ({
  work,
  onClick,
  className = '',
}: WorkHistoryCardProps) => {
  return (
    <div
      className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 cursor-pointer group ${className}`}
      style={{
        backgroundColor: '#f8eee7',
        borderColor: '#94618e',
      }}
      onClick={() => onClick?.(work.id)}
    >
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold mb-1 truncate" style={{ color: '#94618e' }} title={work.position}>
              {work.position}
            </h3>
            <p className="text-sm sm:text-base font-semibold truncate" style={{ color: '#94618e', opacity: 0.8 }} title={work.company}>
              {work.company}
            </p>
          </div>
          <ChevronRight
            size={18}
            className="transition-transform group-hover:translate-x-1 flex-shrink-0 sm:w-5 sm:h-5"
            style={{ color: '#94618e', opacity: 0.5 }}
          />
        </div>

        {/* Details */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={14} style={{ color: '#94618e', opacity: 0.6 }} className="flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e', opacity: 0.8 }} title={work.location}>
              {work.location}
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <Calendar size={14} style={{ color: '#94618e', opacity: 0.6 }} className="flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate" style={{ color: '#94618e', opacity: 0.8 }}>
              {work.startDate} - {work.isCurrentJob ? 'Present' : work.endDate}
            </span>
          </div>
        </div>

        {/* Description */}
        {work.description && (
          <p
            className="text-xs sm:text-sm line-clamp-2 leading-relaxed"
            style={{ color: '#94618e', opacity: 0.7 }}
            title={work.description}
          >
            {work.description}
          </p>
        )}

        {/* Current Job Badge */}
        {work.isCurrentJob && (
          <div className="mt-3">
            <span
              className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: '#94618e',
                color: '#f8eee7',
              }}
            >
              Current Position
            </span>
          </div>
        )}
      </div>
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
