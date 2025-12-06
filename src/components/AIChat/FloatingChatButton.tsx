import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { AIChatPopup } from './AIChatPopup'
import { useAuth } from '../../contexts/AuthContext'

export const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      {/* Chat Popup */}
      <AIChatPopup isOpen={isOpen} onClose={() => setIsOpen(false)} userId={user?.id} />

      {/* Floating Button - positioned on left side */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
        style={{
          backgroundColor: isOpen ? '#5a3851' : '#94618e',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open AI assistant'}
      >
        {isOpen ? (
          <X size={24} color="#f8eee7" />
        ) : (
          <MessageCircle size={24} color="#f8eee7" />
        )}
      </button>
    </>
  )
}
