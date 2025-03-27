"use client"

import { Button } from "@/components/ui/button"
import { Banknote } from "lucide-react"

interface CheatButtonProps {
  onClick: () => void
  amount?: number
  className?: string
  visible?: boolean
}

export function CheatButton({ onClick, amount = 1000, className = "", visible = false }: CheatButtonProps) {
  if (!visible) return null

  return (
    <Button
      onClick={onClick}
      size="sm"
      className={`bg-black/30 hover:bg-black/50 text-white border border-purple-500/30 ${className}`}
      title={`Development: Add ${amount} coins`}
    >
      <Banknote className="w-4 h-4 mr-1" /> +{amount}
    </Button>
  )
}

