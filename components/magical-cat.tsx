"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function MagicalCat() {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [target, setTarget] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [isResting, setIsResting] = useState(false)
  const [facingLeft, setFacingLeft] = useState(false)

  // Initialize position
  useEffect(() => {
    // Start from the center of the screen
    const startPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    setPosition(startPos)

    // Set initial target
    pickNewTarget()

    // Log to confirm the component is mounting
    console.log("MagicalCat component mounted")
  }, [])

  // Pick a new random target position
  const pickNewTarget = () => {
    // Avoid the very edges of the screen
    const padding = 100
    const newTarget = {
      x: padding + Math.random() * (window.innerWidth - padding * 2),
      y: padding + Math.random() * (window.innerHeight - padding * 2),
    }
    setTarget(newTarget)

    // Update facing direction
    if (newTarget.x < position.x) {
      setFacingLeft(true)
    } else {
      setFacingLeft(false)
    }

    // Reset resting state
    setIsResting(false)

    // Log to confirm new target is being set
    console.log("New cat target:", newTarget)
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // If cat is outside the window after resize, bring it back in
      const newPosition = { ...position }
      if (position.x > window.innerWidth) newPosition.x = window.innerWidth - 100
      if (position.y > window.innerHeight) newPosition.y = window.innerHeight - 100
      setPosition(newPosition)

      // Also update target if needed
      const newTarget = { ...target }
      if (target.x > window.innerWidth) newTarget.x = window.innerWidth - 100
      if (target.y > window.innerHeight) newTarget.y = window.innerHeight - 100
      setTarget(newTarget)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [position, target])

  // Rest for a while, then pick a new target
  const handleRest = () => {
    setIsResting(true)

    // After resting, pick a new target
    const restDuration = 2000 + Math.random() * 3000 // 2-5 seconds
    setTimeout(pickNewTarget, restDuration)
  }

  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none"
      initial={{ x: position.x, y: position.y }}
      animate={{
        x: target.x,
        y: target.y,
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 2,
        onComplete: handleRest,
      }}
    >
      <motion.div
        animate={{
          scaleX: facingLeft ? -1 : 1,
        }}
      >
        <motion.div
          animate={
            isResting
              ? {
                  y: [0, -3, 0, -3, 0],
                  rotate: [0, -2, 0, 2, 0],
                }
              : {
                  y: [0, -5, 0],
                  rotate: [0, -1, 0, 1, 0],
                }
          }
          transition={{
            duration: isResting ? 4 : 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          <svg
            width="60"
            height="40"
            viewBox="0 0 60 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
            style={{ filter: "drop-shadow(0px 0px 8px rgba(139, 92, 246, 0.7))" }}
          >
            {/* Cat body */}
            <ellipse cx="30" cy="28" rx="16" ry="12" fill="#8b5cf6" />

            {/* Cat head */}
            <circle cx="30" cy="16" r="10" fill="#8b5cf6" />

            {/* Cat ears */}
            <path d="M22 10L20 2L26 8L22 10Z" fill="#8b5cf6" />
            <path d="M38 10L40 2L34 8L38 10Z" fill="#8b5cf6" />

            {/* Cat face */}
            <circle cx="26" cy="14" r="1.5" fill="#fff" />
            <circle cx="34" cy="14" r="1.5" fill="#fff" />
            <circle cx="26" cy="14" r="0.5" fill="#000" />
            <circle cx="34" cy="14" r="0.5" fill="#000" />
            <path d="M30 17L28 19L30 18L32 19L30 17Z" fill="#ff9eb1" />

            {/* Cat tail */}
            <motion.path
              d="M46 28C50 28 54 24 54 20"
              stroke="#8b5cf6"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{
                d: isResting
                  ? ["M46 28C50 28 54 24 54 20", "M46 28C50 26 54 24 56 22", "M46 28C50 28 54 24 54 20"]
                  : ["M46 28C50 28 54 24 54 20", "M46 28C50 30 54 28 56 26", "M46 28C50 28 54 24 54 20"],
              }}
              transition={{
                duration: isResting ? 4 : 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />

            {/* Magical sparkles */}
            <motion.g
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <circle cx="36" cy="8" r="1" fill="#fff" />
              <circle cx="40" cy="16" r="1" fill="#fff" />
              <circle cx="38" cy="24" r="1" fill="#fff" />
              <circle cx="24" cy="8" r="1" fill="#fff" />
              <circle cx="20" cy="16" r="1" fill="#fff" />
              <circle cx="22" cy="24" r="1" fill="#fff" />
            </motion.g>
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

