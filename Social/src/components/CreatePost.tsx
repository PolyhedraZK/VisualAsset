/** @jsxImportSource react */
import * as React from 'react'
import { Card } from "../components/ui/card"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Input } from "../components/ui/input"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import type { PostOption } from '../types/post'

// Use Web Crypto API for hashing
const generateHash = async (text: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface CreatePostOption extends PostOption {
  isCorrect?: boolean;
}

export default function CreatePost() {
  const [content, setContent] = React.useState("")
  const [isSelection, setIsSelection] = React.useState(false)
  const [isCloze, setIsCloze] = React.useState(false)
  const [options, setOptions] = React.useState<CreatePostOption[]>([
    { text: "", odds: 2.5, isCorrect: false },
    { text: "", odds: 1.8, isCorrect: false }
  ])
  const [showOptions, setShowOptions] = React.useState(false)

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], text: value }
    setOptions(newOptions)
  }

  const handleCorrectOptionChange = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }))
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, { text: "", odds: 1.5, isCorrect: false }])
  }

  const handlePost = async () => {
    if (!content.trim()) {
      alert("Please enter some content for your post");
      return;
    }

    const basePost = {
      id: Date.now(),
      author: "User", // TODO: Replace with actual user
      handle: "@user",
      likes: 0,
      comments: 0,
      reposts: 0,
    };

    try {
      // Create base post with content
      const post = {
        ...basePost,
        type: "classical" as const,
        content,
      };

      // Add selection features if enabled
      if (isSelection) {
        const correctOption = options.find(opt => opt.isCorrect);
        if (!correctOption) {
          alert("Please select a correct option for your selection post");
          return;
        }
        if (options.some(opt => !opt.text.trim())) {
          alert("Please fill in all options");
          return;
        }
        Object.assign(post, {
          type: "selection" as const,
          commitment: await generateHash(correctOption.text),
          options: options.map(({ text, odds }) => ({ text, odds: odds || 1 })),
        });
      }

      // Add cloze features if enabled
      if (isCloze) {
        const hiddenParts = content.match(/\[(.*?)\]/g);
        if (!hiddenParts) {
          alert("Please add hidden content using [brackets] in your message");
          return;
        }
        const extractedParts = hiddenParts.map(part => part.slice(1, -1));
        if (extractedParts.some(part => !part.trim())) {
          alert("Hidden parts cannot be empty");
          return;
        }
        Object.assign(post, {
          type: "cloze" as const,
          commitment: await generateHash(extractedParts.join('')),
          hiddenParts: extractedParts,
        });
      }

      console.log("Created post:", post);
      // Reset form
      setContent("");
      setIsSelection(false);
      setIsCloze(false);
      setShowOptions(false);
      setOptions([
        { text: "", odds: 2.5, isCorrect: false },
        { text: "", odds: 1.8, isCorrect: false }
      ]);
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  }

  return (
    <Card className="p-4 bg-gray-900 border-gray-800">
      <div className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder={isCloze ? "What's happening? Use [brackets] to hide parts of your message" : "What's happening?"}
            value={content}
            onChange={(e) => {
              const newContent = e.target.value;
              setContent(newContent);
              
              // Preview hidden parts for cloze mode
              if (isCloze) {
                const hiddenParts = newContent.match(/\[(.*?)\]/g);
                if (hiddenParts) {
                  console.log("Hidden parts:", hiddenParts.map(part => part.slice(1, -1)));
                }
              }
            }}
            className="min-h-[100px] bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500"
          />
          {isCloze && content.includes('[') && (
            <div className="text-sm text-gray-400">
              Preview: {content.replace(/\[(.*?)\]/g, '[•••]')}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
          <div className="flex items-center space-x-2">
            <Label htmlFor="selection-mode" className="text-gray-400">Selection Mode</Label>
            <Switch
              id="selection-mode"
              checked={isSelection}
              onCheckedChange={(checked) => {
                if (isCloze && checked) {
                  setIsCloze(false);
                }
                setIsSelection(checked);
                setShowOptions(checked);
                if (!checked) {
                  setOptions([
                    { text: "", odds: 2.5, isCorrect: false },
                    { text: "", odds: 1.8, isCorrect: false }
                  ]);
                }
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="cloze-mode" className="text-gray-400">Cloze Mode</Label>
            <Switch
              id="cloze-mode"
              checked={isCloze}
              onCheckedChange={(checked) => {
                if (isSelection && checked) {
                  setIsSelection(false);
                  setShowOptions(false);
                }
                setIsCloze(checked);
              }}
            />
          </div>
        </div>

        {isSelection && showOptions && (
          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 bg-gray-800 border-gray-700 text-gray-100"
                />
                <div className="flex items-center space-x-2">
                  <RadioGroup value={option.isCorrect ? "true" : "false"}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="true"
                        id={`correct-${index}`}
                        onClick={() => handleCorrectOptionChange(index)}
                      />
                      <Label htmlFor={`correct-${index}`} className="text-gray-400">Correct</Label>
                    </div>
                  </RadioGroup>
                  <Input
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder="Odds"
                    value={option.odds}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = { 
                        ...newOptions[index], 
                        odds: Math.max(1, parseFloat(e.target.value) || 1)
                      };
                      setOptions(newOptions);
                    }}
                    className="w-24 bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addOption}
              className="w-full border-dashed"
            >
              Add Option
            </Button>
          </div>
        )}

        {isCloze && (
          <div className="p-2 bg-gray-800 rounded border border-gray-700">
            <p className="text-sm text-gray-400">
              Use [brackets] to hide parts of your message.
              Example: "The next milestone will be [zkBridge v2]"
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handlePost}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Post
          </Button>
        </div>
      </div>
    </Card>
  )
}
