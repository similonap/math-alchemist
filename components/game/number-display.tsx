"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NumberDisplayProps {
  value: number
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  className?: string
  animate?: boolean
  isShaking?: boolean
}

export function NumberDisplay({
  value,
  variant = "primary",
  size = "md",
  className,
  animate = false,
  isShaking = false,
}: NumberDisplayProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-xl",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl",
  }

  const variantClasses = {
    primary: "bg-purple-600 text-white",
    secondary: "bg-indigo-600 text-white",
  }

  const baseClasses = "rounded-full flex items-center justify-center font-bold"

  const content = <div className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}>{value}</div>

  if (animate && isShaking) {
    return (
      <motion.div animate={{ x: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
        {content}
      </motion.div>
    )
  }

  return content
}

