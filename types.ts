// types.ts

export interface GameState {
  version: number
  level: number
  currentXp: number
  xpThreshold: number
  exercisesCompleted: number
  mistakesMade: number
  maxSum: number
  streakCount: number
  coins: number
  savedAt: string
}

// Add this new interface for tracking combination statistics
export interface CombinationStats {
  correctCount: number
  wrongCount: number
  currentStreak: number
  mastered: boolean
}

// Define the combination key format
export type CombinationKey = string // Format: "topNumber-leftNumber-rightNumber"

