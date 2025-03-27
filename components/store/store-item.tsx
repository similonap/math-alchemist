"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import type { StoreItem as StoreItemType } from "@/lib/store"

interface StoreItemProps {
  item: StoreItemType
  quantity: number
  coins: number
  showOwned: boolean
  isActive?: boolean
  onPurchase: (item: StoreItemType) => void
  onUse?: (item: StoreItemType) => void
  iconMap: Record<string, React.ReactNode>
}

export function StoreItem({ item, quantity, coins, showOwned, isActive, onPurchase, onUse, iconMap }: StoreItemProps) {
  return (
    <motion.div
      className="bg-indigo-800/50 rounded-lg p-4 border border-purple-500/30 flex flex-col shadow-lg relative overflow-hidden"
      whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(147, 51, 234, 0.3)" }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Add a magical glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-lg blur-xl"></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-indigo-700/50 p-3 rounded-full">
            {item.fluidColor ? (
              <div className="relative">
                <div className={`w-10 h-10 text-${item.fluidColor}-400`}>{iconMap[item.icon] || iconMap["Flask"]}</div>
                <div className="absolute inset-0 flex items-center justify-center mt-1">
                  <div className={`w-4 h-4 rounded-full bg-${item.fluidColor}-500`}></div>
                </div>
              </div>
            ) : (
              <div>{iconMap[item.icon] || iconMap["Flask"]}</div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-200">{item.name}</h3>
            <div className="flex items-center text-yellow-400">
              <Coins className="w-4 h-4 mr-1" />
              <span>{item.price}</span>
            </div>
          </div>
        </div>
        <p className="text-purple-300 text-sm mb-4">{item.description}</p>

        {/* Show quantity if player has any */}
        {(quantity > 0 && !item.autoUse) || showOwned ? (
          <div className="mt-auto mb-2 flex items-center">
            <div className="bg-indigo-900/70 px-3 py-1 rounded-full text-purple-200 text-sm flex items-center">
              {showOwned ? (
                <span className="font-bold text-emerald-300">Owned</span>
              ) : (
                <>
                  <span className="font-medium">Owned: </span>
                  <span className="ml-1 font-bold text-yellow-300">{quantity}</span>
                </>
              )}
            </div>
          </div>
        ) : null}

        {/* Buy button */}
        <div className="mt-auto">
          {item.comingSoon ? (
            <Button
              disabled
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 opacity-70 cursor-not-allowed shadow-md"
            >
              Coming Soon
            </Button>
          ) : showOwned ? (
            <Button
              disabled
              className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 text-emerald-200 opacity-70 shadow-md"
            >
              Already Owned
            </Button>
          ) : (
            <Button
              onClick={() => onPurchase(item)}
              disabled={coins < item.price}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 disabled:opacity-70"
            >
              Buy for {item.price} <Coins className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Use button for items in inventory */}
        {quantity > 0 && !item.autoUse && onUse && (item.id === "unicorn" || item.id === "magical_cat") && (
          <Button
            onClick={() => onUse(item)}
            className={`mt-2 w-full ${
              isActive
                ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            } text-white font-medium shadow-md`}
          >
            {isActive
              ? item.id === "unicorn"
                ? "Deactivate Unicorns"
                : "Call Cat Back"
              : item.id === "unicorn"
                ? "Activate Unicorns"
                : "Release Cat"}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

