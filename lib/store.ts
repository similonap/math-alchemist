import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CombinationStats } from "@/types"

// Calculate XP needed for a given level
const calculateXpForLevel = (level: number) => {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Modify the calculateMaxSum function to determine max sum based on level
// Add this function after the calculateXpForLevel function
const calculateMaxSum = (level: number, reduceCount = 0) => {
  // Start with a base of 10 and increase by 5 every 2 levels
  const baseMaxSum = 10 + Math.floor((level - 1) / 2) * 5
  // Reduce by 5 for each time the difficulty reducer was used
  return Math.max(5, baseMaxSum - reduceCount * 5)
}

// Define item types
export interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  icon: string // Lucide icon name
  comingSoon?: boolean
  quantity?: number // How many of this item the player owns
  consumable?: boolean // Whether the item is consumed on use
  autoUse?: boolean // Whether the item is automatically used when purchased
  fluidColor?: string // Color for fluid items
}

// Define fluid effects
export interface FluidEffects {
  xpBonus: number // Percentage increase in XP (e.g., 0.5 = 50% bonus)
  coinBonus: number // Percentage increase in coins (e.g., 0.5 = 50% bonus)
  errorProtection: boolean // Whether errors are protected
}

// Add cat state interface
interface CatState {
  id: string
  color: string
  active: boolean
}

// Add catActive to the GameState interface
interface GameState {
  // Level system state
  currentXp: number
  level: number
  isLevelingUp: boolean
  newLevel: number
  xpThreshold: number
  showLevelUpAnimation: boolean

  // Game state
  topNumber: number
  leftNumber: number
  rightNumber: number
  hiddenSide: "left" | "right"
  userInput: string
  isCorrect: boolean | null
  isShaking: boolean
  exercisesCompleted: number
  mistakesMade: number
  showCelebration: boolean
  maxSum: number
  streakCount: number
  lastAnswerTime: number
  showXpGain: boolean
  xpGainAmount: number
  xpGainPosition: { x: number; y: number }
  showXpLoss: boolean
  xpLossAmount: number
  xpLossPosition: { x: number; y: number }
  consecutiveFailedAttempts: number
  showHints: boolean
  hintOptions: number[]

  // Tracking for number combinations
  testedCombinations: Record<string, number> // Format: "topNumber-leftNumber-rightNumber": count
  combinationStats: Record<string, CombinationStats> // Add this line for tracking combination statistics

  // Coin system state
  coins: number
  showCoinGain: boolean
  coinGainAmount: number
  coinGainPosition: { x: number; y: number }
  showCoinAnimation: boolean
  coinAnimationPosition: { x: number; y: number }

  // Fluid system state
  activeFluidColors: {
    red: boolean
    blue: boolean
    yellow: boolean
  }
  selectedFluidColors: {
    red: boolean
    blue: boolean
    yellow: boolean
  }
  isAnimatingFluidMix: boolean
  animatingFluidColors: {
    red: boolean
    blue: boolean
    yellow: boolean
  }
  fluidMixExpiry: number | null // Timestamp when the current fluid mix expires
  fluidEffects: FluidEffects // Current active fluid effects

  // Unicorn mode
  unicornMode: boolean

  // Cat mode
  cats: CatState[]

  // Store system
  storeItems: StoreItem[]
  inventory: Record<string, number> // Item ID to quantity mapping
  labName: string // Name of the magical lab
  itemBeingUsed: string | null

  // Add this to the GameState interface
  diplomas: { name: string; level: number; date: string }[]
  allCombinationsMastered: boolean

  // Actions
  generateProblem: () => void
  setUserInput: (input: string) => void
  checkAnswer: (formElement: HTMLElement | null) => void
  setIsLevelingUp: (isLevelingUp: boolean) => void
  setShowLevelUpAnimation: (show: boolean) => void
  completeLevel: () => void
  addCoins: (amount: number, position?: { x: number; y: number }) => void
  resetGame: () => void
  calculateXpReward: () => number
  calculateXpPenalty: () => number
  purchaseItem: (itemId: string, playerName?: string) => boolean
  setLabName: (name: string) => void
  useItem: (itemId: string) => boolean
  getItem: (itemId: string) => StoreItem | undefined
  getItemQuantity: (itemId: string) => number
  setItemBeingUsed: (itemId: string | null) => void
  toggleFluidColor: (color: "red" | "blue" | "yellow") => void
  getCurrentFluidColor: () => { background: string }
  selectFluidColor: (color: "red" | "blue" | "yellow") => void
  mixSelectedFluids: () => boolean
  resetFluidColors: () => void
  checkFluidExpiry: () => void
  getFluidEffectsDescription: () => string
  getRemainingFluidTime: () => number
  toggleUnicornMode: () => void
  toggleCat: (catId: string) => void
  generateHintOptions: () => void
  selectHintOption: (value: number) => void
  checkAllCombinationsMastered: () => boolean
  getAnimatingFluidColor: () => string
  catchCat: (catId: string) => boolean
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Level system state
      currentXp: 0,
      level: 1,
      isLevelingUp: false,
      newLevel: 1,
      xpThreshold: calculateXpForLevel(1),
      showLevelUpAnimation: false,

      // Game state
      topNumber: 0,
      leftNumber: 0,
      rightNumber: 0,
      hiddenSide: "left",
      userInput: "",
      isCorrect: null,
      isShaking: false,
      exercisesCompleted: 0,
      mistakesMade: 0,
      showCelebration: false,
      maxSum: 10,
      streakCount: 0,
      lastAnswerTime: 0,
      showXpGain: false,
      xpGainAmount: 0,
      xpGainPosition: { x: 0, y: 0 },
      showXpLoss: false,
      xpLossAmount: 0,
      xpLossPosition: { x: 0, y: 0 },
      consecutiveFailedAttempts: 0,
      showHints: false,
      hintOptions: [],

      // Tracking for number combinations
      testedCombinations: {},
      combinationStats: {}, // Initialize empty object for combination statistics

      // Coin system state
      coins: 0,
      showCoinGain: false,
      coinGainAmount: 0,
      coinGainPosition: { x: 0, y: 0 },
      showCoinAnimation: false,
      coinAnimationPosition: { x: 0, y: 0 },

      // Fluid system state
      activeFluidColors: {
        red: false,
        blue: false,
        yellow: false,
      },
      selectedFluidColors: {
        red: false,
        blue: false,
        yellow: false,
      },
      isAnimatingFluidMix: false,
      animatingFluidColors: {
        red: false,
        blue: false,
        yellow: false,
      },
      fluidMixExpiry: null,
      fluidEffects: {
        xpBonus: 0, // 10% XP bonus from red
        coinBonus: 0, // 10% coin bonus from blue
        errorProtection: false,
      },

      // Unicorn mode
      unicornMode: false,

      // Cat mode
      cats: [],

      // Store system
      storeItems: [
        {
          id: "name_lab",
          name: "Name Magical Lab",
          description: "Give your magical laboratory a custom name",
          price: 10,
          icon: "Flask",
          consumable: true,
          autoUse: true,
        },
        {
          id: "fluid_lab",
          name: "Fluid Mixing Lab",
          description: "Unlock the ability to mix magical fluid colors",
          price: 50,
          icon: "Beaker",
          consumable: false,
        },
        {
          id: "red_fluid",
          name: "Red Fluid Vial",
          description: "A vial of red magical fluid for XP bonus",
          price: 15,
          icon: "Flask",
          fluidColor: "red",
          consumable: true,
        },
        {
          id: "blue_fluid",
          name: "Blue Fluid Vial",
          description: "A vial of blue magical fluid for Coin bonus",
          price: 15,
          icon: "Flask",
          fluidColor: "blue",
          consumable: true,
        },
        {
          id: "yellow_fluid",
          name: "Yellow Fluid Vial",
          description: "A vial of yellow magical fluid for Error protection",
          price: 15,
          icon: "Flask",
          fluidColor: "yellow",
          consumable: true,
        },
        {
          id: "unicorn",
          name: "Magical Unicorn",
          description: "Replaces stars with magical unicorns when gaining XP",
          price: 100,
          icon: "Sparkles",
          consumable: false,
        },
        {
          id: "magical_cat",
          name: "Magical Cat",
          description: "A magical cat that runs around your screen while you play",
          price: 100,
          icon: "Sparkles",
          consumable: true
        },
        {
          id: "diploma",
          name: "Master's Diploma",
          description: "Certify your mastery of all combinations up to the current difficulty level",
          price: 30,
          icon: "GraduationCap",
          consumable: true,
          autoUse: false,
        },
      ],
      inventory: {},
      labName: "Magical Laboratory",
      itemBeingUsed: null,

      // In the initial state, add:

      // In the initial state, add:
      diplomas: [],
      allCombinationsMastered: false,

      // Actions
      generateProblem: () => {
        const { maxSum, testedCombinations, combinationStats } = get()

        // Generate all possible combinations for the current maxSum
        const possibleCombinations = []

        // Loop through all possible top numbers from 2 to maxSum
        for (let top = 2; top <= maxSum; top++) {
          // For each top number, loop through all possible left numbers from 1 to top-1
          for (let left = 1; left < top; left++) {
            const right = top - left
            const key = `${top}-${left}-${right}`

            // Get the number of times this combination has been tested
            const timesShown = testedCombinations[key] || 0

            // Get stats for this combination if it exists
            const stats = combinationStats[key]

            // Skip mastered combinations to focus on unmastered ones
            if (stats?.mastered) continue

            // Add the combination to the list of possible combinations
            possibleCombinations.push({
              top,
              left,
              right,
              key,
              timesShown,
            })
          }
        }

        // If there are no possible combinations (all are mastered), use all combinations
        if (possibleCombinations.length === 0) {
          for (let top = 2; top <= maxSum; top++) {
            for (let left = 1; left < top; left++) {
              const right = top - left
              const key = `${top}-${left}-${right}`
              const timesShown = testedCombinations[key] || 0

              possibleCombinations.push({
                top,
                left,
                right,
                key,
                timesShown,
              })
            }
          }
        }

        // Calculate weights for each combination based on how many times it has been shown
        // Combinations shown less frequently get higher weights
        const weights = possibleCombinations.map((combo) => {
          // Base weight is 10
          const baseWeight = 10
          // Reduce weight by 1 for each time the combination has been shown, with a minimum of 1
          return Math.max(1, baseWeight - combo.timesShown)
        })

        // Calculate the total weight
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

        // Select a random combination based on weights
        let randomValue = Math.random() * totalWeight
        let selectedIndex = 0

        // Find the selected index based on the random value and weights
        for (let i = 0; i < weights.length; i++) {
          randomValue -= weights[i]
          if (randomValue <= 0) {
            selectedIndex = i
            break
          }
        }

        // Get the selected combination
        const selectedCombo = possibleCombinations[selectedIndex]

        // If no combination was selected (shouldn't happen), generate a random one
        if (!selectedCombo) {
          const newTopNumber = Math.floor(Math.random() * (maxSum - 4)) + 5
          const newLeftNumber = Math.floor(Math.random() * (newTopNumber - 1)) + 1
          const newRightNumber = newTopNumber - newLeftNumber
          const newHiddenSide = Math.random() < 0.5 ? "left" : "right"

          // Update hint options
          const correctAnswer = newHiddenSide === "left" ? newLeftNumber : newRightNumber
          const decoy1 = Math.max(1, correctAnswer - 1)
          const decoy2 = correctAnswer + 1

          set({
            topNumber: newTopNumber,
            leftNumber: newLeftNumber,
            rightNumber: newRightNumber,
            hiddenSide: newHiddenSide,
            userInput: "",
            isCorrect: null,
            showHints: false,
            hintOptions: [correctAnswer, decoy1, decoy2],
          })

          return
        }

        // Randomly decide which number to hide
        const newHiddenSide = Math.random() < 0.5 ? "left" : "right"

        // Update hint options
        const correctAnswer = newHiddenSide === "left" ? selectedCombo.left : selectedCombo.right
        const decoy1 = Math.max(1, correctAnswer - 1)
        const decoy2 = correctAnswer + 1

        // Update the testedCombinations to record that this combination has been shown
        const newTestedCombinations = { ...testedCombinations }
        newTestedCombinations[selectedCombo.key] = (newTestedCombinations[selectedCombo.key] || 0) + 1

        // Check fluid expiry
        get().checkFluidExpiry()

        set({
          topNumber: selectedCombo.top,
          leftNumber: selectedCombo.left,
          rightNumber: selectedCombo.right,
          hiddenSide: newHiddenSide,
          userInput: "",
          isCorrect: null,
          consecutiveFailedAttempts: 0,
          showHints: false,
          hintOptions: [correctAnswer, decoy1, decoy2],
          testedCombinations: newTestedCombinations,
        })

        // Check if all combinations are mastered
        get().checkAllCombinationsMastered()
      },

      setUserInput: (input: string) => {
        set({ userInput: input, isCorrect: null })
      },

      // Calculate XP reward based on difficulty and speed
      calculateXpReward: () => {
        const { topNumber, streakCount, lastAnswerTime, fluidEffects } = get()
        // Base XP for solving a problem
        let xp = 5

        // Bonus for higher numbers
        xp += Math.floor(topNumber / 5)

        // Bonus for streak
        xp += Math.min(streakCount, 5)

        // Speed bonus (if answered within 5 seconds)
        const now = Date.now()
        if (lastAnswerTime > 0) {
          const timeDiff = (now - lastAnswerTime) / 1000
          if (timeDiff < 5) {
            xp += Math.floor((5 - timeDiff) * 2)
          }
        }

        // Apply XP bonus from fluid effects
        if (fluidEffects.xpBonus > 0) {
          xp = Math.floor(xp * (1 + fluidEffects.xpBonus))
        }

        set({ lastAnswerTime: now })
        return xp
      },

      // Calculate XP penalty for mistakes
      calculateXpPenalty: () => {
        const { currentXp, topNumber, fluidEffects } = get()

        // If error protection is active, no penalty
        if (fluidEffects.errorProtection) {
          return 0
        }

        // Base penalty is 3 XP
        let penalty = 3

        // Additional penalty for higher numbers (more difficult problems)
        penalty += Math.floor(topNumber / 10)

        // Cap the penalty at 20% of current XP to avoid excessive penalties
        const maxPenalty = Math.floor(currentXp * 0.2)
        penalty = Math.min(penalty, maxPenalty)

        // Ensure penalty is at least 1 XP if the player has any XP
        if (currentXp > 0) {
          penalty = Math.max(1, penalty)
        }

        return penalty
      },

      // Generate hint options for the current problem
      generateHintOptions: () => {
        const { hiddenSide, leftNumber, rightNumber, topNumber } = get()
        const correctAnswer = hiddenSide === "left" ? leftNumber : rightNumber

        // Generate two wrong answers that are close to the correct one
        // but still make sense in the context of the problem
        let wrongAnswer1, wrongAnswer2

        // Make sure wrong answers are within the valid range (1 to topNumber-1)
        // and different from the correct answer
        do {
          wrongAnswer1 = Math.max(1, Math.min(topNumber - 1, correctAnswer + Math.floor(Math.random() * 5) - 2))
        } while (wrongAnswer1 === correctAnswer)

        do {
          wrongAnswer2 = Math.max(1, Math.min(topNumber - 1, correctAnswer + Math.floor(Math.random() * 5) - 2))
        } while (wrongAnswer2 === correctAnswer || wrongAnswer2 === wrongAnswer1)

        // Shuffle the options
        const options = [correctAnswer, wrongAnswer1, wrongAnswer2]
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[options[i], options[j]] = [options[j], options[i]]
        }

        set({ hintOptions: options })
      },

      // Select a hint option
      selectHintOption: (value: number) => {
        const { hiddenSide, leftNumber, rightNumber } = get()
        const correctAnswer = hiddenSide === "left" ? leftNumber : rightNumber

        // Set the user input to the selected value
        set({ userInput: value.toString() })

        // Check if the selected option is correct
        if (value === correctAnswer) {
          // Simulate submitting the form with the correct answer
          get().checkAnswer(document.getElementById("answer-form"))
        } else {
          // Simulate submitting the form with an incorrect answer
          get().checkAnswer(document.getElementById("answer-form"))
        }
      },

      checkAnswer: (formElement: HTMLElement | null) => {
        const {
          userInput,
          hiddenSide,
          leftNumber,
          rightNumber,
          streakCount,
          calculateXpReward,
          generateProblem,
          calculateXpPenalty,
          fluidEffects,
          consecutiveFailedAttempts,
          generateHintOptions,
          combinationStats,
        } = get()

        // Check fluid expiry
        get().checkFluidExpiry()

        const userAnswer = Number.parseInt(userInput)
        const correctAnswer = hiddenSide === "left" ? leftNumber : rightNumber

        // Create a unique key for this combination
        const { topNumber } = get()
        const combinationKey = `${topNumber}-${leftNumber}-${rightNumber}`

        // Get or initialize stats for this combination
        const stats = combinationStats[combinationKey] || {
          correctCount: 0,
          wrongCount: 0,
          currentStreak: 0,
          mastered: false,
        }

        if (userAnswer === correctAnswer) {
          // Calculate XP reward
          const xpReward = get().calculateXpReward()

          // Show XP gain animation
          let xpGainPosition = { x: 0, y: 0 }
          if (formElement) {
            const rect = formElement.getBoundingClientRect()
            xpGainPosition = {
              x: rect.left + rect.width / 2,
              y: rect.top,
            }
          }

          // Update combination stats for correct answer
          const newStreak = stats.currentStreak + 1
          const newStats = {
            ...stats,
            correctCount: stats.correctCount + 1,
            currentStreak: newStreak,
            // Set mastered to true if streak reaches 2
            mastered: stats.mastered || newStreak >= 2,
          }

          // Update the combinationStats in the store
          const updatedCombinationStats = {
            ...combinationStats,
            [combinationKey]: newStats,
          }

          set({
            xpGainAmount: xpReward,
            showXpGain: true,
            xpGainPosition,
            currentXp: get().currentXp + xpReward,
            streakCount: streakCount + 1,
            isCorrect: true,
            showCelebration: true,
            exercisesCompleted: get().exercisesCompleted + 1,
            consecutiveFailedAttempts: 0, // Reset failed attempts on correct answer
            showHints: false, // Hide hints on correct answer
            userInput: "", // Clear the user input
            combinationStats: updatedCombinationStats, // Update combination stats
          })

          // Record this combination in testedCombinations
          const { testedCombinations } = get()
          const currentCount = testedCombinations[combinationKey] || 0
          set({
            testedCombinations: {
              ...testedCombinations,
              [combinationKey]: currentCount + 1,
            },
          })

          // Calculate coin reward with bonus
          let coinReward = 1
          if (streakCount % 3 === 0) {
            // Bonus coins for every 3rd correct answer in a streak
            coinReward = 3
          }

          // Apply coin bonus from fluid effects
          if (fluidEffects.coinBonus > 0) {
            coinReward = Math.floor(coinReward * (1 + fluidEffects.coinBonus))
          }

          // Check for streak bonus
          const newStreakCount = streakCount + 1
          if (newStreakCount % 3 === 0) {
            // Bonus coins for every 3rd correct answer in a streak
            let coinAnimationPosition = { x: 0, y: 0 }
            if (formElement) {
              const rect = formElement.getBoundingClientRect()
              coinAnimationPosition = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              }
            }

            set({
              showCoinAnimation: true,
              coinAnimationPosition,
            })

            // Hide coin animation after a delay
            setTimeout(() => {
              set({ showCoinAnimation: false })
            }, 2000)
          }

          // Add coins with bonus
          get().addCoins(coinReward, xpGainPosition)

          // Hide XP gain animation after a delay
          setTimeout(() => {
            set({ showXpGain: false })
          }, 1500)

          // Generate a new problem after a short delay
          setTimeout(() => {
            set({ showCelebration: false })
            generateProblem()
          }, 1500)

          // Check for level up
          const { currentXp, xpThreshold } = get()
          if (currentXp >= xpThreshold && !get().isLevelingUp) {
            set({
              isLevelingUp: true,
              newLevel: get().level + 1,
              showLevelUpAnimation: true,
            })

            // Set timeout for level up animation
            setTimeout(() => {
              get().completeLevel()
            }, 3000)
          }
        } else {
          // Calculate XP penalty
          const xpPenalty = calculateXpPenalty()
          const { currentXp } = get()

          // Ensure XP doesn't go below 0
          const newXp = Math.max(0, currentXp - xpPenalty)

          // Show XP loss animation if there's a penalty
          let xpLossPosition = { x: 0, y: 0 }
          if (formElement) {
            const rect = formElement.getBoundingClientRect()
            xpLossPosition = {
              x: rect.left + rect.width / 2,
              y: rect.top,
            }
          }

          // If error protection is active, don't reset streak
          const newStreakCount = fluidEffects.errorProtection ? streakCount : 0

          // Increment consecutive failed attempts
          const newFailedAttempts = consecutiveFailedAttempts + 1

          // Show hints after 3 consecutive failed attempts
          const shouldShowHints = newFailedAttempts >= 3

          // Generate hint options if we're going to show hints
          if (shouldShowHints && !get().showHints) {
            generateHintOptions()
          }

          // Update combination stats for wrong answer
          const newStats = {
            ...stats,
            wrongCount: stats.wrongCount + 1,
            currentStreak: 0, // Reset streak on wrong answer
            // mastered status remains unchanged
          }

          // Update the combinationStats in the store
          const updatedCombinationStats = {
            ...combinationStats,
            [combinationKey]: newStats,
          }

          set({
            isCorrect: false,
            isShaking: true,
            mistakesMade: get().mistakesMade + 1,
            streakCount: newStreakCount,
            currentXp: newXp,
            xpLossAmount: xpPenalty,
            showXpLoss: xpPenalty > 0,
            xpLossPosition,
            consecutiveFailedAttempts: newFailedAttempts,
            showHints: shouldShowHints,
            combinationStats: updatedCombinationStats, // Update combination stats
          })

          // Hide XP loss animation after a delay
          if (xpPenalty > 0) {
            setTimeout(() => {
              set({ showXpLoss: false })
            }, 1500)
          }

          // Stop shaking after animation completes
          setTimeout(() => {
            set({ isShaking: false })
          }, 500)
        }

        // Check if all combinations are mastered
        get().checkAllCombinationsMastered()
      },

      setIsLevelingUp: (isLevelingUp: boolean) => {
        set({ isLevelingUp })
      },

      setShowLevelUpAnimation: (show: boolean) => {
        set({ showLevelUpAnimation: show })
      },

      // Update the completeLevel function to NOT increase maxSum
      completeLevel: () => {
        const { newLevel } = get()
        const newXpThreshold = calculateXpForLevel(newLevel + 1)

        // No longer calculate or update maxSum based on level
        set({
          level: newLevel,
          xpThreshold: newXpThreshold,
          showLevelUpAnimation: false,
          isLevelingUp: false,
        })

        // Award coins for leveling up
        const levelUpCoins = newLevel * 5
        get().addCoins(levelUpCoins)
      },

      addCoins: (amount: number, position?: { x: number; y: number }) => {
        let coinGainPosition = position || { x: 0, y: 0 }

        // If no position provided, try to get position from coin counter element
        if (!position) {
          const coinCounter = document.getElementById("coin-counter")
          if (coinCounter) {
            const rect = coinCounter.getBoundingClientRect()
            coinGainPosition = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            }
          }
        }

        set({
          coins: get().coins + amount,
          coinGainAmount: amount,
          showCoinGain: true,
          coinGainPosition,
        })

        // Hide coin gain animation after a delay
        setTimeout(() => {
          set({ showCoinGain: false })
        }, 1500)
      },

      // Update the resetGame function to reset the difficultyReduceCount
      resetGame: () => {
        const coins = get().coins // Keep coins
        const inventory = get().inventory // Keep inventory
        const labName = get().labName // Keep lab name
        const activeFluidColors = get().activeFluidColors // Keep active fluid colors
        const fluidMixExpiry = get().fluidMixExpiry // Keep fluid expiry
        const fluidEffects = get().fluidEffects // Keep fluid effects
        const unicornMode = get().unicornMode // Keep unicorn mode
        const cats = get().cats // Keep cats
        const combinationStats = get().combinationStats // Keep combination stats
        const diplomas = get().diplomas // Keep diplomas
        const allCombinationsMastered = get().allCombinationsMastered // Keep allCombinationsMastered

        set({
          // Reset level system
          level: 1,
          currentXp: 0,
          xpThreshold: calculateXpForLevel(1),

          // Reset game state
          exercisesCompleted: 0,
          mistakesMade: 0,
          maxSum: 10, // Reset to initial value of 10 instead of calculating
          streakCount: 0,
          consecutiveFailedAttempts: 0, // Reset failed attempts
          showHints: false, // Hide hints

          // Keep coins, inventory, and fluid colors
          coins,
          inventory,
          labName,
          activeFluidColors,
          fluidMixExpiry,
          fluidEffects,
          unicornMode,
          cats,
          combinationStats, // Keep combination stats
          diplomas,
          allCombinationsMastered,
        })

        // Generate a new problem
        get().generateProblem()
      },

      // Purchase an item from the store
      purchaseItem: (itemId: string, playerName?: string) => {
        const { storeItems, coins, inventory, useItem, setItemBeingUsed } = get()

        // Find the item
        const item = storeItems.find((item) => item.id === itemId)

        // Check if item exists and is not coming soon
        if (!item || item.comingSoon) {
          return false
        }

        if (coins < item.price) {
          return false
        }

        // Deduct coins
        set({ coins: coins - item.price })

        // Add item to inventory
        const newInventory = {
          ...inventory,
          [itemId]: (inventory[itemId] || 0) + 1,
        }
        set({ inventory: newInventory })

        // Special handling for diploma
        if (item.id === "diploma") {
          // Check if all combinations are mastered
          if (!get().allCombinationsMastered) {
            return false
          }

          // Handle diploma award
          if (playerName) {
            const { maxSum, diplomas } = get()

            // Check if a diploma for this level already exists
            const existingDiplomaForLevel = diplomas.find((d) => d.level === maxSum)
            if (existingDiplomaForLevel) {
              // Don't create a new diploma if one already exists for this level
              return true
            }

            // Add new diploma
            const newDiploma = {
              name: playerName,
              level: maxSum,
              date: new Date().toISOString(),
            }

            // Increase max sum by 5
            const newMaxSum = maxSum + 5

            // Reset mastery status for all combinations
            const { combinationStats } = get()
            const newCombinationStats = { ...combinationStats }

            Object.keys(newCombinationStats).forEach((key) => {
              newCombinationStats[key] = {
                ...newCombinationStats[key],
                currentStreak: 0,
                mastered: false,
              }
            })

            // Update state
            set({
              diplomas: [...diplomas, newDiploma],
              maxSum: newMaxSum,
              combinationStats: newCombinationStats,
              allCombinationsMastered: false, // Reset flag
            })

            // Generate a new problem with the new max sum
            setTimeout(() => {
              get().generateProblem()
            }, 100)
          }

          return true
        }

        // Special handling for unicorn item
        if (item.id === "unicorn") {
          set({ unicornMode: true })
        }

        // Special handling for cat item
        if (item.id === "magical_cat") {
          const cats = get().cats
          const newCat: CatState = {
            id: `cat-${Date.now()}`,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            active: true
          }
          set({ cats: [...cats, newCat] })
          console.log("Cat activated from purchase")
        }

        // If item is auto-use, use it immediately
        // For name_lab, we'll handle this specially in the component
        if (item.id === "name_lab") {
          // Don't actually consume it yet - we'll do that after the dialog
          setItemBeingUsed(itemId)
          return true
        }

        // For other auto-use items, use them immediately
        if (item.autoUse) {
          //useItem(itemId) //This hook is being called conditionally, but all hooks must be called in the exact same order in every component render.
        }

        return true
      },

      // Set the lab name
      setLabName: (name: string) => {
        set({ labName: name })
        // We no longer consume the item here since it's handled in purchaseItem
      },

      // Use an item
      useItem: (itemId: string) => {
        const { inventory, setItemBeingUsed } = get()
        const currentQuantity = inventory[itemId] || 0

        // Check if player has the item
        if (currentQuantity <= 0) {
          return false
        }

        // Get the item
        const item = get().getItem(itemId)

        // Check if item exists
        if (!item) {
          return false
        }

        // If item is consumable, reduce quantity
        if (item.consumable) {
          const newInventory = {
            ...inventory,
            [itemId]: currentQuantity - 1,
          }
          set({ inventory: newInventory })
        }

        // Handle item-specific effects here
        if (item.id === "unicorn") {
          get().toggleUnicornMode()
        } else if (item.id === "magical_cat") {
          get().toggleCat(itemId)
        }

        setItemBeingUsed(null)

        return true
      },

      // Get an item by ID
      getItem: (itemId: string) => {
        const { storeItems } = get()
        return storeItems.find((item) => item.id === itemId)
      },

      // Get quantity of an item in inventory
      getItemQuantity: (itemId: string) => {
        const { inventory } = get()
        return inventory[itemId] || 0
      },

      setItemBeingUsed: (itemId: string | null) => {
        set({ itemBeingUsed: itemId })
      },

      // Toggle a fluid color on/off (now just for toggling the active state)
      toggleFluidColor: (color: "red" | "blue" | "yellow") => {
        const { activeFluidColors } = get()

        set({
          activeFluidColors: {
            ...activeFluidColors,
            [color]: !activeFluidColors[color],
          },
        })
      },

      // Select a fluid color without consuming it
      selectFluidColor: (color: "red" | "blue" | "yellow") => {
        const { selectedFluidColors } = get()

        set({
          selectedFluidColors: {
            ...selectedFluidColors,
            [color]: !selectedFluidColors[color],
          },
        })
      },

      // Reset all fluid colors to default (white)
      resetFluidColors: () => {
        // First, trigger the animation state
        set({
          isAnimatingFluidMix: true,
          animatingFluidColors: {
            red: false,
            blue: false,
            yellow: false,
          },
          // Don't reset active colors yet - we'll do that after animation
        })

        // After a short delay, reset the actual colors
        setTimeout(() => {
          set({
            activeFluidColors: {
              red: false,
              blue: false,
              yellow: false,
            },
            fluidMixExpiry: null,
            fluidEffects: {
              xpBonus: 0,
              coinBonus: 0,
              errorProtection: false,
            },
            isAnimatingFluidMix: false,
          })
        }, 1000)
      },

      // Check if fluid effects have expired
      checkFluidExpiry: () => {
        const { fluidMixExpiry } = get()

        if (fluidMixExpiry && Date.now() > fluidMixExpiry) {
          get().resetFluidColors()
        }
      },

      // Get remaining time for fluid effects in seconds
      getRemainingFluidTime: () => {
        const { fluidMixExpiry } = get()

        if (!fluidMixExpiry) return 0

        const remainingMs = Math.max(0, fluidMixExpiry - Date.now())
        return Math.floor(remainingMs / 1000)
      },

      // Get a description of the active fluid effects
      getFluidEffectsDescription: () => {
        const { fluidEffects } = get()
        const effects = []

        if (fluidEffects.xpBonus > 0) {
          effects.push(`+${Math.round(fluidEffects.xpBonus * 100)}% XP`)
        }

        if (fluidEffects.coinBonus > 0) {
          effects.push(`+${Math.round(fluidEffects.coinBonus * 100)}% Coins`)
        }

        if (fluidEffects.errorProtection) {
          effects.push("Error Protection")
        }

        return effects.join(", ") || "None"
      },

      // Toggle unicorn mode
      toggleUnicornMode: () => {
        set((state) => ({ unicornMode: !state.unicornMode }))
      },

      // Toggle cat function
      toggleCat: (catId: string) => {
        set((state) => ({
          cats: state.cats.map(cat => 
            cat.id === catId ? { ...cat, active: !cat.active } : cat
          )
        }))
      },

      // Add function to catch a cat
      catchCat: (catId: string) => {
        const { cats, coins, inventory } = get()
        const cat = cats.find(c => c.id === catId)
        
        if (!cat) return false

        // Remove the cat and add coins (100 + 5 bonus)
        set({
          cats: cats.filter(c => c.id !== catId),
          coins: coins + 105,
          // Reduce the inventory count for magical_cat
          inventory: {
            ...inventory,
            magical_cat: (inventory.magical_cat || 0) - 1
          }
        })

        return true
      },

      // Mix the selected fluids (consumes vials)
      mixSelectedFluids: () => {
        const { inventory, selectedFluidColors } = get()
        const { red, blue, yellow } = selectedFluidColors

        // Check if any colors are selected
        if (!red && !blue && !yellow) {
          return false
        }

        // Check if player has the required vials
        let hasAllVials = true
        const newInventory = { ...inventory }

        // Check and deduct red vial if selected
        if (red) {
          const redVials = inventory["red_fluid"] || 0
          if (redVials <= 0) {
            hasAllVials = false
          } else {
            newInventory["red_fluid"] = redVials - 1
          }
        }

        // Check and deduct blue vial if selected
        if (blue) {
          const blueVials = inventory["blue_fluid"] || 0
          if (blueVials <= 0) {
            hasAllVials = false
          } else {
            newInventory["blue_fluid"] = blueVials - 1
          }
        }

        // Check and deduct yellow vial if selected
        if (yellow) {
          const yellowVials = inventory["yellow_fluid"] || 0
          if (yellowVials <= 0) {
            hasAllVials = false
          } else {
            newInventory["yellow_fluid"] = yellowVials - 1
          }
        }

        // If player doesn't have all required vials, return false
        if (!hasAllVials) {
          return false
        }

        // Calculate fluid effects based on the mix
        const fluidEffects = {
          xpBonus: red ? 0.1 : 0, // 10% XP bonus from red
          coinBonus: blue ? 0.1 : 0, // 10% coin bonus from blue
          errorProtection: yellow, // Error protection from yellow
        }

        // Enhance effects for combinations
        /*
        if (red && blue && yellow) {
          // Rainbow mix - enhance all effects
          fluidEffects.xpBonus = 1.0 // 100% XP bonus
          fluidEffects.coinBonus = 1.0 // 100% coin bonus
          // Error protection already true
        } else if (red && blue) {
          // Purple mix - enhanced XP and coin bonus
          fluidEffects.xpBonus = 0.75 // 75% XP bonus
          fluidEffects.coinBonus = 0.75 // 75% coin bonus
        } else if (red && yellow) {
          // Orange mix - enhanced XP bonus and error protection
          fluidEffects.xpBonus = 0.75 // 75% XP bonus
          // Error protection already true
        } else if (blue && yellow) {
          // Green mix - enhanced coin bonus and error protection
          fluidEffects.coinBonus = 0.75 // 75% coin bonus
          // Error protection already true
        }
        */

        // Set expiry time (2 minutes from now)
        const expiryTime = Date.now() + 2 * 60 * 1000

        // Start the animation sequence
        set({
          inventory: newInventory,
          isAnimatingFluidMix: true,
          animatingFluidColors: {
            red: false,
            blue: false,
            yellow: false,
          },
          selectedFluidColors: {
            red: false,
            blue: false,
            yellow: false,
          },
          fluidMixExpiry: expiryTime,
          fluidEffects,
        })

        // Animate adding each color one by one
        const animateColors = async () => {
          // Add red if selected
          if (red) {
            set((state) => ({
              animatingFluidColors: {
                ...state.animatingFluidColors,
                red: true,
              },
            }))
            await new Promise((resolve) => setTimeout(resolve, 500))
          }

          // Add blue if selected
          if (blue) {
            set((state) => ({
              animatingFluidColors: {
                ...state.animatingFluidColors,
                blue: true,
              },
            }))
            await new Promise((resolve) => setTimeout(resolve, 500))
          }

          // Add yellow if selected
          if (yellow) {
            set((state) => ({
              animatingFluidColors: {
                ...state.animatingFluidColors,
                yellow: true,
              },
            }))
            await new Promise((resolve) => setTimeout(resolve, 500))
          }

          // Finally, set the actual active colors and end animation
          set({
            activeFluidColors: {
              red,
              blue,
              yellow,
            },
            isAnimatingFluidMix: false,
          })
        }

        // Start the animation sequence
        animateColors()

        return true
      },

      // Get the current fluid color based on active colors
      getCurrentFluidColor: () => {
        const { activeFluidColors } = get()
        const { red, blue, yellow } = activeFluidColors

        // If no colors are active, return white
        if (!red && !blue && !yellow) {
          return {
            background: 'linear-gradient(to right, #d1d5db, #ffffff)'
          }
        }

        // If all colors are active, return rainbow (special case)
        if (red && blue && yellow) {
          return {
            background: 'linear-gradient(to right, #dc2626, #ea580c, #eab308, #16a34a, #2563eb, #4f46e5, #7e22ce)'
          }
        }

        // Handle color combinations based on actual color mixing
        if (red && blue && !yellow) {
          return {
            background: 'linear-gradient(to right, #3730a3, #4338ca)' // Red + Blue = Indigo
          }
        }

        if (red && !blue && yellow) {
          return {
            background: 'linear-gradient(to right, #b45309, #d97706)' // Red + Yellow = Amber
          }
        }

        if (!red && blue && yellow) {
          return {
            background: 'linear-gradient(to right, #115e59, #14b8a6)' // Blue + Yellow = Teal
          }
        }

        // Single colors
        if (red) {
          return {
            background: 'linear-gradient(to right, #b91c1c, #ef4444)'
          }
        }

        if (blue) {
          return {
            background: 'linear-gradient(to right, #1d4ed8, #3b82f6)'
          }
        }

        if (yellow) {
          return {
            background: 'linear-gradient(to right, #ca8a04, #eab308)'
          }
        }

        // Fallback (should never reach here)
        return {
          background: 'linear-gradient(to right, #d1d5db, #ffffff)'
        }
      },

      // Get the current animating fluid color based on animating colors
      getAnimatingFluidColor: () => {
        const { animatingFluidColors } = get()
        const { red, blue, yellow } = animatingFluidColors

        // If no colors are active, return white
        if (!red && !blue && !yellow) {
          return "from-gray-300 to-white"
        }

        // If all colors are active, return rainbow
        if (red && blue && yellow) {
          return "from-red-600 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-600 to-purple-700"
        }

        // Handle color combinations
        if (red && blue && !yellow) {
          return "from-purple-700 to-purple-500" // Red + Blue = Purple
        }

        if (red && !blue && yellow) {
          return "from-orange-700 to-orange-500" // Red + Yellow = Orange
        }

        if (!red && blue && yellow) {
          return "from-green-700 to-green-500" // Blue + Yellow = Green
        }

        // Single colors
        if (red) {
          return "from-red-700 to-red-500"
        }

        if (blue) {
          return "from-blue-700 to-blue-500"
        }

        if (yellow) {
          return "from-yellow-700 to-yellow-500"
        }

        // Fallback (should never reach here)
        return "from-gray-300 to-white"
      },

      // Add this function to check if all combinations are mastered
      // Place it after the getMasteredCombinationsCount method
      checkAllCombinationsMastered: () => {
        const { maxSum, combinationStats } = get()

        // Check if there are any combinations for this level
        let totalCombinations = 0
        let masteredCombinations = 0

        // Loop through all possible combinations for the current maxSum
        for (let top = 2; top <= maxSum; top++) {
          for (let left = 1; left < top; left++) {
            const right = top - left
            const key = `${top}-${left}-${right}`
            totalCombinations++

            const stats = combinationStats[key]
            if (stats?.mastered) {
              masteredCombinations++
            }
          }
        }

        const allMastered = totalCombinations > 0 && masteredCombinations === totalCombinations

        // Update state if it changed
        if (allMastered !== get().allCombinationsMastered) {
          set({ allCombinationsMastered: allMastered })
        }

        return allMastered
      },
    }),
    {
      name: "number-splitting-game", // name of the item in localStorage
      // Update the partialize function to include combinationStats
      partialize: (state) => ({
        // Only persist these fields
        level: state.level,
        currentXp: state.currentXp,
        xpThreshold: state.xpThreshold,
        exercisesCompleted: state.exercisesCompleted,
        mistakesMade: state.mistakesMade,
        maxSum: state.maxSum,
        streakCount: state.streakCount,
        coins: state.coins,
        inventory: state.inventory,
        labName: state.labName,
        activeFluidColors: state.activeFluidColors,
        selectedFluidColors: state.selectedFluidColors,
        fluidMixExpiry: state.fluidMixExpiry,
        fluidEffects: state.fluidEffects,
        unicornMode: state.unicornMode,
        cats: state.cats,
        testedCombinations: state.testedCombinations,
        combinationStats: state.combinationStats, // Add this line to persist combination stats
        diplomas: state.diplomas,
        allCombinationsMastered: state.allCombinationsMastered,
      }),
    },
  ),
)

