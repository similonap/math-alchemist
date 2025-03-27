"use client"

import { useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReusableDialogProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  className?: string
  showCloseButton?: boolean
}

export function ReusableDialog({
  isOpen,
  onClose,
  children,
  title,
  className = "",
  showCloseButton = true,
}: ReusableDialogProps) {
  // Close on escape key and prevent background scrolling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape)

      // Prevent scrolling of the background when dialog is open
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = "hidden"

      return () => {
        window.removeEventListener("keydown", handleEscape)
        // Restore original overflow style when dialog closes
        document.body.style.overflow = originalStyle
      }
    }

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 0 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 0 }}
            className={`bg-gradient-to-b from-indigo-800 to-purple-900 rounded-xl p-6 shadow-lg border border-purple-500/50 max-h-[90vh] overflow-auto relative ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {showCloseButton && (
              <Button
                onClick={onClose}
                className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center text-purple-200"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            {title && <h2 className="text-xl font-bold text-purple-200 mb-4">{title}</h2>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

