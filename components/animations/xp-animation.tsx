"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ZapOff } from "lucide-react"

interface XPAnimationProps {
  showGain: boolean
  showLoss: boolean
  gainAmount: number
  lossAmount: number
  gainPosition: { x: number; y: number }
  lossPosition: { x: number; y: number }
}

export function XPAnimation({
  showGain,
  showLoss,
  gainAmount,
  lossAmount,
  gainPosition,
  lossPosition,
}: XPAnimationProps) {
  return (
    <>
      {/* XP Gain Animation */}
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
              y: -100,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="text-yellow-300 font-bold text-xl flex items-center"
          >
            +{gainAmount} XP <Sparkles className="ml-1 w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Loss Animation */}
      <AnimatePresence>
        {showLoss && (
          <motion.div
            initial={{
              opacity: 0,
              y: 0,
              x: lossPosition.x,
              position: "fixed",
              top: lossPosition.y,
              left: 0,
              zIndex: 100,
              pointerEvents: "none",
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -100,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="text-red-400 font-bold text-xl flex items-center"
          >
            -{lossAmount} XP <ZapOff className="ml-1 w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

