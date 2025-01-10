/** @jsxImportSource react */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { handleCallback } = useAuth()

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const error = params.get('error')
        
        if (error) {
          console.error('OAuth error:', error)
          navigate('/')
          return
        }
        
        if (!code) {
          console.error('No authorization code found in URL')
          navigate('/')
          return
        }

        await handleCallback(code)
        navigate('/')
      } catch (error) {
        console.error('Failed to process OAuth callback:', error)
        navigate('/')
      }
    }

    processCallback()
  }, [handleCallback, navigate])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-xl">Processing login...</p>
        <p className="text-gray-400">Please wait while we complete your authentication</p>
      </div>
    </div>
  )
}
