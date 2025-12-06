import { Check, X } from 'lucide-react'

interface PasswordStrengthChecklistProps {
  password: string
}

interface Requirement {
  label: string
  test: (password: string) => boolean
}

export const PasswordStrengthChecklist = ({ password }: PasswordStrengthChecklistProps) => {
  const requirements: Requirement[] = [
    {
      label: '8+ characters',
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: 'One uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: 'One lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      label: 'One number',
      test: (pwd) => /\d/.test(pwd),
    },
  ]

  return (
    <div className="mt-2 space-y-1.5">
      {requirements.map((req, index) => {
        const isValid = req.test(password)
        const hasStartedTyping = password.length > 0

        return (
          <div key={index} className="flex items-center gap-2">
            <div
              className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                backgroundColor: hasStartedTyping
                  ? isValid
                    ? '#4ade80'
                    : '#ef4444'
                  : '#d1c4cc',
              }}
            >
              {hasStartedTyping && (
                <>
                  {isValid ? (
                    <Check size={12} color="#ffffff" strokeWidth={3} />
                  ) : (
                    <X size={12} color="#ffffff" strokeWidth={3} />
                  )}
                </>
              )}
            </div>
            <span
              className="text-sm font-medium transition-colors duration-200"
              style={{
                color: hasStartedTyping
                  ? isValid
                    ? '#4ade80'
                    : '#ef4444'
                  : '#94618e',
                opacity: hasStartedTyping ? 1 : 0.7,
              }}
            >
              {req.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
