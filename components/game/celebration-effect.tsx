"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Unicorn } from "../icons/unicorn"

interface CelebrationEffectProps {
  show: boolean
  unicornMode?: boolean
  count?: number
}

export function CelebrationEffect({ show, unicornMode = false, count = 10 }: CelebrationEffectProps) {
  if (!show) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
          }}
          animate={{
            y: -100,
            x: Math.random() * window.innerWidth,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 0.5,
          }}
          className="absolute"
        >
          {unicornMode ? (
            <Unicorn className="w-8 h-8 text-pink-400" />
          ) : (
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          )}
        </motion.div>
      ))}
    </div>
  )
}

