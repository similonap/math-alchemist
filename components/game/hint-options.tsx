"use client"

import { motion } from "framer-motion"

interface HintOptionsProps {
  options: number[]
  onSelect: (value: number) => void
  isDisabled?: boolean
}

export function HintOptions({ options, onSelect, isDisabled = false }: HintOptionsProps) {
  return (
    <div className="flex justify-around gap-4">
      {options.map((option, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`w-16 h-16 rounded-md flex items-center justify-center text-white text-2xl font-bold transition-colors ${
            isDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
          }`}
          onClick={() => !isDisabled && onSelect(option)}
        >
          {option}
        </motion.div>
      ))}
    </div>
  )
}

