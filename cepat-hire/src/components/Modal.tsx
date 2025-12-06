import { ReactNode, useEffect } from 'react'
import { X, CheckCircle, XCircle, Archive } from 'lucide-react'

type ModalVariant = 'success' | 'fail' | 'archive' | 'default'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  variant?: ModalVariant
  title?: string
  children?: ReactNode
  showIcon?: boolean
  showCloseButton?: boolean
}

const getVariantStyles = (variant: ModalVariant) => {
  const variants = {
    success: {
      iconBg: '#dcfce7',
      iconColor: '#22c55e',
      icon: CheckCircle,
    },
    fail: {
      iconBg: '#fee2e2',
      iconColor: '#ef4444',
      icon: XCircle,
    },
    archive: {
      iconBg: '#fef9c3',
      iconColor: '#eab308',
      icon: Archive,
    },
    default: {
      iconBg: '#f8eee7',
      iconColor: '#94618e',
      icon: null,
    },
  }
  return variants[variant]
}

export const Modal = ({
  isOpen,
  onClose,
  variant = 'default',
  title,
  children,
  showIcon = true,
  showCloseButton = true,
}: ModalProps) => {
  const variantStyles = getVariantStyles(variant)
  const Icon = variantStyles.icon

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(148, 97, 142, 0.4)' }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative rounded-2xl shadow-2xl max-w-4xl w-full transform transition-all duration-300 scale-100 animate-modal-appear overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: '#f8eee7' }}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#94618e'
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}

        {/* Icon Section */}
        {showIcon && Icon && (
          <div className="flex justify-center pt-8 pb-4">
            <div
              className="p-4 rounded-full"
              style={{ backgroundColor: variantStyles.iconBg }}
            >
              <Icon size={48} style={{ color: variantStyles.iconColor }} />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-8 pb-8 pt-16 text-center">
          {title && (
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: '#94618e' }}
            >
              {title}
            </h3>
          )}
          <div style={{ color: '#94618e' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal Actions Component (for footer buttons)
interface ModalActionsProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
}

export const ModalActions = ({ children, align = 'right' }: ModalActionsProps) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return (
    <div className={`flex gap-3 mt-4 ${alignmentClasses[align]}`}>
      {children}
    </div>
  )
}

// Add animation styles to your global CSS or styles.css
// @keyframes modal-appear {
//   from {
//     opacity: 0;
//     transform: scale(0.9);
//   }
//   to {
//     opacity: 1;
//     transform: scale(1);
//   }
// }
//
// .animate-modal-appear {
//   animation: modal-appear 0.3s ease-out;
// }
