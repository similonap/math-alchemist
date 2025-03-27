"use client"

import { motion } from "framer-motion"

interface LevelBadgeProps {
  level: number
  size?: "normal" | "large"
}

export function LevelBadge({ level, size = "normal" }: LevelBadgeProps) {
  const isLarge = size === "large"

  return (
    <motion.div
      className={`relative ${isLarge ? "w-24 h-24" : "w-12 h-12"} flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer ring */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 ${isLarge ? "p-1.5" : "p-0.5"}`}
      >
        {/* Inner circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-900 to-purple-900">
          {/* Shine effect */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"
            style={{ clipPath: "polygon(0 0, 50% 0, 100% 50%, 50% 100%, 0 100%, 0 0)" }}
          ></div>
        </div>
      </div>

      {/* Level number */}
      <span className={`relative z-10 font-bold ${isLarge ? "text-3xl" : "text-lg"} text-purple-200`}>{level}</span>
    </motion.div>
  )
}

