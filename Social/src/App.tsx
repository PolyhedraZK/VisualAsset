/** @jsxImportSource react */
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LandingPage from './components/LandingPage'
import CreatePost from './components/CreatePost'
import { Card } from "./components/ui/card"
import { ScrollArea } from "./components/ui/scroll-area"
import { Button } from "./components/ui/button"
import { Separator } from "./components/ui/separator"
import { LogOut } from "lucide-react"

// Trending topics
const trending = [
  "#Polyhedra",
  "#Blockchain",
  "#zkBridge",
  "#EXPchain",
  "#CryptoInnovation"
]

function MainApp() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto flex gap-4">
        {/* Left Sidebar */}
        <div className="w-64 py-4">
          <div className="fixed w-64">
            <div className="mb-8">
              <img src="/assets/polyhedra-logo.png" alt="Polyhedra Logo" className="w-48 mb-4" />
            </div>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">Home</Button>
              <Button variant="ghost" className="w-full justify-start">Explore</Button>
              <Button variant="ghost" className="w-full justify-start">Notifications</Button>
              <Button variant="ghost" className="w-full justify-start">Messages</Button>
              <Button variant="ghost" className="w-full justify-start">Profile</Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-2xl border-x border-gray-800 min-h-screen">
          <CreatePost />
          <ScrollArea className="h-[calc(100vh-200px)]">
            {/* Posts will be rendered here */}
          </ScrollArea>
        </main>

        {/* Right Sidebar */}
        <div className="w-80 py-4">
          <div className="fixed w-80">
            <Card className="p-4 bg-gray-900 border-gray-800">
              <h2 className="font-bold text-xl mb-4 text-white">Trending</h2>
              {trending.map((topic, index) => (
                <div key={index} className="py-2">
                  <Button variant="ghost" className="w-full text-left justify-start text-gray-100 hover:text-purple-400 hover:bg-purple-400/10">
                    {topic}
                  </Button>
                  {index < trending.length - 1 && <Separator className="my-2 bg-gray-800" />}
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <AuthProvider>
      {!user ? <LandingPage /> : <MainApp />}
    </AuthProvider>
  )
}

export default App
