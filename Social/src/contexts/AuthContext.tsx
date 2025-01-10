/** @jsxImportSource react */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for placeholder authentication
const MOCK_USER: User = {
  id: 'mock-1',
  name: 'Demo User',
  email: 'demo@polyhedra.network',
  avatar: '/assets/polyhedra-symbol.png'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking local storage for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('mock_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
        setLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const signIn = async () => {
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem('mock_user', JSON.stringify(MOCK_USER))
      setUser(MOCK_USER)
    } catch (error) {
      console.error('Sign in failed:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Simulate sign out delay
      await new Promise(resolve => setTimeout(resolve, 500))
      localStorage.removeItem('mock_user')
      setUser(null)
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
