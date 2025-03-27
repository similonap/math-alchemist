"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sparkles, Star, Coins, ZapOff } from "lucide-react"
import { LevelSidebar } from "@/components/level-sidebar"
import { GameMenuBar } from "@/components/game-menu-bar"
import { MagicStore } from "@/components/magic-store"
import { ProgressOverview } from "@/components/progress-overview"
import { useGameStore } from "@/lib/store"
import { LevelUpDialog } from "@/components/dialogs/level-up-dialog"
// Import the MagicalCat component
import { MagicalCat } from "@/components/magical-cat"
// Import the CheatButton component
import { CheatButton } from "@/components/game/cheat-button"
// Import dev tools
import { isCheatButtonVisible } from "@/lib/dev-tools"
// Import the HintOptions component
import { HintOptions } from "@/components/game/hint-options"
import { Unicorn } from "@/components/unicorn"

// Function to calculate difficulty cost (replace with your actual logic)
const calculateDifficultyCost = (level: number) => {
  // Example logic: return a cost based on the current level
  return 10 + level * 2
}

export default function GameWithLevelSystem() {
  const [activeView, setActiveView] = useState<"game" | "store" | "progress">("game")
  // State to track cheat button visibility
  const [cheatVisible, setCheatVisible] = useState(false)
  const [showCatchReward, setShowCatchReward] = useState(false)
  const [catchRewardPosition, setCatchRewardPosition] = useState({ x: 0, y: 0 })

  // Get state and actions from the store
  const {
    // Level system state
    level,
    newLevel,
    showLevelUpAnimation,

    // Game state
    topNumber,
    leftNumber,
    rightNumber,
    hiddenSide,
    userInput,
    isCorrect,
    isShaking,
    exercisesCompleted,
    mistakesMade,
    showCelebration,
    maxSum,
    showXpGain,
    xpGainAmount,
    xpGainPosition,
    showXpLoss,
    xpLossAmount,
    xpLossPosition,
    showHints,
    hintOptions,
    combinationStats,

    // Coin system state
    coins,
    showCoinGain,
    coinGainAmount,
    coinGainPosition,
    showCoinAnimation,
    coinAnimationPosition,

    // Unicorn mode
    unicornMode,

    // Cat mode
    cats,
    catchCat,
    toggleCat,

    // Actions
    generateProblem,
    setUserInput,
    checkAnswer,
    completeLevel,
    addCoins,
    selectHintOption,
  } = useGameStore()

  const formRef = useRef<HTMLFormElement>(null)
  const difficultyCost = calculateDifficultyCost(level)

  // Initialize the game
  useEffect(() => {
    generateProblem()
  }, [generateProblem])

  // Check for cheat button visibility changes
  useEffect(() => {
    const checkCheatVisibility = () => {
      const visible = isCheatButtonVisible()
      setCheatVisible(visible)
    }

    // Check initially
    checkCheatVisibility()

    // Set up an interval to check periodically
    const intervalId = setInterval(checkCheatVisibility, 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "")
    setUserInput(value)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput) {
      checkAnswer(formRef.current)
    }
  }

  // Handle level up completion
  const handleLevelUpComplete = () => {
    completeLevel()
  }

  // Handle adding coins via cheat button
  const handleAddCoins = () => {
    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    addCoins(1000, position)
  }

  // Handle selecting a hint option
  const handleSelectHint = (value: number) => {
    selectHintOption(value)
  }

  const handleCatchCat = (catId: string, position: { x: number, y: number }) => {
    if (catchCat(catId)) {
      setCatchRewardPosition(position)
      setShowCatchReward(true)
      setTimeout(() => setShowCatchReward(false), 1500)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)]">
      {/* Menu Bar */}
      <GameMenuBar activeView={activeView} onChangeView={setActiveView} />

      {/* Main Content */}
      <div className="flex gap-6 flex-grow">
        {/* Sidebar - only show in game view */}
        {activeView === "game" && (
          <div className="w-48 shrink-0">
            <LevelSidebar />
          </div>
        )}

        {/* Main Game Area or Store or Progress */}
        <div className="flex-grow">
          {activeView === "game" ? (
            <Card className="bg-indigo-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-500/30 h-full relative overflow-hidden">
              {/* Score display */}
              <div className="flex justify-between mb-6 text-sm">
                <div className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full">
                  Completed: <span className="font-bold">{exercisesCompleted}</span>
                </div>
                <div className="relative bg-purple-900/50 px-3 py-1 rounded-full overflow-hidden group">
                  {/* Calculate mastery percentage */}
                  {(() => {
                    const totalCombinations = maxSum <= 1 ? 0 : (maxSum * (maxSum - 1)) / 2
                    const masteredCombinations = Object.values(combinationStats).filter((stat) => stat.mastered).length
                    const masteryPercentage =
                      totalCombinations > 0 ? (masteredCombinations / totalCombinations) * 100 : 0

                    return (
                      <>
                        {/* Background progress fill */}
                        <div
                          style={{ 
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to right, rgba(79, 70, 229, 0.7), rgba(147, 51, 234, 0.7))',
                            width: `${masteryPercentage}%`,
                            transition: 'all 500ms ease-out'
                          }}
                        />

                        {/* Content with sparkle effect on hover */}
                        <div className="relative flex items-center gap-1 z-10">
                          <span className="text-purple-300">Max:</span>
                          <span className="font-bold mx-1 text-purple-200">{maxSum}</span>
                          <span className="text-xs text-purple-300 opacity-70 group-hover:opacity-100 transition-opacity">
                            ({Math.round(masteryPercentage)}% mastered)
                          </span>

                          {/* Sparkle effect on hover when progress is significant */}
                          {masteryPercentage > 30 && (
                            <span className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Sparkles className="w-3 h-3 text-yellow-400" />
                            </span>
                          )}
                        </div>
                      </>
                    )
                  })()}
                </div>
                <div className="bg-red-900/50 text-red-300 px-3 py-1 rounded-full">
                  Mistakes: <span className="font-bold">{mistakesMade}</span>
                </div>
              </div>

              {/* Dev Cheat Button - only visible when toggled from console */}
              <div className="absolute top-2 right-2">
                <CheatButton onClick={handleAddCoins} visible={cheatVisible} />
              </div>

              {/* Top number */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {topNumber}
                </div>
              </div>

              {/* Tree branches */}
              <div className="relative h-16 mb-4">
                <div className="absolute left-1/2 top-0 w-0.5 h-8 bg-purple-400/50 -translate-x-1/2"></div>
                <div className="absolute left-1/4 top-8 w-1/2 h-0.5 bg-purple-400/50"></div>
                <div className="absolute left-1/4 top-8 w-0.5 h-8 bg-purple-400/50"></div>
                <div className="absolute left-3/4 top-8 w-0.5 h-8 bg-purple-400/50 -translate-x-full"></div>
              </div>

              {/* Bottom numbers */}
              <div
                className="flex justify-around mb-8"
                style={{
                  transform:
                    showHints && hiddenSide === "left"
                      ? "translateX(-40px)"
                      : showHints && hiddenSide === "right"
                        ? "translateX(40px)"
                        : "translateX(0)",
                }}
              >
                <div className="relative">
                  {hiddenSide === "left" ? (
                    showHints ? (
                      // Show hint options instead of input field when hints are active
                      <HintOptions options={hintOptions} onSelect={handleSelectHint} isDisabled={isCorrect !== null} />
                    ) : isCorrect === true ? (
                      // Show fixed box with correct answer when answer is correct
                      <div className="w-16 h-16 rounded-md bg-green-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-green-400">
                        {leftNumber}
                      </div>
                    ) : (
                      <motion.div
                        animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Input
                          type="text"
                          value={userInput}
                          onChange={handleInputChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && userInput) {
                              e.preventDefault()
                              checkAnswer(formRef.current)
                            }
                          }}
                          className={`w-16 h-16 text-center text-2xl font-bold bg-indigo-800/50 border-purple-500/50 text-purple-200 ${
                            isCorrect === false ? "border-red-500 bg-red-900/30" : ""
                          }`}
                          placeholder="?"
                          maxLength={2}
                          autoFocus
                          disabled={isCorrect !== null}
                        />
                      </motion.div>
                    )
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {leftNumber}
                    </div>
                  )}
                </div>
                <div>
                  {hiddenSide === "right" ? (
                    showHints ? (
                      // Show hint options instead of input field when hints are active
                      <HintOptions options={hintOptions} onSelect={handleSelectHint} isDisabled={isCorrect !== null} />
                    ) : isCorrect === true ? (
                      // Show fixed box with correct answer when answer is correct
                      <div className="w-16 h-16 rounded-md bg-green-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-green-400">
                        {rightNumber}
                      </div>
                    ) : (
                      <motion.div
                        animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Input
                          type="text"
                          value={userInput}
                          onChange={handleInputChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && userInput) {
                              e.preventDefault()
                              checkAnswer(formRef.current)
                            }
                          }}
                          className={`w-16 h-16 text-center text-2xl font-bold bg-indigo-800/50 border-purple-500/50 text-purple-200 ${
                            isCorrect === false ? "border-red-500 bg-red-900/30" : ""
                          } ${isCorrect === true ? "border-green-500 bg-green-900/30" : ""}`}
                          placeholder="?"
                          maxLength={2}
                          autoFocus
                          disabled={isCorrect !== null}
                        />
                      </motion.div>
                    )
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {rightNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback message */}
              <div className="h-8 mb-4 text-center">
                {isCorrect === true && <p className="text-green-400 font-bold">Great job! That's correct! 🎉</p>}
                {isCorrect === false && <p className="text-red-400">Try again! You can do it! 💪</p>}
              </div>

              {/* Submit button - only show when not using hints */}
              {!showHints && (
                <form id="answer-form" ref={formRef} onSubmit={handleSubmit} className="flex justify-center pb-8">
                  <Button
                    type="submit"
                    className="px-8 py-2 text-lg rounded-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!userInput || isCorrect === true}
                  >
                    Check Answer
                  </Button>
                </form>
              )}

              {/* Celebration animation */}
              {showCelebration && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: Math.random() * window.innerWidth,
                        y: window.innerHeight + 100,
                      }}
                      animate={{
                        y: -100,
                        x: Math.random() * window.innerWidth,
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: Math.random() * 0.5,
                      }}
                      className="absolute"
                    >
                      {unicornMode ? (
                        <Unicorn className="w-8 h-8 text-pink-400" />
                      ) : (
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          ) : activeView === "store" ? (
            <MagicStore />
          ) : (
            <ProgressOverview />
          )}
        </div>
      </div>

      {/* XP Gain Animation */}
      <AnimatePresence>
        {showXpGain && (
          <motion.div
            initial={{
              opacity: 0,
              y: 0,
              x: xpGainPosition.x,
              position: "fixed",
              top: xpGainPosition.y,
              left: 0,
              zIndex: 100,
              pointerEvents: "none",
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -100,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="text-yellow-300 font-bold text-xl flex items-center"
          >
            +{xpGainAmount} XP <Sparkles className="ml-1 w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Loss Animation */}
      <AnimatePresence>
        {showXpLoss && (
          <motion.div
            initial={{
              opacity: 0,
              y: 0,
              x: xpLossPosition.x,
              position: "fixed",
              top: xpLossPosition.y,
              left: 0,
              zIndex: 100,
              pointerEvents: "none",
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -100,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="text-red-400 font-bold text-xl flex items-center"
          >
            -{xpLossAmount} XP <ZapOff className="ml-1 w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coin Gain Animation */}
      <AnimatePresence>
        {showCoinGain && (
          <motion.div
            initial={{
              opacity: 0,
              y: 0,
              x: coinGainPosition.x,
              position: "fixed",
              top: coinGainPosition.y,
              left: 0,
              zIndex: 100,
              pointerEvents: "none",
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -50,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="text-yellow-400 font-bold text-xl flex items-center"
          >
            +{coinGainAmount} <Coins className="ml-1 w-5 h-5 text-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special Coin Animation for Streak */}
      <AnimatePresence>
        {showCoinAnimation && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              top: coinAnimationPosition.y,
              left: coinAnimationPosition.x,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <div className="relative">
              {/* Coin burst animation */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.cos((i * 45 * Math.PI) / 180) * 100,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 100,
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                  }}
                  className="absolute top-0 left-0"
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                    <Coins className="w-5 h-5 text-yellow-800" />
                  </div>
                </motion.div>
              ))}

              {/* Center message */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2 }}
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-600 to-yellow-400 px-4 py-2 rounded-lg shadow-lg"
              >
                <p className="text-yellow-900 font-bold whitespace-nowrap">Streak Bonus! +2 Coins</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Dialog */}
      <LevelUpDialog
        isOpen={showLevelUpAnimation}
        onClose={handleLevelUpComplete}
        newLevel={newLevel}
        maxSum={maxSum}
      />

      {/* Magical Cats - Render all active cats */}
      {cats.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[9999]" style={{ overflow: "hidden" }}>
          {cats.map((cat) => (
            cat.active && (
              <MagicalCat
                key={cat.id}
                id={cat.id}
                color={cat.color}
                onCatch={(e) => {
                  const target = e.currentTarget
                  if (target) {
                    const rect = target.getBoundingClientRect()
                    handleCatchCat(cat.id, {
                      x: rect.left + rect.width / 2,
                      y: rect.top
                    })
                  }
                }}
              />
            )
          ))}
        </div>
      )}

      {/* Catch Reward Animation */}
      <AnimatePresence>
        {showCatchReward && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -50 }}
            exit={{ opacity: 0 }}
            className="fixed z-[10000] pointer-events-none"
            style={{
              left: catchRewardPosition.x,
              top: catchRewardPosition.y,
            }}
          >
            <div className="flex items-center text-yellow-400 font-bold text-lg">
              <Coins className="w-5 h-5 mr-1" />
              +105
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

