"use client"

import { Card } from "@/components/ui/card"
import { useAnalysis } from "@/lib/analysis-context"

function colorByLevel(level: string) {
  switch (level) {
    case "Risk-On":
      return "text-green-500"
    case "Risk-Off":
      return "text-red-500"
    default:
      return "text-yellow-500"
  }
}

function badgeColor(value: number) {
  if (value >= 70) return "bg-red-500/20 text-red-500"
  if (value >= 40) return "bg-yellow-500/20 text-yellow-500"
  return "bg-green-500/20 text-green-500"
}

export function MarketRegimeSection() {
  const { analysis } = useAnalysis()

  if (!analysis) return null

  const { market_regime, market_sentiment, risk_indicators } = analysis

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Market Regime</h2>

      {/* Regime Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 space-y-1">
          <div className="text-sm text-muted-foreground">Risk Regime</div>
          <div
            className={`text-xl font-semibold ${colorByLevel(
              market_regime.risk
            )}`}
          >
            {market_regime.risk}
          </div>
        </Card>

        <Card className="p-5 space-y-1">
          <div className="text-sm text-muted-foreground">Liquidity</div>
          <div className="text-xl font-semibold">
            {market_regime.liquidity}
          </div>
        </Card>

        <Card className="p-5 space-y-1">
          <div className="text-sm text-muted-foreground">Volatility</div>
          <div className="text-xl font-semibold">
            {market_regime.volatility}
          </div>
        </Card>
      </div>

      {/* Sentiment */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">
              Market Sentiment
            </div>
            <div className="text-lg font-semibold">
              {market_sentiment.label}
            </div>
          </div>
          <div className="text-3xl font-bold">
            {market_sentiment.score}
          </div>
        </div>
      </Card>

      {/* Risk Indicators */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <div className="text-sm text-muted-foreground">Bubble Risk</div>
          <div
            className={`inline-block px-3 py-1 rounded text-sm ${badgeColor(
              risk_indicators.bubble_risk
            )}`}
          >
            {risk_indicators.bubble_risk} / 100
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="text-sm text-muted-foreground">
            Market Fragility
          </div>
          <div
            className={`inline-block px-3 py-1 rounded text-sm ${badgeColor(
              risk_indicators.market_fragility
            )}`}
          >
            {risk_indicators.market_fragility} / 100
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="text-sm text-muted-foreground">
            Upside Probability
          </div>
          <div
            className={`inline-block px-3 py-1 rounded text-sm ${badgeColor(
              100 - risk_indicators.upside_probability
            )}`}
          >
            {risk_indicators.upside_probability}%
          </div>
        </Card>
      </div>
    </div>
  )
}