import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  text?: string
  fullScreen?: boolean
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
}

export const Loading = ({
  size = 'md',
  color = '#94618e',
  text,
  fullScreen = false
}: LoadingProps) => {
  const spinnerSize = sizeMap[size]

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl" style={{ backgroundColor: '#f8eee7' }}>
          <Loader2
            size={spinnerSize}
            className="animate-spin"
            style={{ color }}
          />
          {text && (
            <p className="text-sm font-medium" style={{ color }}>
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2
        size={spinnerSize}
        className="animate-spin"
        style={{ color }}
      />
      {text && (
        <p className="text-sm font-medium animate-pulse" style={{ color }}>
          {text}
        </p>
      )}
    </div>
  )
}

// Skeleton loader for cards
interface SkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'rectangle'
  className?: string
  count?: number
}

export const Skeleton = ({
  variant = 'rectangle',
  className = '',
  count = 1
}: SkeletonProps) => {
  const baseClass = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"

  const variantClasses = {
    card: 'rounded-2xl h-48 w-full',
    text: 'rounded h-4 w-full',
    circle: 'rounded-full h-12 w-12',
    rectangle: 'rounded-lg h-32 w-full',
  }

  const skeletonClass = `${baseClass} ${variantClasses[variant]} ${className}`

  if (count === 1) {
    return <div className={skeletonClass} style={{ animation: 'shimmer 2s infinite' }} />
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} style={{ animation: 'shimmer 2s infinite' }} />
      ))}
    </div>
  )
}

// Loading Overlay Component
interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
}

export const LoadingOverlay = ({ isLoading, text = 'Loading...' }: LoadingOverlayProps) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{ backgroundColor: 'rgba(73, 39, 74, 0.8)' }}>
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl shadow-2xl" style={{ backgroundColor: '#f8eee7' }}>
        <div className="relative">
          <Loader2
            size={48}
            className="animate-spin"
            style={{ color: '#94618e' }}
          />
          <div className="absolute inset-0 animate-ping opacity-20">
            <Loader2 size={48} style={{ color: '#94618e' }} />
          </div>
        </div>
        <p className="text-lg font-bold animate-pulse" style={{ color: '#94618e' }}>
          {text}
        </p>
      </div>
    </div>
  )
}

// Inline Spinner (for buttons)
interface SpinnerProps {
  size?: number
  color?: string
}

export const Spinner = ({ size = 16, color = '#ffffff' }: SpinnerProps) => {
  return (
    <Loader2
      size={size}
      className="animate-spin inline-block"
      style={{ color }}
    />
  )
}
