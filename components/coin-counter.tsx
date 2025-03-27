"use client"

import { motion } from "framer-motion"
import { Coins } from "lucide-react"

interface CoinCounterProps {
  coins: number
  id?: string
}

export function CoinCounter({ coins, id }: CoinCounterProps) {
  return (
    <motion.div
      id={id}
      className="flex items-center gap-1 bg-yellow-900/50 px-3 py-1 rounded-full"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      key={coins} // This makes the animation trigger when coins change
    >
      <Coins className="w-4 h-4 text-yellow-400" />
      <span className="font-bold text-yellow-400">{coins}</span>
    </motion.div>
  )
}

