import { LucideIcon } from 'lucide-react'

interface ProfileInfoItem {
  id: string
  label: string
  value: string
  icon?: LucideIcon
}

interface ProfileInfoCardProps {
  title?: string
  items: ProfileInfoItem[]
  className?: string
  variant?: 'default' | 'compact'
}

export const ProfileInfoCard = ({
  title,
  items,
  className = '',
  variant = 'default',
}: ProfileInfoCardProps) => {
  if (variant === 'compact') {
    return (
      <div
        className={`rounded-xl overflow-hidden border-2 ${className}`}
        style={{
          backgroundColor: '#f8eee7',
          borderColor: '#94618e',
        }}
      >
        <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-2 sm:space-y-3">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.id} className="flex items-start gap-2 sm:gap-3 min-w-0">
                {Icon && (
                  <Icon
                    size={16}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: '#94618e', opacity: 0.7 }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium mb-0.5" style={{ color: '#94618e', opacity: 0.7 }}>
                    {item.label}
                  </p>
                  <p
                    className="text-sm sm:text-base font-semibold break-words"
                    style={{ color: '#94618e' }}
                    title={item.value}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-2 ${className}`}
      style={{
        backgroundColor: '#f8eee7',
        borderColor: '#94618e',
      }}
    >
      {title && (
        <div
          className="px-4 sm:px-6 py-3 sm:py-4 border-b-2"
          style={{ borderBottomColor: '#94618e' }}
        >
          <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#94618e' }}>
            {title}
          </h3>
        </div>
      )}

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.id} className="flex items-start gap-3 sm:gap-4 min-w-0">
              {Icon && (
                <div
                  className="p-2 sm:p-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: '#94618e', opacity: 0.1 }}
                >
                  <Icon
                    size={18}
                    className="sm:w-5 sm:h-5"
                    style={{ color: '#94618e' }}
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: '#94618e', opacity: 0.7 }}>
                  {item.label}
                </p>
                <p
                  className="text-sm sm:text-base font-semibold break-words"
                  style={{ color: '#94618e' }}
                  title={item.value}
                >
                  {item.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Profile Section Component (groups multiple info cards)
interface ProfileSectionProps {
  sections: {
    id: string
    title?: string
    items: ProfileInfoItem[]
    variant?: 'default' | 'compact'
  }[]
  className?: string
}

export const ProfileSection = ({ sections, className = '' }: ProfileSectionProps) => {
  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {sections.map((section) => (
        <ProfileInfoCard
          key={section.id}
          title={section.title}
          items={section.items}
          variant={section.variant}
        />
      ))}
    </div>
  )
}
