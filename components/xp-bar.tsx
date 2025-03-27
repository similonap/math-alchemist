"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, FlaskRoundIcon as Flask } from "lucide-react"
import { useGameStore } from "@/lib/store"

interface XPBarProps {
  currentXp: number
  maxXp: number
  isLevelingUp: boolean
}

export function XPBar({ currentXp, maxXp, isLevelingUp }: XPBarProps) {
  const [bubbles, setBubbles] = useState<{ id: number; size: number; left: number; delay: number; duration: number }[]>(
    [],
  )
  const progress = Math.min((currentXp / maxXp) * 100, 100)
  const { getCurrentFluidColor } = useGameStore()
  const fluidColor = getCurrentFluidColor()

  // Generate bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      if (bubbles.length < 8) {
        setBubbles((prev) => [
          ...prev,
          {
            id: Date.now(),
            size: Math.random() * 6 + 3,
            left: Math.random() * 80 + 10,
            delay: Math.random() * 2,
            duration: Math.random() * 3 + 2,
          },
        ])
      }
    }, 500)

    return () => clearInterval(interval)
  }, [bubbles.length])

  // Remove bubbles that have completed their animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setBubbles((prev) => prev.slice(1))
    }, 5000)

    return () => clearTimeout(timeout)
  }, [bubbles])

  console.log(fluidColor);

  return (
    <div className="relative h-full w-full flex flex-col items-center">
      {/* Flask icon at the top */}
      <div className="mb-2">
        <Flask className="w-6 h-6 text-purple-300" />
      </div>

      {/* Alchemy tube container */}
      <div className="relative w-12 h-[calc(100%-2rem)] rounded-full overflow-hidden border-2 border-purple-300/50 bg-indigo-950/30 backdrop-blur-sm shadow-lg">
        {/* Glass tube effect - top rounded cap */}
        <div className="absolute top-0 left-0 right-0 h-6 rounded-t-full bg-indigo-950/30 border-b border-purple-300/20"></div>

        {/* Glass tube effect - bottom rounded cap */}
        <div className="absolute bottom-0 left-0 right-0 h-6 rounded-b-full bg-indigo-950/30 border-t border-purple-300/20"></div>

        {/* XP liquid */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: isLevelingUp 
              ? 'linear-gradient(to top, #ca8a04, #facc15)' 
              : fluidColor.background
          }}
          initial={{ height: `${progress}%` }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-white opacity-20 blur-sm"></div>

          {/* Bubbles */}
          <AnimatePresence>
            {bubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                className="absolute rounded-full bg-white/70"
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  left: `${bubble.left}%`,
                  bottom: "10%",
                }}
                initial={{ opacity: 0.7, y: 0 }}
                animate={{
                  opacity: [0.7, 0.9, 0.7, 0.5, 0],
                  y: [-20, -40, -60, -80],
                  x: [0, 5, -5, 3, -3],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: bubble.duration,
                  delay: bubble.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Measurement lines */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute w-4 h-0.5 bg-purple-300/50 left-0" style={{ bottom: `${(i + 1) * 20}%` }} />
        ))}

        {/* Measurement numbers */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[10px] text-purple-300/70 left-5"
            style={{ bottom: `calc(${(i + 1) * 20}% - 3px)` }}
          >
            {(i + 1) * 20}
          </div>
        ))}

        {/* Shine effect */}
        <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* Sparkle effects when leveling up */}
      {isLevelingUp && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                bottom: `${(i + 1) * 20}%`,
              }}
              animate={{
                x: [-5, 5, -5],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

