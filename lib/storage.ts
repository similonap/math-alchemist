// lib/storage.ts

import type { GameState } from "@/types"

const STORAGE_KEY = "number-splitting-game-state"

export const saveGameState = async (gameState: GameState) => {
  try {
    const serializedState = JSON.stringify(gameState)
    localStorage.setItem(STORAGE_KEY, serializedState)
  } catch (error) {
    console.error("Error saving game state:", error)
    throw error // Re-throw the error to be handled by the caller
  }
}

export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)
    if (serializedState) {
      const gameState = JSON.parse(serializedState) as GameState
      return gameState
    }
    return null
  } catch (error) {
    console.error("Error loading game state:", error)
    return null // Return null if there's an error loading
  }
}

