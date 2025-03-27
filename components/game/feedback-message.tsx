interface FeedbackMessageProps {
  isCorrect: boolean | null
}

export function FeedbackMessage({ isCorrect }: FeedbackMessageProps) {
  return (
    <div className="h-8 mb-4 text-center">
      {isCorrect === true && <p className="text-green-400 font-bold">Great job! That's correct! 🎉</p>}
      {isCorrect === false && <p className="text-red-400">Try again! You can do it! 💪</p>}
    </div>
  )
}

