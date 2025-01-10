/** @jsxImportSource react */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { OAUTH_CONFIG, generateOAuthUrl } from '../config/oauth'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  access_token?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  handleCallback: (code: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'oauth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY)
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
      // Generate and redirect to Google OAuth URL
      const authUrl = generateOAuthUrl()
      console.log('Redirecting to Google OAuth...')
      
      // Clear any existing session before starting new auth
      localStorage.removeItem(STORAGE_KEY)
      setUser(null)
      
      // Redirect to Google's auth page
      window.location.href = authUrl
    } catch (error) {
      console.error('Sign in failed:', error)
      throw error
    }
  }

  const handleCallback = async (code: string) => {
    try {
      console.log('Starting OAuth callback process...')
      
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: OAUTH_CONFIG.client_id,
          client_secret: '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',
          redirect_uri: OAUTH_CONFIG.redirect_uri,
          grant_type: 'authorization_code',
          code,
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}))
        console.error('Token exchange failed:', errorData)
        throw new Error(`Failed to exchange code for token: ${errorData.error || tokenResponse.statusText}`)
      }

      const tokens = await tokenResponse.json()
      console.log('Successfully obtained access token')
      
      // Fetch user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}))
        console.error('User info fetch failed:', errorData)
        throw new Error(`Failed to fetch user info: ${errorData.error || userResponse.statusText}`)
      }

      const userData = await userResponse.json()
      console.log('Successfully fetched user info')
      
      if (!userData.id || !userData.email) {
        throw new Error('Invalid user data received from Google')
      }
      
      const user: User = {
        id: userData.id,
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        avatar: userData.picture,
        access_token: tokens.access_token,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      setUser(user)
      console.log('User successfully authenticated and stored')
    } catch (error) {
      console.error('OAuth callback failed:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      console.log('Starting sign out process...')
      
      // Get the stored user data before clearing it
      const storedUser = localStorage.getItem(STORAGE_KEY)
      let accessToken = null
      
      try {
        const userData = storedUser ? JSON.parse(storedUser) : null
        accessToken = userData?.access_token
      } catch (e) {
        console.warn('Failed to parse stored user data:', e)
      }

      // Clear local storage and state first for immediate feedback
      localStorage.removeItem(STORAGE_KEY)
      setUser(null)

      // If we have an access token, try to revoke it
      if (accessToken) {
        try {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          console.log('Successfully revoked Google access token')
        } catch (e) {
          // Non-blocking error - we've already cleared local state
          console.warn('Failed to revoke Google access token:', e)
        }
      }

      console.log('Sign out complete')
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, handleCallback }}>
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
