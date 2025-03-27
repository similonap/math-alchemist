"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, Award, GraduationCap, Printer } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"
import { motion } from "framer-motion"

interface DiplomaData {
  name: string
  level: number
  date: string
}

interface DiplomaDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string) => void
  maxSum: number
  existingDiploma?: DiplomaData // New prop for existing diplomas
}

export function DiplomaDialog({ isOpen, onClose, onConfirm, maxSum, existingDiploma }: DiplomaDialogProps) {
  const [playerName, setPlayerName] = useState(existingDiploma?.name || "")
  const [showDiploma, setShowDiploma] = useState(!!existingDiploma) // Show diploma immediately if existing
  const [isPrinting, setIsPrinting] = useState(false)
  const diplomaRef = useRef<HTMLDivElement>(null)
  const currentDate = existingDiploma
    ? new Date(existingDiploma.date).toLocaleDateString()
    : new Date().toLocaleDateString()
  const currentLevel = existingDiploma?.level || maxSum

  const handleSubmit = () => {
    if (playerName.trim()) {
      setShowDiploma(true)
      // Only delay closing if this is a new diploma, not a reopened one
      if (!existingDiploma) {
        // Delay closing to allow viewing the diploma
        setTimeout(() => {
          onConfirm(playerName.trim())
          setShowDiploma(false)
          onClose()
        }, 5000)
      }
    }
  }

  const handlePrint = () => {
    setIsPrinting(true)

    // A small delay to ensure the print class is applied
    setTimeout(() => {
      window.print()

      // Remove the printing class after print dialog closes
      setTimeout(() => {
        setIsPrinting(false)
      }, 1000)
    }, 100)
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className={`max-w-md w-full mx-4 ${isPrinting ? "print-mode" : ""}`}>
      {!showDiploma && !existingDiploma ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-purple-200">Congratulations!</h3>
          </div>

          <p className="text-purple-300 mb-4">
            You have mastered all combinations up to {maxSum}! Enter your name to receive your diploma.
          </p>

          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="mb-4 bg-indigo-800/50 border-purple-500/50 text-purple-200"
            maxLength={30}
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-purple-500/50 text-purple-200 hover:bg-purple-800/30 shadow-md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
              disabled={!playerName.trim()}
            >
              Claim Diploma
            </Button>
          </div>
        </>
      ) : (
        <div className="print-container">
          <div className="screen-only flex justify-end mb-4">
            <Button
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
            >
              <Printer className="w-4 h-4 mr-2" /> Print Diploma
            </Button>
          </div>

          <motion.div
            ref={diplomaRef}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="diploma-content bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-900 p-6 rounded-lg border-4 border-double border-amber-700"
          >
            <div className="text-center mb-4">
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <Award className="w-16 h-16 mx-auto text-amber-700" />
              </motion.div>
              <motion.h2
                className="text-2xl font-serif font-bold mt-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Certificate of Achievement
              </motion.h2>
            </div>

            <motion.div
              className="text-center mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg">This certifies that</p>
              <p className="text-xl font-bold my-2">{existingDiploma ? existingDiploma.name : playerName}</p>
              <p className="text-lg mb-2">has successfully mastered all number combinations</p>
              <p className="text-xl font-bold">up to {existingDiploma ? existingDiploma.level : currentLevel}</p>
            </motion.div>

            <motion.div
              className="flex justify-between items-center mt-6 pt-4 border-t border-amber-700"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div>
                <Trophy className="w-6 h-6 text-amber-700 inline mr-2" />
                <span>Magic Academy</span>
              </div>
              <div>{currentDate}</div>
            </motion.div>
          </motion.div>

          <div className="screen-only flex justify-end mt-4">
            <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white shadow-md">
              Close
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

