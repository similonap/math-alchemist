"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Beaker, Droplet, Clock, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface FluidMixingLabProps {
  fluidVialCounts: Record<string, number>
  selectedColors: {
    red: boolean
    blue: boolean
    yellow: boolean
  }
  activeColors: {
    red: boolean
    blue: boolean
    yellow: boolean
  }
  animatingColors: {
    red: boolean
    blue: boolean
    yellow: boolean
  }
  isAnimating: boolean
  fluidEffects: string
  remainingTime: number
  onSelectFluid: (color: "red" | "blue" | "yellow") => void
  onMixFluids: () => void
  getCurrentFluidColor: () => { background: string }
  getCurrentFluidColorName: () => string
}

export function FluidMixingLab({
  fluidVialCounts,
  selectedColors,
  activeColors,
  animatingColors,
  isAnimating,
  fluidEffects,
  remainingTime,
  onSelectFluid,
  onMixFluids,
  getCurrentFluidColor,
  getCurrentFluidColorName,
}: FluidMixingLabProps) {
  // Format the remaining time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Add this state for the pouring animation
  const [isPouringAnimation, setIsPouringAnimation] = useState(false)
  const [pouringColor, setPouringColor] = useState<string | null>(null)

  // Add this effect to handle the pouring animation
  useEffect(() => {
    if (isAnimating) {
      setIsPouringAnimation(true)

      // Determine which color is being poured based on animatingColors
      if (animatingColors.red && !animatingColors.blue && !animatingColors.yellow) {
        setPouringColor("red")
      } else if (animatingColors.blue && !animatingColors.yellow) {
        setPouringColor("blue")
      } else if (animatingColors.yellow) {
        setPouringColor("yellow")
      } else {
        setPouringColor(null)
      }
    } else {
      setIsPouringAnimation(false)
      setPouringColor(null)
    }
  }, [isAnimating, animatingColors])

  return (
    <div className="mb-8 bg-indigo-800/50 rounded-lg p-4 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Beaker className="w-6 h-6 text-teal-400" />
        <h3 className="text-xl font-bold text-purple-200">Fluid Mixing Lab</h3>
      </div>
      <p className="text-purple-300 text-sm mb-4">
        Select fluid vials to mix, then click the Mix button to create your potion! Effects last for 2 minutes.
      </p>

      {/* Active Effects and Timer */}
      {remainingTime > 0 && (
        <div className="bg-indigo-900/50 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <p className="text-sm text-purple-200 font-medium">Active Effects:</p>
            </div>
            <div className="flex items-center gap-1 text-purple-200 text-sm">
              <Clock className="w-4 h-4 text-purple-300" />
              <span>{formatTime(remainingTime)}</span>
            </div>
          </div>
          <p className="text-sm text-yellow-300 font-semibold">{fluidEffects}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Red Fluid Vial */}
        <div className="bg-indigo-900/50 p-3 rounded-lg flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-8 h-8 text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M10 2v7.31" />
                <path d="M14 9.3V2" />
                <path d="M8.5 2h7" />
                <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center mt-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          </div>
          <p className="text-xs text-purple-300 mb-1">Red Vials: {fluidVialCounts.red}</p>
          <div className="text-xs text-center text-red-300 mb-2">+10% XP Bonus</div>
          <Button
            onClick={() => onSelectFluid("red")}
            disabled={fluidVialCounts.red <= 0}
            size="sm"
            className={`w-full ${
              selectedColors.red ? "bg-red-600 hover:bg-red-700" : "bg-indigo-700 hover:bg-indigo-800"
            }`}
          >
            <Droplet className="w-3 h-3 mr-1" />
            {selectedColors.red ? "Selected" : "Select"}
          </Button>
        </div>

        {/* Blue Fluid Vial */}
        <div className="bg-indigo-900/50 p-3 rounded-lg flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-8 h-8 text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M10 2v7.31" />
                <path d="M14 9.3V2" />
                <path d="M8.5 2h7" />
                <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center mt-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <p className="text-xs text-purple-300 mb-1">Blue Vials: {fluidVialCounts.blue}</p>
          <div className="text-xs text-center text-blue-300 mb-2">+10% Coin Bonus</div>
          <Button
            onClick={() => onSelectFluid("blue")}
            disabled={fluidVialCounts.blue <= 0}
            size="sm"
            className={`w-full ${
              selectedColors.blue ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-700 hover:bg-indigo-800"
            }`}
          >
            <Droplet className="w-3 h-3 mr-1" />
            {selectedColors.blue ? "Selected" : "Select"}
          </Button>
        </div>

        {/* Yellow Fluid Vial */}
        <div className="bg-indigo-900/50 p-3 rounded-lg flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-8 h-8 text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M10 2v7.31" />
                <path d="M14 9.3V2" />
                <path d="M8.5 2h7" />
                <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center mt-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            </div>
          </div>
          <p className="text-xs text-purple-300 mb-1">Yellow Vials: {fluidVialCounts.yellow}</p>
          <div className="text-xs text-center text-yellow-300 mb-2">Error Protection</div>
          <Button
            onClick={() => onSelectFluid("yellow")}
            disabled={fluidVialCounts.yellow <= 0}
            size="sm"
            className={`w-full ${
              selectedColors.yellow ? "bg-yellow-600 hover:bg-yellow-700" : "bg-indigo-700 hover:bg-indigo-800"
            }`}
          >
            <Droplet className="w-3 h-3 mr-1" />
            {selectedColors.yellow ? "Selected" : "Select"}
          </Button>
        </div>
      </div>

      {/* Mix button */}
      <div className="mb-4">
        <Button
          onClick={onMixFluids}
          disabled={!selectedColors.red && !selectedColors.blue && !selectedColors.yellow}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Beaker className="w-4 h-4 mr-2" />
          Mix Fluids
        </Button>
      </div>

      {/* Fluid Combinations Guide */}
      <div className="bg-indigo-900/50 p-3 rounded-lg mb-4">
        <h4 className="text-sm font-bold text-purple-200 mb-2">Fluid Combinations:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-red-300">Red:</span>
            <span className="text-purple-300">+10% XP</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-blue-300">Blue:</span>
            <span className="text-purple-300">+10% Coins</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-yellow-300">Yellow:</span>
            <span className="text-purple-300">Error Protection</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-purple-300">Purple:</span>
            <span className="text-purple-300">XP & Coin Bonuses</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-orange-300">Orange:</span>
            <span className="text-purple-300">XP Bonus & Protection</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-green-300">Green:</span>
            <span className="text-purple-300">Coin Bonus & Protection</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>
            <span className="text-purple-200">Rainbow:</span>
            <span className="text-purple-300">All Bonuses Combined</span>
          </div>
        </div>
      </div>

      <div className="bg-indigo-900/50 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="text-purple-300 text-sm">
            Current Fluid Color: <span className="font-bold text-purple-200">{getCurrentFluidColorName()}</span>
          </p>

          {/* Show active colors */}
          <div className="flex gap-1">
            {activeColors.red && <div className="w-3 h-3 rounded-full bg-red-500 border border-red-300"></div>}
            {activeColors.blue && <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-300"></div>}
            {activeColors.yellow && <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-300"></div>}
          </div>
        </div>

        {/* Preview of the current fluid color */}
        <div className="mt-2 h-16 rounded-md overflow-hidden relative">
          {isAnimating ? (
            <div className="h-full w-full relative">
              {/* Base white fluid */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-white"></div>

              {/* Animated pouring effect */}
              {isPouringAnimation && pouringColor && (
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2"
                  initial={{ y: -30 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className={`w-4 h-20 ${
                      pouringColor === "red" ? "bg-red-500" : pouringColor === "blue" ? "bg-blue-500" : "bg-yellow-500"
                    } rounded-t-full`}
                    initial={{ height: 0 }}
                    animate={{ height: 60 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Droplets */}
                  <motion.div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                      pouringColor === "red" ? "bg-red-500" : pouringColor === "blue" ? "bg-blue-500" : "bg-yellow-500"
                    }`}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: 20, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      repeat: 2,
                      repeatType: "loop",
                    }}
                  />
                </motion.div>
              )}

              {/* Current mixed color result */}
              <motion.div
                style={{
                  ...getCurrentFluidColor(),
                  position: 'absolute',
                  inset: 0
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Ripple effect */}
              {isPouringAnimation && (
                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white/30"
                  initial={{ scale: 0, opacity: 0.7 }}
                  animate={{ scale: 10, opacity: 0 }}
                  transition={{
                    duration: 1,
                    repeat: 3,
                    repeatType: "loop",
                  }}
                />
              )}
            </div>
          ) : activeColors.red && activeColors.blue && activeColors.yellow ? (
            <motion.div
              style={{
                ...getCurrentFluidColor(),
                height: '100%',
                width: '100%',
                backgroundSize: '200% 100%'
              }}
              animate={{ backgroundPosition: ["0% center", "100% center"] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
          ) : (
            <div style={{
              ...getCurrentFluidColor(),
              height: '100%',
              width: '100%'
            }}></div>
          )}

          {/* Bubbles effect for active fluid */}
          {!isAnimating && (
            <>
              <motion.div
                className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-white/30"
                animate={{ y: [-10, -20], opacity: [0.7, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-3 left-2/4 w-1.5 h-1.5 rounded-full bg-white/30"
                animate={{ y: [-8, -16], opacity: [0.7, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
              />
              <motion.div
                className="absolute bottom-1 left-3/4 w-1 h-1 rounded-full bg-white/30"
                animate={{ y: [-5, -12], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.8 }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

