"use client"

import { useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Dialog({ isOpen, onClose, children, className = "" }: DialogProps) {
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
            className={`bg-gradient-to-b from-indigo-800 to-purple-900 rounded-xl p-6 shadow-lg border border-purple-500/50 max-h-[90vh] overflow-auto ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const DialogTrigger = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export const DialogContent = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export const DialogHeader = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export const DialogFooter = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export const DialogTitle = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export const DialogDescription = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export const DialogClose = () => {
  return null
}

export const DialogOverlay = () => {
  return null
}

export const DialogPortal = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

