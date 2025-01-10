/** @jsxImportSource react */
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './components/LandingPage'
import AuthCallback from './components/AuthCallback'
import CreatePost from './components/CreatePost'
import Post from './components/Post'
import { Card } from "./components/ui/card"
import { ScrollArea } from "./components/ui/scroll-area"
import { Button } from "./components/ui/button"
import { Separator } from "./components/ui/separator"
import { LogOut } from "lucide-react"
import polyhedraLogo from './assets/polyhedra-logo.png'

// Trending topics
const trending = [
  "#Polyhedra",
  "#Blockchain",
  "#zkBridge",
  "#EXPchain",
  "#CryptoInnovation"
]

function MainApp() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto flex gap-4">
        {/* Left Sidebar */}
        <div className="w-64 py-4">
          <div className="fixed w-64">
            <div className="mb-8">
              <img src={polyhedraLogo} alt="Polyhedra Logo" className="w-48 mb-4" />
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
            {/* Example posts - replace with real data later */}
            <Post
              id={1}
              author="Alice"
              handle="@alice_poly"
              type="selection"
              commitment="8a1c3c88f7e4d2b5a6e9f0c3d2b5a8e7"
              options={[
                { text: "ZK-SNARKs are more efficient than ZK-STARKs", odds: 2.5 },
                { text: "ZK-STARKs are more efficient than ZK-SNARKs", odds: 1.8 },
                { text: "They have different trade-offs", odds: 1.5 }
              ]}
              likes={42}
              comments={5}
              reposts={8}
            />
            <Post
              id={2}
              author="Bob"
              handle="@bob_chain"
              type="cloze"
              content="The next big milestone for Polyhedra will be [zkBridge v2]"
              commitment="7b2d4c99e8f5c3a6b9d0e1f4c3a6b9d0"
              likes={28}
              comments={3}
              reposts={12}
            />
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
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={!user ? <LandingPage /> : <MainApp />} />
    </Routes>
  )
}

export default App
