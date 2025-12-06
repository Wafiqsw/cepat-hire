import { useState } from 'react'
import { Wallet, TrendingUp, ArrowDownToLine, Eye, EyeOff } from 'lucide-react'
import { Button } from './Button'
import { Modal, ModalActions } from './Modal'

interface WalletCardProps {
  balance: number
  currency?: string
  onWithdraw?: () => void
  className?: string
  variant?: 'default' | 'mini'
}

export const WalletCard = ({
  balance,
  currency = 'RM',
  onWithdraw,
  className = '',
  variant = 'default',
}: WalletCardProps) => {
  const [showModal, setShowModal] = useState(false)
  const [showBalance, setShowBalance] = useState(true)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Mini variant (icon only)
  if (variant === 'mini') {
    return (
      <>
        <button
          className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative ${className}`}
          style={{
            backgroundColor: '#94618e',
          }}
          onClick={() => setShowModal(true)}
        >
          <Wallet size={24} style={{ color: '#f8eee7' }} />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
            style={{ backgroundColor: '#22c55e' }}
          />
        </button>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          variant="default"
          title="Wallet Management"
          showIcon={false}
        >
          <div className="space-y-6">
            <div
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: '#94618e' }}
            >
              <p className="text-sm mb-2" style={{ color: '#f8eee7', opacity: 0.8 }}>
                Current Balance
              </p>
              <h3 className="text-3xl font-bold" style={{ color: '#f8eee7' }}>
                {currency} {formatCurrency(balance)}
              </h3>
            </div>

            <p className="text-sm text-center" style={{ color: '#94618e', opacity: 0.8 }}>
              You can withdraw your available balance to your registered bank account.
            </p>

            <ModalActions align="center">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onWithdraw?.()
                  setShowModal(false)
                }}
              >
                <ArrowDownToLine size={18} />
                Withdraw
              </Button>
            </ModalActions>
          </div>
        </Modal>
      </>
    )
  }

  // Default variant
  return (
    <>
      <div
        className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 ${className}`}
        style={{
          backgroundColor: '#94618e',
          borderColor: '#7a4f73',
        }}
        onClick={() => setShowModal(true)}
      >
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div
                className="p-2 sm:p-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'rgba(248, 238, 231, 0.2)' }}
              >
                <Wallet size={20} className="sm:w-6 sm:h-6" style={{ color: '#f8eee7' }} />
              </div>
              <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: '#f8eee7' }}>
                Wallet Balance
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowBalance(!showBalance)
              }}
              className="p-2 rounded-full hover:bg-opacity-20 transition-all flex-shrink-0"
              style={{ backgroundColor: 'rgba(248, 238, 231, 0.1)' }}
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? (
                <Eye size={18} className="sm:w-5 sm:h-5" style={{ color: '#f8eee7' }} />
              ) : (
                <EyeOff size={18} className="sm:w-5 sm:h-5" style={{ color: '#f8eee7' }} />
              )}
            </button>
          </div>

          {/* Balance */}
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm mb-1" style={{ color: '#f8eee7', opacity: 0.7 }}>
              Available Balance
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold break-all" style={{ color: '#f8eee7' }}>
              {showBalance ? (
                <>
                  {currency} {formatCurrency(balance)}
                </>
              ) : (
                '•••••••'
              )}
            </h2>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#22c55e' }} />
            <span className="text-xs sm:text-sm" style={{ color: '#f8eee7', opacity: 0.8 }}>
              Click to manage your wallet
            </span>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        variant="default"
        title="Wallet Management"
        showIcon={false}
      >
        <div className="space-y-6">
          {/* Balance Display */}
          <div
            className="p-6 rounded-xl text-center"
            style={{ backgroundColor: '#94618e' }}
          >
            <p className="text-sm mb-2" style={{ color: '#f8eee7', opacity: 0.8 }}>
              Current Balance
            </p>
            <h3 className="text-3xl font-bold" style={{ color: '#f8eee7' }}>
              {currency} {formatCurrency(balance)}
            </h3>
          </div>

          {/* Info */}
          <p className="text-sm text-center" style={{ color: '#94618e', opacity: 0.8 }}>
            You can withdraw your available balance to your registered bank account.
          </p>

          {/* Actions */}
          <ModalActions align="center">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onWithdraw?.()
                setShowModal(false)
              }}
            >
              <ArrowDownToLine size={18} />
              Withdraw
            </Button>
          </ModalActions>
        </div>
      </Modal>
    </>
  )
}
