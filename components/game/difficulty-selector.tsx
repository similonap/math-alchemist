"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DifficultySelectorProps {
  maxSum: number
  onSetMaxSum: (value: number) => void
}

export function DifficultySelector({ maxSum, onSetMaxSum }: DifficultySelectorProps) {
  const [customValue, setCustomValue] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "")
    setCustomValue(value)
  }

  const handleCustomSubmit = () => {
    const value = Number.parseInt(customValue)
    if (value >= 5) {
      onSetMaxSum(value)
      setShowCustomInput(false)
      setCustomValue("")
    } else {
      alert("Please enter a number 5 or greater")
    }
  }

  return (
    <div className="mb-6">
      <h2 className="text-center font-bold text-lg mb-3 text-purple-200">Choose Maximum Number</h2>
      <div className="flex gap-2 justify-center mb-2">
        <Button
          onClick={() => onSetMaxSum(10)}
          className={`px-6 py-2 ${maxSum === 10 ? "bg-pink-500 hover:bg-pink-600" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          10
        </Button>
        <Button
          onClick={() => onSetMaxSum(20)}
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
            className="w-20 text-center bg-indigo-800/50 border-purple-500/50 text-purple-200"
            placeholder="Enter"
            maxLength={3}
          />
          <Button onClick={handleCustomSubmit} className="bg-yellow-500 hover:bg-yellow-600">
            Set
          </Button>
        </div>
      )}
    </div>
  )
}

