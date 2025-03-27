"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X, FlaskRoundIcon as Flask } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"

interface LabNameDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string) => void
  initialName: string
}

export function LabNameDialog({ isOpen, onClose, onConfirm, initialName }: LabNameDialogProps) {
  const [newLabName, setNewLabName] = useState(initialName)

  const handleSubmit = () => {
    if (newLabName.trim()) {
      onConfirm(newLabName.trim())
      onClose()
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-md w-full mx-4">
      <div className="flex items-center gap-3 mb-4">
        <Flask className="w-6 h-6 text-purple-300" />
        <h3 className="text-xl font-bold text-purple-200">Name Your Magical Lab</h3>
      </div>

      <p className="text-purple-300 mb-4">
        Choose a name for your magical laboratory. This name will be displayed in the game.
      </p>

      <Input
        value={newLabName}
        onChange={(e) => setNewLabName(e.target.value)}
        placeholder="Enter lab name"
        className="mb-4 bg-indigo-800/50 border-purple-500/50 text-purple-200"
        maxLength={30}
      />

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-purple-500/50 text-purple-200 hover:bg-purple-800/30 shadow-md"
        >
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
          disabled={!newLabName.trim()}
        >
          <Check className="w-4 h-4 mr-1" /> Save Name
        </Button>
      </div>
    </Dialog>
  )
}

