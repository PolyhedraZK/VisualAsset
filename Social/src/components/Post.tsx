/** @jsxImportSource react */
import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Avatar } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Slider } from "../components/ui/slider"
import { Heart, MessageCircle, Repeat2, Share, DollarSign } from "lucide-react"
import polyhedraSymbol from '../assets/polyhedra-symbol.png'

import { Post as PostType, ClassicalPost, SelectionPost, ClozePost } from '../types/post'

// Use Web Crypto API for hashing
const generateHash = async (text: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

type PostProps = PostType;

export default function Post(props: PostProps) {
  const { author, handle, type, likes, comments, reposts } = props;
  const [betAmount, setBetAmount] = useState(50)
  const [selectedOption, setSelectedOption] = useState<number>(-1)
  const [guess, setGuess] = useState("")
  
  const renderClassicalPost = (post: ClassicalPost) => (
    <p className="mt-1 text-gray-100">{post.content}</p>
  );

  const renderSelectionPost = (post: SelectionPost) => (
    <div className="mt-2 space-y-3">
      {post.content && <p className="text-gray-100 mb-4">{post.content}</p>}
      <div className="space-y-2">
        {post.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Button
              variant={selectedOption === index ? "default" : "outline"}
              className="flex-1 justify-between"
              onClick={() => setSelectedOption(index)}
            >
              <span>{option.text}</span>
              <span className="text-sm opacity-70">Odds: {option.odds}x</span>
            </Button>
          </div>
        ))}
      </div>
      {selectedOption !== -1 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Bet Amount:</p>
          <div className="flex gap-2">
            <Slider
              defaultValue={[50]}
              min={1}
              max={100}
              step={1}
              value={[betAmount]}
              onValueChange={(value) => setBetAmount(value[0])}
              className="flex-1"
            />
            <div className="w-20 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{betAmount}</span>
            </div>
          </div>
          <Button
            onClick={handleBet}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Place Bet
          </Button>
        </div>
      )}
    </div>
  );

  const renderClozePost = (post: ClozePost) => {
    // Replace hidden parts with dots in displayed content
    const displayContent = post.content.replace(/\[(.*?)\]/g, '[•••]');
    
    return (
      <div className="mt-2 space-y-3">
        <p className="text-gray-100">
          {displayContent.split(/(\[•••\])/).map((part, index) => 
            part === '[•••]' ? (
              <span key={index} className="bg-purple-900/30 text-purple-300 px-1 rounded">
                {part}
              </span>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </p>
        <Input
          placeholder="Enter your guess for the hidden content..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="bg-gray-800 border-gray-700 text-gray-100"
        />
        <Button
          onClick={handleBet}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Submit Guess
        </Button>
      </div>
    );
  };

  const verifyGuess = async (post: ClozePost, input: string) => {
    // In a real implementation, this would use ZK proof verification
    const guessHash = await generateHash(input)
    return guessHash === post.commitment
  }

  const handleBet = async () => {
    switch (type) {
      case 'selection': {
        const post = props as SelectionPost;
        if (selectedOption !== -1 && betAmount > 0) {
          const potentialWinnings = betAmount * post.options[selectedOption].odds;
          console.log(`Placing bet of $${betAmount} on option ${selectedOption}`)
          console.log(`Odds: ${post.options[selectedOption].odds}x`)
          console.log(`Potential winnings: $${potentialWinnings.toFixed(2)}`)
          alert(`Bet placed! $${betAmount} on "${post.options[selectedOption].text}"\nPotential winnings: $${potentialWinnings.toFixed(2)}`)
        } else {
          alert('Please select an option and enter a bet amount greater than 0')
        }
        break;
      }
      case 'cloze': {
        const post = props as ClozePost;
        if (!guess.trim()) {
          alert('Please enter a guess')
          return
        }
        const isCorrect = await verifyGuess(post, guess)
        console.log(`Guess ${isCorrect ? 'correct' : 'incorrect'}: ${guess}`)
        alert(`Your guess was ${isCorrect ? 'correct!' : 'incorrect. Try again!'}`)
        if (!isCorrect) setGuess('')
        break;
      }
    }
  }

  return (
    <Card className="p-4 mb-2 bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
      <div className="flex gap-3">
        <Avatar className="border-2 border-gray-700">
          <img src={polyhedraSymbol} alt={author} className="w-full h-full object-cover" />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{author}</span>
            <span className="text-gray-400">{handle}</span>
          </div>
          
          {(() => {
            switch (type) {
              case 'classical':
                return renderClassicalPost(props as ClassicalPost);
              case 'selection':
                return renderSelectionPost(props as SelectionPost);
              case 'cloze':
                return renderClozePost(props as ClozePost);
            }
          })()}

          <div className="flex gap-6 mt-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10">
              <MessageCircle className="w-4 h-4 mr-1" />
              {comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 hover:bg-green-400/10">
              <Repeat2 className="w-4 h-4 mr-1" />
              {reposts}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 hover:bg-red-400/10">
              <Heart className="w-4 h-4 mr-1" />
              {likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400 hover:bg-purple-400/10">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
