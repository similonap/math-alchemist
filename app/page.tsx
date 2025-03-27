import GameWithLevelSystem from "@/components/game-with-level-system"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-indigo-950 to-purple-950">
      <div className="flex-grow">
        <GameWithLevelSystem />
      </div>
    </main>
  )
}

