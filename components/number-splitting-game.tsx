"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

export function NumberSplittingGame() {
  const [topNumber, setTopNumber] = useState(0)
  const [leftNumber, setLeftNumber] = useState(0)
  const [rightNumber, setRightNumber] = useState(0)
  const [hiddenSide, setHiddenSide] = useState<"left" | "right">("left")
  const [userInput, setUserInput] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [exercisesCompleted, setExercisesCompleted] = useState(0)
  const [mistakesMade, setMistakesMade] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [maxSum, setMaxSum] = useState(10)
  const [customValue, setCustomValue] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Generate a new problem
  const generateProblem = () => {
    // Generate a random number between 5 and maxSum for the top number
    const newTopNumber = Math.floor(Math.random() * (maxSum - 4)) + 5

    // Generate a random number between 1 and (topNumber - 1) for one of the child numbers
    const newLeftNumber = Math.floor(Math.random() * (newTopNumber - 1)) + 1
    const newRightNumber = newTopNumber - newLeftNumber

    // Randomly decide which number to hide
    const newHiddenSide = Math.random() < 0.5 ? "left" : "right"

    setTopNumber(newTopNumber)
    setLeftNumber(newLeftNumber)
    setRightNumber(newRightNumber)
    setHiddenSide(newHiddenSide)
    setUserInput("")
    setIsCorrect(null)
  }

  // Initialize the game
  useEffect(() => {
    generateProblem()
  }, [])

  // Check the user's answer
  const checkAnswer = () => {
    const userAnswer = Number.parseInt(userInput)
    const correctAnswer = hiddenSide === "left" ? leftNumber : rightNumber

    if (userAnswer === correctAnswer) {
      setIsCorrect(true)
      setShowCelebration(true)
      setExercisesCompleted((prev) => prev + 1)

      // Generate a new problem after a short delay
      setTimeout(() => {
        setShowCelebration(false)
        generateProblem()
      }, 1500)
    } else {
      setIsCorrect(false)
      setIsShaking(true)
      setMistakesMade((prev) => prev + 1)

      // Stop shaking after animation completes
      setTimeout(() => {
        setIsShaking(false)
      }, 500)
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "")
    setUserInput(value)
    setIsCorrect(null)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput) {
      checkAnswer()
    }
  }

  const handleSetMaxSum = (value: number) => {
    setMaxSum(value)
    setShowCustomInput(false)
    setExercisesCompleted(0)
    setMistakesMade(0)
    setTimeout(() => {
      generateProblem()
    }, 100)
  }

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "")
    setCustomValue(value)
  }

  const handleCustomSubmit = () => {
    const value = Number.parseInt(customValue)
    if (value >= 5) {
      handleSetMaxSum(value)
    } else {
      alert("Please enter a number 5 or greater")
    }
  }

  return (
    <Card className="p-6 shadow-lg rounded-xl bg-white">
      <div className="mb-6">
        <h2 className="text-center font-bold text-lg mb-3">Choose Maximum Number</h2>
        <div className="flex gap-2 justify-center mb-2">
          <Button
            onClick={() => handleSetMaxSum(10)}
            className={`px-6 py-2 ${maxSum === 10 ? "bg-pink-500 hover:bg-pink-600" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            10
          </Button>
          <Button
            onClick={() => handleSetMaxSum(20)}
            className={`px-6 py-2 ${maxSum === 20 ? "bg-pink-500 hover:bg-pink-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            20
          </Button>
          <Button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600"
          >
            Custom
          </Button>
        </div>

        {showCustomInput && (
          <div className="flex gap-2 justify-center">
            <Input
              type="text"
              value={customValue}
              onChange={handleCustomInputChange}
              className="w-20 text-center"
              placeholder="Enter"
              maxLength={3}
            />
            <Button onClick={handleCustomSubmit} className="bg-yellow-500 hover:bg-yellow-600">
              Set
            </Button>
          </div>
        )}
      </div>
      {/* Score display */}
      <div className="flex justify-between mb-6 text-sm">
        <div className="bg-green-100 px-3 py-1 rounded-full">
          Completed: <span className="font-bold">{exercisesCompleted}</span>
        </div>
        <div className="bg-red-100 px-3 py-1 rounded-full">
          Mistakes: <span className="font-bold">{mistakesMade}</span>
        </div>
      </div>

      {/* Top number */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
          {topNumber}
        </div>
      </div>

      {/* Tree branches */}
      <div className="relative h-16 mb-4">
        <div className="absolute left-1/2 top-0 w-0.5 h-8 bg-gray-400 -translate-x-1/2"></div>
        <div className="absolute left-1/4 top-8 w-1/2 h-0.5 bg-gray-400"></div>
        <div className="absolute left-1/4 top-8 w-0.5 h-8 bg-gray-400"></div>
        <div className="absolute left-3/4 top-8 w-0.5 h-8 bg-gray-400 -translate-x-full"></div>
      </div>

      {/* Bottom numbers */}
      <div className="flex justify-around mb-8">
        <div className="relative">
          {hiddenSide === "left" ? (
            <motion.div animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.5 }}>
              <Input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className={`w-16 h-16 text-center text-2xl font-bold ${
                  isCorrect === false ? "border-red-500 bg-red-50" : ""
                } ${isCorrect === true ? "border-green-500 bg-green-50" : ""}`}
                placeholder="?"
                maxLength={2}
                autoFocus
              />
            </motion.div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold">
              {leftNumber}
            </div>
          )}
        </div>
        <div>
          {hiddenSide === "right" ? (
            <motion.div animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.5 }}>
              <Input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className={`w-16 h-16 text-center text-2xl font-bold ${
                  isCorrect === false ? "border-red-500 bg-red-50" : ""
                } ${isCorrect === true ? "border-green-500 bg-green-50" : ""}`}
                placeholder="?"
                maxLength={2}
                autoFocus
              />
            </motion.div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold">
              {rightNumber}
            </div>
          )}
        </div>
      </div>

      {/* Feedback message */}
      <div className="h-8 mb-4 text-center">
        {isCorrect === true && <p className="text-green-600 font-bold">Great job! That's correct! 🎉</p>}
        {isCorrect === false && <p className="text-red-500">Try again! You can do it! 💪</p>}
      </div>

      {/* Submit button */}
      <form onSubmit={handleSubmit} className="flex justify-center">
        <Button type="submit" className="px-8 py-2 text-lg rounded-full" disabled={!userInput}>
          Check Answer
        </Button>
      </form>

      {/* Celebration animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
              }}
              animate={{
                y: -100,
                x: Math.random() * window.innerWidth,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 0.5,
              }}
              className="absolute"
            >
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  )
}

