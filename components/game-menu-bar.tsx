"use client"

import { Coins, FlaskRoundIcon as Flask, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/lib/store"
import { motion } from "framer-motion"

interface GameMenuBarProps {
  activeView: "game" | "store" | "progress"
  onChangeView: (view: "game" | "store" | "progress") => void
}

export function GameMenuBar({ activeView, onChangeView }: GameMenuBarProps) {
  const { coins, labName } = useGameStore()

  return (
    <div className="bg-indigo-900/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-purple-500/30 mb-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Flask className="w-5 h-5 text-purple-300" />
        <h1 className="text-purple-200 font-bold hidden sm:block">{labName}</h1>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeView === "game" ? "default" : "outline"}
          onClick={() => onChangeView("game")}
          className={
            activeView === "game"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-purple-100 border-none shadow-md shadow-purple-900/30 font-medium"
              : "border-purple-500/50 text-purple-200 hover:bg-purple-800/30 hover:text-purple-100"
          }
        >
          <Flask className="w-4 h-4 mr-2" /> Play Game
        </Button>
        <Button
          variant={activeView === "store" ? "default" : "outline"}
          onClick={() => onChangeView("store")}
          className={
            activeView === "store"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-purple-100 border-none shadow-md shadow-purple-900/30 font-medium"
              : "border-purple-500/50 text-purple-200 hover:bg-purple-800/30 hover:text-purple-100"
          }
        >
          <Coins className="w-4 h-4 mr-2" /> Magic Shop
        </Button>
        <Button
          variant={activeView === "progress" ? "default" : "outline"}
          onClick={() => onChangeView("progress")}
          className={
            activeView === "progress"
              ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-green-100 border-none shadow-md shadow-green-900/30 font-medium"
              : "border-purple-500/50 text-purple-200 hover:bg-purple-800/30 hover:text-purple-100"
          }
        >
          <BarChart className="w-4 h-4 mr-2" /> Progress
        </Button>
      </div>

      <motion.div
        className="flex items-center gap-2 bg-yellow-900/50 px-4 py-2 rounded-full"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        key={coins} // This makes the animation trigger when coins change
      >
        <Coins className="w-5 h-5 text-yellow-400" />
        <span className="font-bold text-yellow-400">{coins}</span>
      </motion.div>
    </div>
  )
}

