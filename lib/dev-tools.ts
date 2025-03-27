import { useGameStore } from "./store"

// Flag to control cheat button visibility
let cheatButtonVisible = false

// Function to toggle cheat button visibility
export const toggleCheatButton = () => {
  cheatButtonVisible = !cheatButtonVisible
  console.log(`Cheat button is now ${cheatButtonVisible ? "visible" : "hidden"}`)
  return cheatButtonVisible
}

// Function to add coins
export const addCoins = (amount = 1000) => {
  const { addCoins } = useGameStore.getState()
  const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  addCoins(amount, position)
  console.log(`Added ${amount} coins`)
  return amount
}

// Function to get current coins
export const getCoins = () => {
  const { coins } = useGameStore.getState()
  console.log(`Current coins: ${coins}`)
  return coins
}

// Function to check if cheat button is visible
export const isCheatButtonVisible = () => {
  return cheatButtonVisible
}

// Add this new function after the existing functions
export const masterAllCombinations = () => {
  const { maxSum, combinationStats, checkAllCombinationsMastered } = useGameStore.getState()
  const newCombinationStats = { ...combinationStats }

  // Loop through all possible combinations for the current maxSum
  for (let top = 2; top <= maxSum; top++) {
    for (let left = 1; left < top; left++) {
      const right = top - left
      const key = `${top}-${left}-${right}`

      // Create or update the stats for this combination
      newCombinationStats[key] = {
        ...(newCombinationStats[key] || { correctCount: 0, wrongCount: 0, currentStreak: 0 }),
        correctCount: Math.max(2, newCombinationStats[key]?.correctCount || 0),
        currentStreak: 2, // Set streak to 2 to ensure mastery
        mastered: true,
      }
    }
  }

  // Update the store with the new combinationStats
  useGameStore.setState({ combinationStats: newCombinationStats })

  // Check if all combinations are mastered and update the flag
  const allMastered = checkAllCombinationsMastered()

  console.log(`All combinations up to ${maxSum} set to mastered: ${allMastered}`)
  return allMastered
}

// Update the window.gameDevTools object to include the new function
if (typeof window !== "undefined") {
  // Create a namespace for our dev tools
  ;(window as any).gameDevTools = {
    addCoins,
    getCoins,
    toggleCheatButton,
    masterAllCombinations, // Add the new function
  }

  console.log(
    "%c🎮 Game Dev Tools Available 🎮",
    "background: #6d28d9; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;",
  )
  console.log("%cType gameDevTools.addCoins(1000) to add coins", "color: #8b5cf6; font-weight: bold;")
  console.log(
    "%cType gameDevTools.toggleCheatButton() to show/hide the cheat button",
    "color: #8b5cf6; font-weight: bold;",
  )
  console.log(
    "%cType gameDevTools.masterAllCombinations() to master all current combinations",
    "color: #8b5cf6; font-weight: bold;",
  )
}

