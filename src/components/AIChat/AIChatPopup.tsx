import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { useAction, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AIChatPopupProps {
  isOpen: boolean
  onClose?: () => void
}

export const AIChatPopup = ({ isOpen, onClose: _onClose }: AIChatPopupProps) => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(() => `employer-${Date.now()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversation history
  const history = useQuery(api.conversations.getByParticipant, {
    participantId: conversationId
  })

  // Chat action
  const chat = useAction(api.aiAgent.chat)

  // Convert history to messages format
  const messages: Message[] = history?.map((h: { role: 'user' | 'assistant'; content: string; timestamp: number }) => ({
    role: h.role,
    content: h.content,
    timestamp: h.timestamp,
  })) || []

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      await chat({
        message: userMessage,
        conversationId,
      })
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed bottom-24 left-6 z-40 w-96 max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
      style={{ backgroundColor: '#f8eee7' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: '#94618e' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(248, 238, 231, 0.2)' }}
        >
          <Bot size={20} color="#f8eee7" />
        </div>
        <div>
          <h3 className="font-semibold text-white">AI Assistant</h3>
          <p className="text-xs" style={{ color: 'rgba(248, 238, 231, 0.8)' }}>
            I can help manage your jobs & applications
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Bot size={40} className="mx-auto mb-3" style={{ color: '#94618e', opacity: 0.5 }} />
            <p className="text-sm" style={{ color: '#94618e', opacity: 0.7 }}>
              Hi! I'm your AI assistant. I can help you:
            </p>
            <ul className="text-xs mt-2 space-y-1" style={{ color: '#94618e', opacity: 0.6 }}>
              <li>• Create and manage job postings</li>
              <li>• Review applications</li>
              <li>• Get insights about candidates</li>
              <li>• Answer questions about your dashboard</li>
            </ul>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#94618e' }}
              >
                <Bot size={16} color="#f8eee7" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                message.role === 'user'
                  ? 'rounded-br-md'
                  : 'rounded-bl-md'
              }`}
              style={{
                backgroundColor: message.role === 'user' ? '#94618e' : '#e8dcd7',
                color: message.role === 'user' ? '#f8eee7' : '#5a3851',
              }}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#5a3851' }}
              >
                <User size={16} color="#f8eee7" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#94618e' }}
            >
              <Bot size={16} color="#f8eee7" />
            </div>
            <div
              className="px-4 py-2 rounded-2xl rounded-bl-md"
              style={{ backgroundColor: '#e8dcd7' }}
            >
              <Loader2 size={16} className="animate-spin" style={{ color: '#94618e' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t-2"
        style={{ borderTopColor: '#e8dcd7' }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 rounded-full text-sm border-2 outline-none transition-all focus:ring-2"
            style={{
              borderColor: '#94618e',
              backgroundColor: '#fff',
              color: '#5a3851',
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{ backgroundColor: '#94618e' }}
          >
            <Send size={18} color="#f8eee7" />
          </button>
        </div>
      </form>
    </div>
  )
}
