"use client"

import { Trophy } from "lucide-react"
import { useGameStore } from "@/lib/store"
import { motion } from "framer-motion"

export function MasteryProgress() {
  const { combinationStats, maxSum, getMasteredCombinationsCount } = useGameStore()

  // Calculate total possible combinations
  const totalPossible = maxSum <= 1 ? 0 : (maxSum * (maxSum - 1)) / 2

  // Get mastered count
  const masteredCount = getMasteredCombinationsCount()

  // Calculate percentage
  const percentage = totalPossible > 0 ? (masteredCount / totalPossible) * 100 : 0

  return (
    <div className="bg-purple-900/50 text-purple-300 px-3 py-2 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <Trophy className="w-4 h-4 text-yellow-400" />
        <span className="font-semibold">Mastery Progress</span>
      </div>

      <div className="h-2 bg-purple-800 rounded-full overflow-hidden">
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(to right, #eab308, #fde047)'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between text-xs mt-1">
        <span>{masteredCount} mastered</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}

