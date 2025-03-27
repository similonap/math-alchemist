interface ScoreDisplayProps {
  exercisesCompleted: number
  mistakesMade: number
  maxSum: number
}

export function ScoreDisplay({ exercisesCompleted, mistakesMade, maxSum }: ScoreDisplayProps) {
  return (
    <div className="flex justify-between mb-6 text-sm">
      <div className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full">
        Completed: <span className="font-bold">{exercisesCompleted}</span>
      </div>
      <div className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full">
        Max: <span className="font-bold mx-1">{maxSum}</span>
      </div>
      <div className="bg-red-900/50 text-red-300 px-3 py-1 rounded-full">
        Mistakes: <span className="font-bold">{mistakesMade}</span>
      </div>
    </div>
  )
}

