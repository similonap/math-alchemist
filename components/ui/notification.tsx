"use client"

import { motion, AnimatePresence } from "framer-motion"

interface NotificationProps {
  message: string | null
  type?: "success" | "error" | "info"
}

export function Notification({ message, type = "info" }: NotificationProps) {
  if (!message) return null

  const bgColors = {
    success: "bg-green-800",
    error: "bg-red-800",
    info: "bg-purple-800",
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 ${bgColors[type]} text-purple-200 px-6 py-3 rounded-lg shadow-lg z-50`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

