"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// Add the function call to the GraduationCap icon import
import { Coins, Sparkles, FlaskRoundIcon as Flask, Beaker, ChevronDown, GraduationCap, Scroll } from "lucide-react"
import { useGameStore, type StoreItem } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { LabNameDialog } from "@/components/dialogs/lab-name-dialog"
// Import the CheatButton component
import { CheatButton } from "@/components/game/cheat-button"
// Add this import at the top
import { isCheatButtonVisible } from "@/lib/dev-tools"
// First, add the DiplomaDialog import at the top with the other imports
import { DiplomaDialog } from "@/components/dialogs/diploma-dialog"
import { FluidMixingLab } from "@/components/store/fluid-mixing-lab"

// Map of icon names to components
const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-10 h-10 text-pink-400" />,
  Flask: <Flask className="w-10 h-10 text-indigo-400" />,
  Beaker: <Beaker className="w-10 h-10 text-teal-400" />,
  ArrowDown: <ChevronDown className="w-10 h-10 text-purple-400" />,
  // In the iconMap object, add:
  GraduationCap: <GraduationCap className="w-10 h-10 text-yellow-400" />,
}

// Add this function after the getCurrentFluidColorName function
const getPurchasedItems = () => {
  const { inventory, storeItems } = useGameStore.getState()

  // Filter store items to only include those that have been purchased
  return storeItems.filter((item) => {
    // For non-consumable items, check if they're in the inventory
    if (!item.consumable) {
      return inventory[item.id] && inventory[item.id] > 0
    }

    // For consumable items, check if they've ever been purchased
    // This includes items that might have been used up
    return inventory[item.id] !== undefined
  })
}

export function MagicStore() {
  const {
    coins,
    storeItems,
    purchaseItem,
    labName,
    setLabName,
    getItemQuantity,
    activeFluidColors,
    selectedFluidColors,
    selectFluidColor,
    mixSelectedFluids,
    getCurrentFluidColor,
    isAnimatingFluidMix,
    animatingFluidColors,
    fluidMixExpiry,
    getFluidEffectsDescription,
    getRemainingFluidTime,
    checkFluidExpiry,
    unicornMode,
    toggleUnicornMode,
    maxSum,
    catActive,
    toggleCat,
    addCoins,
    // Add this line with the other store imports
    allCombinationsMastered,
    diplomas,
    isPouringAnimation,
    pouringColor,
    getAnimatingFluidColor,
  } = useGameStore()
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null)
  const [showLabNameDialog, setShowLabNameDialog] = useState(false)
  const [remainingTime, setRemainingTime] = useState(getRemainingFluidTime())
  // Inside the component, add this state
  const [cheatVisible, setCheatVisible] = useState(false)
  // Add this to the state variables inside the MagicStore component
  const [showDiplomaDialog, setShowDiplomaDialog] = useState(false)
  // Add this state variable with the other state variables
  const [selectedDiploma, setSelectedDiploma] = useState<null | {
    name: string
    level: number
    date: string
  }>(null)
  // Add this state variable with the other state variables
  const [showInventory, setShowInventory] = useState(false)
  const purchasedItems = getPurchasedItems()

  // Check if player has purchased the Fluid Mixing Lab
  const hasFluidLab = getItemQuantity("fluid_lab") > 0
  const hasUnicorn = getItemQuantity("unicorn") > 0
  const hasCat = getItemQuantity("magical_cat") > 0

  // Add this useEffect
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

  // Update the timer every second
  useEffect(() => {
    if (!fluidMixExpiry) return

    const interval = setInterval(() => {
      checkFluidExpiry()
      setRemainingTime(getRemainingFluidTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [fluidMixExpiry, getRemainingFluidTime, checkFluidExpiry])

  // Format the remaining time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Handle purchase
  const handlePurchase = (item: StoreItem) => {
    // Special case for name_lab - don't charge yet, just show dialog
    if (item.id === "name_lab") {
      setShowLabNameDialog(true)
      return
    }

    // For all other items, proceed with normal purchase
    if (coins >= item.price) {
      // Check if trying to buy fluid_lab again
      if (item.id === "fluid_lab" && hasFluidLab) {
        setPurchaseMessage("You already own the Fluid Mixing Lab!")
        setTimeout(() => setPurchaseMessage(null), 3000)
        return
      }

      // Check if trying to buy unicorn again
      if (item.id === "unicorn" && hasUnicorn) {
        setPurchaseMessage("You already own the Magical Unicorn!")
        setTimeout(() => setPurchaseMessage(null), 3000)
        return
      }

      const success = purchaseItem(item.id)

      if (success) {
        setPurchaseMessage(`You purchased ${item.name}!`)
      } else {
        setPurchaseMessage("Purchase failed!")
      }
    } else {
      setPurchaseMessage("Not enough coins!")
    }

    setTimeout(() => setPurchaseMessage(null), 3000)
  }

  // Handle using an item
  const handleUseItem = (item: StoreItem) => {
    if (item.id === "name_lab") {
      setShowLabNameDialog(true)
    } else if (item.id === "unicorn") {
      setPurchaseMessage(unicornMode ? "Unicorn mode deactivated!" : "Unicorn mode activated!")
      toggleUnicornMode()
      setTimeout(() => setPurchaseMessage(null), 3000)
    } else if (item.id === "magical_cat") {
      setPurchaseMessage(catActive ? "Magical Cat is taking a nap!" : "Magical Cat is on the prowl!")
      toggleCat()
      setTimeout(() => setPurchaseMessage(null), 3000)
    }
  }

  // Check if player has fluid vials
  const getFluidVialCount = (color: string) => {
    const colorItemId = `${color}_fluid`
    return getItemQuantity(colorItemId)
  }

  // Handle selecting a fluid vial
  const handleSelectFluidVial = (color: "red" | "blue" | "yellow") => {
    selectFluidColor(color)
  }

  // Handle mixing the selected fluids
  const handleMixFluids = () => {
    const success = mixSelectedFluids()
    if (success) {
      setPurchaseMessage("Fluids mixed successfully! Effects last for 2 minutes.")
    } else {
      setPurchaseMessage("Failed to mix fluids. Check your vials!")
    }
    setTimeout(() => setPurchaseMessage(null), 3000)
  }

  // Get the current fluid color name
  const getCurrentFluidColorName = () => {
    const { red, blue, yellow } = activeFluidColors

    if (!red && !blue && !yellow) return "White"
    if (red && blue && yellow) return "Rainbow"
    if (red && blue && !yellow) return "Purple"
    if (red && !blue && yellow) return "Orange"
    if (!red && blue && yellow) return "Green"
    if (red) return "Red"
    if (blue) return "Blue"
    if (yellow) return "Yellow"

    return "White"
  }

  return (
    <>
      <Card className="bg-indigo-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-500/30 h-full overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-200">Magic Shop</h2>
          <Button
            onClick={() => setShowInventory(!showInventory)}
            variant="outline"
            className="border-purple-500/50 text-purple-200 hover:bg-purple-800/30"
          >
            <Scroll className="w-4 h-4 mr-2" />
            {showInventory ? "Show Shop" : "My Items"}
          </Button>
        </div>
        <p className="text-purple-300 text-center mb-6">
          {showInventory ? "Your magical collection" : "Spend your coins on magical items!"}
        </p>
        {/* Dev Cheat Button */}
        <div className="absolute top-2 right-2">
          <CheatButton
            onClick={() => {
              const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
              addCoins(1000, position)
            }}
            visible={cheatVisible}
          />
        </div>

        {showInventory && (
          <div className="mb-8">
            {purchasedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purchasedItems.map((item) => {
                  const quantity = getItemQuantity(item.id)
                  const isActive = (item.id === "unicorn" && unicornMode) || (item.id === "magical_cat" && catActive)

                  return (
                    <motion.div
                      key={item.id}
                      className="bg-indigo-800/50 rounded-lg p-4 border border-purple-500/30 flex flex-col shadow-lg relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-lg blur-xl"></div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="bg-indigo-700/50 p-3 rounded-full">
                            {item.fluidColor ? (
                              <div className="relative">
                                <Flask className={`w-10 h-10 text-${item.fluidColor}-400`} />
                                <div className="absolute inset-0 flex items-center justify-center mt-1">
                                  <div className={`w-4 h-4 rounded-full bg-${item.fluidColor}-500`}></div>
                                </div>
                              </div>
                            ) : (
                              iconMap[item.icon] || <Flask className="w-10 h-10 text-indigo-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-purple-200">{item.name}</h3>
                            {item.consumable && quantity > 0 && (
                              <div className="flex items-center text-emerald-400">
                                <span>Quantity: {quantity}</span>
                              </div>
                            )}
                            {item.consumable && quantity === 0 && (
                              <div className="flex items-center text-yellow-400">
                                <span>Used</span>
                              </div>
                            )}
                            {!item.consumable && (
                              <div className="flex items-center text-emerald-400">
                                <span>Permanent</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-purple-300 text-sm mb-4">{item.description}</p>

                        {/* Use button for items in inventory */}
                        {quantity > 0 && !item.autoUse && (item.id === "unicorn" || item.id === "magical_cat") && (
                          <Button
                            onClick={() => handleUseItem(item)}
                            className={`mt-auto w-full ${
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

                        {/* For diplomas, show view button */}
                        {item.id === "diploma" && (
                          <Button
                            onClick={() => {
                              // Find the highest level diploma
                              const highestDiploma = diplomas.sort((a, b) => b.level - a.level)[0]
                              if (highestDiploma) {
                                setSelectedDiploma(highestDiploma)
                                setShowDiplomaDialog(true)
                              }
                            }}
                            className="mt-auto w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-medium shadow-md"
                            disabled={diplomas.length === 0}
                          >
                            View Diploma
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-indigo-900/50 p-6 rounded-lg text-center">
                <p className="text-purple-300">You haven't purchased any items yet.</p>
                <p className="text-purple-300 mt-2">Complete exercises to earn coins and buy magical items!</p>
              </div>
            )}
          </div>
        )}

        {/* Fluid Mixing Lab Section - Only show if player has purchased it */}
        {!showInventory && hasFluidLab && (
          <FluidMixingLab
            fluidVialCounts={{
              red: getFluidVialCount("red"),
              blue: getFluidVialCount("blue"),
              yellow: getFluidVialCount("yellow"),
            }}
            selectedColors={selectedFluidColors}
            activeColors={activeFluidColors}
            animatingColors={animatingFluidColors}
            isAnimating={isAnimatingFluidMix}
            fluidEffects={getFluidEffectsDescription()}
            remainingTime={remainingTime}
            onSelectFluid={handleSelectFluidVial}
            onMixFluids={handleMixFluids}
            getCurrentFluidColor={getCurrentFluidColor}
            getCurrentFluidColorName={getCurrentFluidColorName}
          />
        )}

        {!showInventory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* In the return statement, where the storeItems are mapped, modify the start of the mapping logic to filter items conditionally */}
            {storeItems.map((item) => {
              // Skip the diploma item if not all combinations are mastered
              if (item.id === "diploma" && !allCombinationsMastered) {
                return null
              }

              const quantity = getItemQuantity(item.id)

              // Skip fluid colors if player doesn't have the Fluid Mixing Lab
              if (!showInventory && item.fluidColor && !hasFluidLab) {
                return null
              }

              // For non-consumable items, show "Owned" instead of quantity
              const showOwned =
                (item.id === "fluid_lab" || item.id === "unicorn" || item.id === "magical_cat") && quantity > 0

              // Special handling for diploma - show button to open dialog instead of buy button
              if (item.id === "diploma") {
                // Check if a diploma for the current level already exists
                const hasDiplomaForCurrentLevel = diplomas.some((d) => d.level === maxSum)

                return (
                  <motion.div
                    key={item.id}
                    className="bg-yellow-800/50 rounded-lg p-4 border border-yellow-500/30 flex flex-col shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(234, 179, 8, 0.3)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/10 to-amber-600/10 rounded-lg blur-xl"></div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="bg-yellow-700/50 p-3 rounded-full">
                          <GraduationCap className="w-10 h-10 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-yellow-200">{item.name}</h3>
                          <div className="flex items-center text-yellow-400">
                            <Coins className="w-4 h-4 mr-1" />
                            <span>{item.price}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-yellow-300 text-sm mb-4">
                        {hasDiplomaForCurrentLevel
                          ? `You already have a diploma for level ${maxSum}. Master all combinations at the next level to earn another diploma!`
                          : `${item.description} (Level ${maxSum})`}
                      </p>
                      <div className="mt-auto">
                        <Button
                          onClick={() => setShowDiplomaDialog(true)}
                          disabled={coins < item.price || hasDiplomaForCurrentLevel}
                          className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-medium shadow-md disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 disabled:opacity-70"
                        >
                          {hasDiplomaForCurrentLevel ? "Already Claimed" : "Claim Diploma"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              }

              return (
                // Original store item rendering
                <motion.div
                  key={item.id}
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
                            <Flask className={`w-10 h-10 text-${item.fluidColor}-400`} />
                            <div className="absolute inset-0 flex items-center justify-center mt-1">
                              <div className={`w-4 h-4 rounded-full bg-${item.fluidColor}-500`}></div>
                            </div>
                          </div>
                        ) : (
                          iconMap[item.icon] || <Flask className="w-10 h-10 text-indigo-400" />
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
                          onClick={() => handlePurchase(item)}
                          disabled={coins < item.price}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 disabled:opacity-70"
                        >
                          Buy for {item.price} <Coins className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>

                    {/* Use button for items in inventory */}
                    {quantity > 0 && !item.autoUse && (item.id === "unicorn" || item.id === "magical_cat") && (
                      <Button
                        onClick={() => handleUseItem(item)}
                        className={`mt-2 w-full ${
                          (unicornMode && item.id === "unicorn") || (catActive && item.id === "magical_cat")
                            ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        } text-white font-medium shadow-md`}
                      >
                        {unicornMode && item.id === "unicorn"
                          ? "Deactivate Unicorns"
                          : item.id === "unicorn"
                            ? "Activate Unicorns"
                            : catActive && item.id === "magical_cat"
                              ? "Call Cat Back"
                              : "Release Cat"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Purchase message */}
        <AnimatePresence>
          {purchaseMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-purple-800 text-purple-200 px-6 py-3 rounded-lg shadow-lg"
            >
              {purchaseMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Lab Name Dialog - moved outside the Card component */}
      <LabNameDialog
        isOpen={showLabNameDialog}
        onClose={() => setShowLabNameDialog(false)}
        onConfirm={(name) => {
          // Purchase the item now (which charges the coins)
          const success = purchaseItem("name_lab")

          if (success) {
            // Set the new name
            setLabName(name)
            setPurchaseMessage("Lab name updated successfully!")
            setTimeout(() => setPurchaseMessage(null), 3000)
          } else {
            setPurchaseMessage("Failed to update lab name!")
            setTimeout(() => setPurchaseMessage(null), 3000)
          }
        }}
        initialName={labName}
      />
      {/* Add the DiplomaDialog component at the very bottom of the return statement, just before the closing fragment tag */}
      <DiplomaDialog
        isOpen={showDiplomaDialog}
        onClose={() => setShowDiplomaDialog(false)}
        onConfirm={(name) => {
          // We'll pass the player's name to the store action
          purchaseItem("diploma", name)
        }}
        maxSum={maxSum}
        selectedDiploma={selectedDiploma}
      />
    </>
  )
}

