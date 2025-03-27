"use client"

import { motion } from "framer-motion"
import { Coins, Trophy, Star } from "lucide-react"
import { LevelBadge } from "@/components/level-badge"
import { Dialog } from "@/components/ui/dialog"

interface LevelUpDialogProps {
  isOpen: boolean
  onClose: () => void
  newLevel: number
  maxSum: number
}

export function LevelUpDialog({ isOpen, onClose, newLevel, maxSum }: LevelUpDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="p-8 border-2 border-purple-400 max-w-md">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center text-purple-200"
        aria-label="Close"
      >
        ✕
      </button>
      <motion.div
        animate={{
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.2, 1.1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className="mb-4 flex justify-center"
      >
        <Trophy className="w-20 h-20 text-yellow-400" />
      </motion.div>

      <h2 className="text-3xl font-bold text-purple-200 mb-2 text-center">Level Up!</h2>
      <p className="text-xl text-purple-300 mb-2 text-center">You reached level {newLevel}!</p>
      <p className="text-lg text-yellow-400 mb-6 flex items-center justify-center">
        <Coins className="w-5 h-5 mr-2" /> +{newLevel * 5} coins
      </p>

      <div className="relative flex justify-center mb-6">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 2],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                rotate: i * 45,
                x: 0,
                y: 0,
              }}
              animate={{
                x: Math.cos((i * 45 * Math.PI) / 180) * 80,
                y: Math.sin((i * 45 * Math.PI) / 180) * 80,
                opacity: [1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.1,
              }}
            >
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </motion.div>

        <LevelBadge level={newLevel} size="large" />
      </div>

      <p className="text-center text-purple-300">Current max number: {maxSum}</p>
    </Dialog>
  )
}

