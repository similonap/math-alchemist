// app/stats/page.tsx

// Import the CombinationCard component
import { CombinationCard } from "@/components/stats/combination-card"

export default function StatsPage() {
  const topNumber = 10 // Example value
  const combinations = [
    { leftNumber: 1, rightNumber: 1, stats: { winRate: 0.5, gamesPlayed: 100 } },
    { leftNumber: 1, rightNumber: 2, stats: { winRate: 0.6, gamesPlayed: 120 } },
    { leftNumber: 2, rightNumber: 1, stats: { winRate: 0.4, gamesPlayed: 80 } },
    { leftNumber: 2, rightNumber: 2, stats: { winRate: 0.7, gamesPlayed: 150 } },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stats</h1>
      <div className="grid grid-cols-2 gap-4">
        {combinations.map(({ leftNumber, rightNumber, stats }) => (
          <div key={`${leftNumber}-${rightNumber}`} className="transition-all duration-300 hover:scale-105">
            <CombinationCard topNumber={topNumber} leftNumber={leftNumber} rightNumber={rightNumber} stats={stats} />
          </div>
        ))}
      </div>
    </div>
  )
}

