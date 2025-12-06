import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type InputSize = 'sm' | 'md' | 'lg'

interface BaseInputProps {
  label?: string
  error?: string
  helperText?: string
  size?: InputSize
  fullWidth?: boolean
}

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseInputProps {
  as?: 'input'
}

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>, BaseInputProps {
  as: 'textarea'
  rows?: number
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>, BaseInputProps {
  as: 'select'
  options: { value: string; label: string }[]
}

type InputProps = TextInputProps | TextareaProps | SelectProps

const getSizeStyles = (size: InputSize = 'md') => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  }
  return sizes[size]
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputProps>(
  (props, ref) => {
    const {
      label,
      error,
      helperText,
      size = 'md',
      fullWidth = false,
      className = '',
      ...restProps
    } = props

    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const sizeStyles = getSizeStyles(size)
    const isPassword = restProps.as !== 'textarea' && restProps.as !== 'select' && restProps.type === 'password'

    const baseStyles = {
      backgroundColor: '#f8eee7',
      color: '#94618e',
      borderColor: error ? '#dc2626' : isFocused ? '#94618e' : '#d1c4cc',
    }

    const inputClasses = `
      ${sizeStyles}
      ${fullWidth ? 'w-full' : ''}
      font-medium
      rounded-lg
      transition-all
      duration-200
      border-2
      outline-none
      ${error ? 'border-red-600' : ''}
      ${className}
    `

    const renderInput = () => {
      if (props.as === 'textarea') {
        const { as, rows = 4, size: _size, ...textareaProps } = restProps as TextareaProps
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            className={inputClasses}
            style={baseStyles}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...textareaProps}
          />
        )
      }

      if (props.as === 'select') {
        const { as, options, size: _size, ...selectProps } = restProps as SelectProps
        return (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            className={inputClasses}
            style={{
              ...baseStyles,
              color: selectProps.value ? '#94618e' : '#b8a0b3',
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...selectProps}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} style={{ color: '#94618e' }}>
                {option.label}
              </option>
            ))}
          </select>
        )
      }

      const { as, size: _size, ...inputProps } = restProps as TextInputProps
      return (
        <div className="relative">
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={isPassword && showPassword ? 'text' : inputProps.type}
            className={inputClasses}
            style={baseStyles}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...inputProps}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#94618e' }}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      )
    }

    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="font-medium text-sm" style={{ color: '#94618e' }}>
            {label}
          </label>
        )}
        {renderInput()}
        {error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
        {helperText && !error && (
          <span className="text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Checkbox Component
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  size?: InputSize
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, size = 'md', className = '', ...props }, ref) => {
    const sizeMap: Record<InputSize, string> = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }

    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={`
            ${sizeMap[size]}
            rounded
            border-2
            transition-all
            duration-200
            cursor-pointer
            accent-purple-600
            ${className}
          `}
          style={{
            accentColor: '#94618e',
          }}
          {...props}
        />
        {label && (
          <span className="font-medium select-none" style={{ color: '#94618e' }}>
            {label}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

// Radio Component
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  size?: InputSize
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, size = 'md', className = '', ...props }, ref) => {
    const sizeMap: Record<InputSize, string> = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }

    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="radio"
          className={`
            ${sizeMap[size]}
            transition-all
            duration-200
            cursor-pointer
            accent-purple-600
            ${className}
          `}
          style={{
            accentColor: '#94618e',
          }}
          {...props}
        />
        {label && (
          <span className="font-medium select-none" style={{ color: '#94618e' }}>
            {label}
          </span>
        )}
      </label>
    )
  }
)

Radio.displayName = 'Radio'
