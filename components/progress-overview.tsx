"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { useGameStore } from "@/lib/store"
import { Trophy, CheckCircle, Circle, HelpCircle, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"
import type { CombinationStats } from "@/types"
import { DiplomaDialog } from "./dialogs/diploma-dialog"

export function ProgressOverview() {
  const { maxSum, combinationStats, diplomas } = useGameStore()
  const [selectedDiploma, setSelectedDiploma] = useState<null | {
    name: string
    level: number
    date: string
  }>(null)
  const [showDiplomaDialog, setShowDiplomaDialog] = useState(false)

  // Generate all possible combinations for the current maxSum
  const combinations: { top: number; left: number; right: number; key: string; stats: CombinationStats | null }[] = []

  // Loop through all possible top numbers from 2 to maxSum
  for (let top = 2; top <= maxSum; top++) {
    // For each top number, loop through all possible left numbers from 1 to top-1
    for (let left = 1; left < top; left++) {
      const right = top - left
      const key = `${top}-${left}-${right}`

      // Get stats for this combination if it exists
      const stats = combinationStats[key] || null

      combinations.push({
        top,
        left,
        right,
        key,
        stats,
      })
    }
  }

  // Group combinations by top number
  const combinationsByTop: Record<number, typeof combinations> = {}
  combinations.forEach((combo) => {
    if (!combinationsByTop[combo.top]) {
      combinationsByTop[combo.top] = []
    }
    combinationsByTop[combo.top].push(combo)
  })

  // Calculate overall mastery percentage
  const totalCombinations = combinations.length
  const masteredCombinations = combinations.filter((combo) => combo.stats?.mastered).length
  const masteryPercentage = totalCombinations > 0 ? Math.round((masteredCombinations / totalCombinations) * 100) : 0

  // Inside the component, after the masteryPercentage calculation, get the diploma info
  const { allCombinationsMastered } = useGameStore()

  const handleDiplomaClick = (diploma: { name: string; level: number; date: string }) => {
    setSelectedDiploma(diploma)
    setShowDiplomaDialog(true)
  }

  return (
    <>
      <Card className="bg-indigo-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-500/30 h-full overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-200 text-center">Progress Overview</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <p className="text-purple-300">
              <span className="font-bold text-yellow-400">{masteredCombinations}</span> of{" "}
              <span className="font-bold">{totalCombinations}</span> combinations mastered ({masteryPercentage}%)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {Object.keys(combinationsByTop).map((topStr) => {
            const top = Number.parseInt(topStr)
            const combosForTop = combinationsByTop[top]

            return (
              <div key={top} className="bg-indigo-800/50 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-200 mb-3">Sum: {top}</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {combosForTop.map((combo) => {
                    // Determine the status and color of the cell
                    let bgColor = "bg-purple-900/50" // Default: not encountered
                    let icon = <HelpCircle className="w-4 h-4 text-purple-400" />
                    let statusText = "Not seen"

                    if (combo.stats) {
                      if (combo.stats.mastered) {
                        bgColor = "bg-green-800/50"
                        icon = <CheckCircle className="w-4 h-4 text-green-400" />
                        statusText = "Mastered"
                      } else if (combo.stats.correctCount > 0) {
                        bgColor = "bg-yellow-800/50"
                        icon = <Circle className="w-4 h-4 text-yellow-400" />
                        statusText = "In progress"
                      } else {
                        bgColor = "bg-red-900/50"
                        icon = <Circle className="w-4 h-4 text-red-400" />
                        statusText = "Attempted"
                      }
                    }

                    return (
                      <motion.div
                        key={combo.key}
                        className={`${bgColor} rounded-lg p-3 border border-purple-500/30 flex flex-col items-center`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="text-lg font-bold text-purple-200 mb-1">
                          {combo.left} + {combo.right} = {combo.top}
                        </div>

                        <div className="flex items-center gap-1 text-xs">
                          {icon}
                          <span className="text-purple-300">{statusText}</span>
                        </div>

                        {combo.stats && (
                          <div className="mt-2 text-xs text-purple-400">
                            <div>Correct: {combo.stats.correctCount}</div>
                            <div>Wrong: {combo.stats.wrongCount}</div>
                            <div>Streak: {combo.stats.currentStreak}</div>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {allCombinationsMastered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-800/50 rounded-lg p-4 border border-yellow-500/30 mt-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-yellow-300">Achievement Unlocked!</h3>
            </div>
            <p className="text-yellow-200 mb-4">
              Congratulations! You have mastered all number combinations up to {maxSum}. Visit the Magic Shop to claim
              your diploma!
            </p>
          </motion.div>
        )}

        {diplomas.length > 0 && (
          <div className="bg-indigo-800/50 rounded-lg p-4 border border-purple-500/30 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-purple-200">Your Diplomas</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {diplomas
                .sort((a, b) => a.level - b.level) // Sort diplomas by level
                .map((diploma, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 rounded-lg p-3 border border-yellow-600/30 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    onClick={() => handleDiplomaClick(diploma)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-yellow-300">{diploma.name}</span>
                      <span className="text-yellow-200 text-sm">Level {diploma.level}</span>
                    </div>
                    <div className="text-xs text-yellow-400">{new Date(diploma.date).toLocaleDateString()}</div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </Card>

      {/* Add DiplomaDialog for viewing existing diplomas */}
      <DiplomaDialog
        isOpen={showDiplomaDialog}
        onClose={() => setShowDiplomaDialog(false)}
        onConfirm={() => {}} // Not needed for viewing
        maxSum={maxSum}
        existingDiploma={selectedDiploma}
      />
    </>
  )
}

