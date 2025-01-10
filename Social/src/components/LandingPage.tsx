/** @jsxImportSource react */
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ArrowRight, FileText } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import polyhedraLogo from '../assets/polyhedra-logo.png'

export default function LandingPage() {
  const { signIn } = useAuth()

  const handleLogin = async () => {
    try {
      console.log('Initiating Google OAuth login...')
      await signIn()
    } catch (error) {
      console.error('Login failed:', error)
      // Show error to user (we could add a toast notification here in the future)
      alert('Failed to sign in. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Card className="bg-gray-900 border-gray-800 p-8">
          <div className="text-center space-y-6">
            <img
              src={polyhedraLogo}
              alt="Polyhedra Logo"
              className="h-24 mx-auto mb-8"
            />
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Welcome to Polyhedra Social
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A zero-knowledge social platform for predictions, hidden content, and community engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={handleLogin}
                className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6"
              >
                Sign in with Google
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 text-lg px-8 py-6"
                onClick={() => window.open('#', '_blank')}
              >
                Read Whitepaper
                <FileText className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
