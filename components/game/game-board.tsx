"use client"

import type React from "react"

import { NumberDisplay } from "./number-display"
import { NumberInput } from "./number-input"

interface GameBoardProps {
  topNumber: number
  leftNumber: number
  rightNumber: number
  hiddenSide: "left" | "right"
  userInput: string
  isCorrect: boolean | null
  isShaking: boolean
  onInputChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function GameBoard({
  topNumber,
  leftNumber,
  rightNumber,
  hiddenSide,
  userInput,
  isCorrect,
  isShaking,
  onInputChange,
  onKeyDown,
}: GameBoardProps) {
  return (
    <div>
      {/* Top number */}
      <div className="flex justify-center mb-4">
        <NumberDisplay value={topNumber} variant="primary" />
      </div>

      {/* Tree branches */}
      <div className="relative h-16 mb-4">
        <div className="absolute left-1/2 top-0 w-0.5 h-8 bg-purple-400/50 -translate-x-1/2"></div>
        <div className="absolute left-1/4 top-8 w-1/2 h-0.5 bg-purple-400/50"></div>
        <div className="absolute left-1/4 top-8 w-0.5 h-8 bg-purple-400/50"></div>
        <div className="absolute left-3/4 top-8 w-0.5 h-8 bg-purple-400/50 -translate-x-full"></div>
      </div>

      {/* Bottom numbers */}
      <div className="flex justify-around mb-8">
        <div className="relative">
          {hiddenSide === "left" ? (
            <NumberInput
              value={userInput}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              isCorrect={isCorrect}
              isShaking={isShaking}
            />
          ) : (
            <NumberDisplay value={leftNumber} variant="secondary" />
          )}
        </div>
        <div>
          {hiddenSide === "right" ? (
            <NumberInput
              value={userInput}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              isCorrect={isCorrect}
              isShaking={isShaking}
            />
          ) : (
            <NumberDisplay value={rightNumber} variant="secondary" />
          )}
        </div>
      </div>
    </div>
  )
}

