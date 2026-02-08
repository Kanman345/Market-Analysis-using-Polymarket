"use client"

export type SentimentGaugeProps = {
  value: number // 0–100
}

export function SentimentGauge({ value }: SentimentGaugeProps) {
  const rotation = (value / 100) * 180 - 90

  const getSentimentLabel = (val: number) => {
    if (val < 35) return "Bearish"
    if (val < 65) return "Neutral"
    return "Bullish"
  }

  const getSentimentColor = (val: number) => {
    if (val < 35) return "text-red-500"
    if (val < 65) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-sm text-muted-foreground">Market Sentiment</h2>

      <div className="relative w-64 h-32">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-border"
          />
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className={getSentimentColor(value)}
            opacity="0.4"
          />

          <g transform={`rotate(${rotation} 100 90)`}>
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="30"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle cx="100" cy="90" r="5" fill="currentColor" />
          </g>
        </svg>
      </div>

      <div className="text-center">
        <div className={`text-2xl font-bold ${getSentimentColor(value)}`}>
          {getSentimentLabel(value)}
        </div>
        <div className="text-xs text-muted-foreground">
          Score: {value}/100
        </div>
      </div>
    </div>
  )
}