"use client"

import { Button } from "@/components/ui/button"
import { Trophy, FlaskRoundIcon as Flask } from "lucide-react"
import { XPBar } from "@/components/xp-bar"
import { LevelBadge } from "@/components/level-badge"
import { useGameStore } from "@/lib/store"

export function LevelSidebar() {
  const { currentXp, level, isLevelingUp, xpThreshold, streakCount, resetGame, labName } = useGameStore()

  return (
    <div className="bg-indigo-900/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-500/30 flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Flask className="w-4 h-4 text-purple-300" />
          <h2 className="text-sm font-medium text-purple-300 text-center truncate">{labName}</h2>
        </div>
        <h2 className="text-xl font-bold text-purple-200 text-center">Magical Level</h2>
      </div>

      <div className="flex flex-col items-center mb-4">
        <LevelBadge level={level} />
        <div className="mt-2 text-center">
          <p className="text-sm text-purple-300">
            {currentXp} / {xpThreshold} XP
          </p>
        </div>
      </div>

      {/* Vertical XP Bar */}
      <div className="flex-grow relative mx-auto w-12 mb-4">
        <XPBar currentXp={currentXp} maxXp={xpThreshold} isLevelingUp={isLevelingUp} />
      </div>

      <div className="space-y-3">
        <div className="bg-purple-900/50 text-purple-300 px-3 py-2 rounded-lg text-sm">
          <span className="font-semibold">Streak:</span> {streakCount}
        </div>

        <Button
          onClick={resetGame}
          variant="outline"
          size="sm"
          className="w-full text-xs bg-red-900/30 text-red-300 border-red-800/50 hover:bg-red-800/50 hover:text-red-200"
        >
          <Trophy className="w-3 h-3 mr-1" /> Reset Progress
        </Button>
      </div>
    </div>
  )
}

