import { ButtonHTMLAttributes, forwardRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const getVariantStyles = (variant: ButtonVariant, isHovered: boolean) => {
  const variants = {
    primary: {
      normal: {
        backgroundColor: '#94618e',
        color: '#f8eee7',
        border: '#94618e',
      },
      hover: {
        backgroundColor: '#7a4f73',
        color: '#f8eee7',
        border: '#7a4f73',
      },
    },
    secondary: {
      normal: {
        backgroundColor: '#f8eee7',
        color: '#94618e',
        border: '#94618e',
      },
      hover: {
        backgroundColor: '#e8dcd7',
        color: '#94618e',
        border: '#94618e',
      },
    },
    outline: {
      normal: {
        backgroundColor: 'transparent',
        color: '#94618e',
        border: '#94618e',
      },
      hover: {
        backgroundColor: '#f8eee7',
        color: '#94618e',
        border: '#94618e',
      },
    },
    ghost: {
      normal: {
        backgroundColor: 'transparent',
        color: '#94618e',
        border: 'transparent',
      },
      hover: {
        backgroundColor: '#f8eee7',
        color: '#94618e',
        border: 'transparent',
      },
    },
    danger: {
      normal: {
        backgroundColor: '#dc2626',
        color: '#ffffff',
        border: '#dc2626',
      },
      hover: {
        backgroundColor: '#b91c1c',
        color: '#ffffff',
        border: '#b91c1c',
      },
    },
  }
  return isHovered ? variants[variant].hover : variants[variant].normal
}

const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  return sizes[size]
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const sizeStyles = getSizeStyles(size)
    const isDisabled = disabled || loading
    const variantStyles = getVariantStyles(variant, isHovered && !isDisabled)

    const baseStyles = {
      backgroundColor: variantStyles.backgroundColor,
      color: variantStyles.color,
      borderColor: variantStyles.border,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ...style,
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        onMouseEnter={() => !isDisabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${sizeStyles}
          ${fullWidth ? 'w-full' : ''}
          font-medium
          rounded-lg
          transition-all
          duration-200
          flex
          items-center
          justify-center
          gap-2
          border-2
          ${isDisabled ? 'opacity-60' : 'transform hover:scale-105'}
          ${className}
        `}
        style={baseStyles}
        {...props}
      >
        {loading && (
          <Loader2
            className="animate-spin"
            size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
