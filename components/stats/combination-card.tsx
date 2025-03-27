"use client"

import { Trophy, CheckCircle, XCircle } from "lucide-react"
import type { CombinationStats } from "@/types"

interface CombinationCardProps {
  topNumber: number
  leftNumber: number
  rightNumber: number
  stats?: CombinationStats
}

export function CombinationCard({ topNumber, leftNumber, rightNumber, stats }: CombinationCardProps) {
  // Determine card color based on mastery status
  let bgColor = "bg-gray-700/50" // Not encountered
  let borderColor = "border-gray-600/30"
  let statusIcon = <XCircle className="w-5 h-5 text-gray-400" />
  let statusText = "Not Encountered"

  if (stats) {
    if (stats.mastered) {
      bgColor = "bg-green-700/50"
      borderColor = "border-green-600/30"
      statusIcon = <Trophy className="w-5 h-5 text-yellow-400" />
      statusText = "Mastered"
    } else if (stats.correctCount > 0) {
      bgColor = "bg-yellow-700/50"
      borderColor = "border-yellow-600/30"
      statusIcon = <CheckCircle className="w-5 h-5 text-yellow-300" />
      statusText = "In Progress"
    } else {
      bgColor = "bg-red-700/50"
      borderColor = "border-red-600/30"
      statusIcon = <XCircle className="w-5 h-5 text-red-400" />
      statusText = "Attempted"
    }
  }

  return (
    <div className={`${bgColor} rounded-lg p-3 border ${borderColor}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-bold text-purple-200">
          {leftNumber} + {rightNumber} = {topNumber}
        </div>
        {statusIcon}
      </div>
      <div className="text-xs text-purple-300">{statusText}</div>
      {stats && (
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
          <div className="text-green-300">Correct: {stats.correctCount}</div>
          <div className="text-red-300">Wrong: {stats.wrongCount}</div>
          <div className="text-yellow-300">Streak: {stats.streakCount}</div>
          <div className="text-purple-300">Mastered: {stats.mastered ? "Yes" : "No"}</div>
        </div>
      )}
    </div>
  )
}

