"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Coins } from "lucide-react"

interface CoinAnimationProps {
  showGain: boolean
  showStreak: boolean
  gainAmount: number
  gainPosition: { x: number; y: number }
  streakPosition: { x: number; y: number }
}

export function CoinAnimation({ showGain, showStreak, gainAmount, gainPosition, streakPosition }: CoinAnimationProps) {
  return (
    <>
      {/* Coin Gain Animation */}
      <AnimatePresence>
        {showGain && (
          <motion.div
            initial={{
              opacity: 0,
              y: 0,
              x: gainPosition.x,
              position: "fixed",
              top: gainPosition.y,
              left: 0,
              zIndex: 100,
              pointerEvents: "none",
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -50,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="text-yellow-400 font-bold text-xl flex items-center"
          >
            +{gainAmount} <Coins className="ml-1 w-5 h-5 text-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special Coin Animation for Streak */}
      <AnimatePresence>
        {showStreak && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              top: streakPosition.y,
              left: streakPosition.x,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <div className="relative">
              {/* Coin burst animation */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.cos((i * 45 * Math.PI) / 180) * 100,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 100,
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                  }}
                  className="absolute top-0 left-0"
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                    <Coins className="w-5 h-5 text-yellow-800" />
                  </div>
                </motion.div>
              ))}

              {/* Center message */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2 }}
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-600 to-yellow-400 px-4 py-2 rounded-lg shadow-lg"
              >
                <p className="text-yellow-900 font-bold whitespace-nowrap">Streak Bonus! +2 Coins</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

