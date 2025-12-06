import { useState } from 'react'
import { Modal, ModalActions } from './Modal'
import { Briefcase, UserCircle } from 'lucide-react'

interface AccountTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (role: 'employer' | 'seeker') => void
}

export const AccountTypeModal = ({ isOpen, onClose, onSelect }: AccountTypeModalProps) => {
  const [selectedRole, setSelectedRole] = useState<'employer' | 'seeker' | null>(null)

  const handleContinue = () => {
    if (selectedRole) {
      onSelect(selectedRole)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Account Type"
      maxWidth="lg"
    >
      <div className="space-y-6">
        <p className="text-center" style={{ color: '#94618e', opacity: 0.8 }}>
          Select how you want to use CEPATHIRE
        </p>

        {/* Account Type Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Employer Option */}
          <button
            type="button"
            onClick={() => setSelectedRole('employer')}
            className="relative p-6 rounded-2xl border-4 transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: selectedRole === 'employer' ? '#94618e' : '#ffffff',
              borderColor: selectedRole === 'employer' ? '#94618e' : '#d1c4cc',
              color: selectedRole === 'employer' ? '#f8eee7' : '#94618e',
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className="p-4 rounded-full"
                style={{
                  backgroundColor: selectedRole === 'employer' ? '#f8eee7' : '#f8eee7',
                }}
              >
                <Briefcase
                  size={32}
                  style={{ color: '#94618e' }}
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Employer</h3>
                <p
                  className="text-sm"
                  style={{
                    color: selectedRole === 'employer' ? '#f8eee7' : '#94618e',
                    opacity: 0.8,
                  }}
                >
                  Post jobs and hire talent
                </p>
              </div>
            </div>
            {/* Radio Indicator */}
            <div className="absolute top-4 right-4">
              <div
                className="w-6 h-6 rounded-full border-3 flex items-center justify-center"
                style={{
                  borderColor: selectedRole === 'employer' ? '#f8eee7' : '#94618e',
                  borderWidth: '3px',
                }}
              >
                {selectedRole === 'employer' && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#f8eee7' }}
                  />
                )}
              </div>
            </div>
          </button>

          {/* Job Seeker Option */}
          <button
            type="button"
            onClick={() => setSelectedRole('seeker')}
            className="relative p-6 rounded-2xl border-4 transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: selectedRole === 'seeker' ? '#94618e' : '#ffffff',
              borderColor: selectedRole === 'seeker' ? '#94618e' : '#d1c4cc',
              color: selectedRole === 'seeker' ? '#f8eee7' : '#94618e',
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className="p-4 rounded-full"
                style={{
                  backgroundColor: selectedRole === 'seeker' ? '#f8eee7' : '#f8eee7',
                }}
              >
                <UserCircle
                  size={32}
                  style={{ color: '#94618e' }}
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Job Seeker</h3>
                <p
                  className="text-sm"
                  style={{
                    color: selectedRole === 'seeker' ? '#f8eee7' : '#94618e',
                    opacity: 0.8,
                  }}
                >
                  Find and apply for jobs
                </p>
              </div>
            </div>
            {/* Radio Indicator */}
            <div className="absolute top-4 right-4">
              <div
                className="w-6 h-6 rounded-full border-3 flex items-center justify-center"
                style={{
                  borderColor: selectedRole === 'seeker' ? '#f8eee7' : '#94618e',
                  borderWidth: '3px',
                }}
              >
                {selectedRole === 'seeker' && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#f8eee7' }}
                  />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      <ModalActions
        onCancel={onClose}
        onConfirm={handleContinue}
        confirmText="Continue"
        cancelText="Cancel"
        confirmDisabled={!selectedRole}
      />
    </Modal>
  )
}
