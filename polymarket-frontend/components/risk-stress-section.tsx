"use client"

import { Card } from "@/components/ui/card"
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"

function severityColor(value: number) {
  if (value >= 70) return "text-red-500"
  if (value >= 40) return "text-yellow-500"
  return "text-green-500"
}

function barColor(value: number) {
  if (value >= 70) return "bg-red-500"
  if (value >= 40) return "bg-yellow-500"
  return "bg-green-500"
}

export function RiskStressSection({
  risk_indicators,
}: {
  risk_indicators: {
    bubble_risk: number
    market_fragility: number
    upside_probability: number
  }
}) {
  const { bubble_risk, market_fragility, upside_probability } =
    risk_indicators


  const downside_probability = 100 - upside_probability

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Risk & Stress</h2>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Bubble Risk */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${severityColor(bubble_risk)}`} />
            <h3 className="font-semibold">Bubble Risk</h3>
          </div>

          <div className="text-3xl font-bold">{bubble_risk}</div>
          <div className="text-sm text-muted-foreground">0–100 systemic scale</div>

          <div className="h-2 bg-secondary rounded overflow-hidden">
            <div
              className={`h-full ${barColor(bubble_risk)}`}
              style={{ width: `${bubble_risk}%` }}
            />
          </div>
        </Card>

        {/* Market Fragility */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${severityColor(market_fragility)}`} />
            <h3 className="font-semibold">Market Fragility</h3>
          </div>

          <div className="text-3xl font-bold">{market_fragility}</div>
          <div className="text-sm text-muted-foreground">
            Sensitivity to shocks
          </div>

          <div className="h-2 bg-secondary rounded overflow-hidden">
            <div
              className={`h-full ${barColor(market_fragility)}`}
              style={{ width: `${market_fragility}%` }}
            />
          </div>
        </Card>

        {/* Risk Asymmetry */}
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Risk Asymmetry</h3>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Upside
              </span>
              <span className="font-semibold">{upside_probability}%</span>
            </div>
            <div className="h-2 bg-secondary rounded overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${upside_probability}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Downside
              </span>
              <span className="font-semibold">{downside_probability}%</span>
            </div>
            <div className="h-2 bg-secondary rounded overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${downside_probability}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}