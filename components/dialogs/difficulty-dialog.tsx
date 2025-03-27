"use client"

import { Button } from "@/components/ui/button"
import { Coins, AlertTriangle } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"

interface DifficultyDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  cost: number
  currentCoins: number
}

export function DifficultyDialog({ isOpen, onClose, onConfirm, cost, currentCoins }: DifficultyDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-md w-full mx-4">
      <div className="flex items-center gap-3 mb-4 text-yellow-300">
        <AlertTriangle className="w-6 h-6" />
        <h3 className="text-xl font-bold">Lower Difficulty</h3>
      </div>

      <p className="text-purple-200 mb-4">
        Lowering the difficulty will cost you <span className="font-bold text-yellow-400">{cost} coins</span>.
      </p>

      <div className="bg-purple-950/50 rounded-lg p-3 mb-4 border border-purple-700/30">
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          <Coins className="w-4 h-4" />
          <span className="font-semibold">Current coins: {currentCoins}</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <Coins className="w-4 h-4" />
          <span className="font-semibold">After cost: {currentCoins - cost}</span>
        </div>
      </div>

      <p className="text-purple-300 text-sm mb-6">Are you sure you want to make the game easier?</p>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-purple-500/50 text-purple-200 hover:bg-purple-800/30"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
          disabled={cost > currentCoins}
        >
          Pay {cost} <Coins className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {cost > currentCoins && <p className="text-red-400 text-sm mt-3 text-center">You don't have enough coins!</p>}
    </Dialog>
  )
}

