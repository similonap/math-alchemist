"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

interface NumberInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isCorrect: boolean | null
  isShaking: boolean
  placeholder?: string
  maxLength?: number
  autoFocus?: boolean
}

export function NumberInput({
  value,
  onChange,
  onKeyDown,
  isCorrect,
  isShaking,
  placeholder = "?",
  maxLength = 2,
  autoFocus = true,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const newValue = e.target.value.replace(/[^0-9]/g, "")
    onChange(newValue)
  }

  const inputElement = (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      className={`w-16 h-16 text-center text-2xl font-bold bg-indigo-800/50 border-purple-500/50 text-purple-200 ${
        isCorrect === false ? "border-red-500 bg-red-900/30" : ""
      } ${isCorrect === true ? "border-green-500 bg-green-900/30" : ""}`}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus={autoFocus}
    />
  )

  if (isShaking) {
    return (
      <motion.div animate={{ x: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
        {inputElement}
      </motion.div>
    )
  }

  return inputElement
}

