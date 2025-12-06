import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

interface User {
  id: string
  name: string
  email: string
  role: 'employer' | 'seeker'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, role: 'employer' | 'seeker') => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'cepathire_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)

  // Query session with current token
  const sessionData = useQuery(
    api.auth.getSession,
    token ? { token } : 'skip'
  )

  // Mutations
  const loginMutation = useMutation(api.auth.login)
  const registerMutation = useMutation(api.auth.register)
  const logoutMutation = useMutation(api.auth.logout)

  // Update loading state based on session query
  useEffect(() => {
    if (token === null) {
      setIsLoading(false)
    } else if (sessionData !== undefined) {
      setIsLoading(false)
    }
  }, [token, sessionData])

  // If session is invalid, clear token
  useEffect(() => {
    if (token && sessionData === null) {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
    }
  }, [token, sessionData])

  const user = sessionData?.user as User | null

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({ email, password })
      localStorage.setItem(TOKEN_KEY, result.token)
      setToken(result.token)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      return { success: false, error: message }
    }
  }

  const register = async (name: string, email: string, password: string, role: 'employer' | 'seeker') => {
    try {
      const result = await registerMutation({ name, email, password, role })
      localStorage.setItem(TOKEN_KEY, result.token)
      setToken(result.token)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    if (token) {
      try {
        await logoutMutation({ token })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
