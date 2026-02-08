"use client"

import { Card } from "@/components/ui/card"
import { useAnalysis } from "@/lib/analysis-context"

function getProbabilityLabel(p: number) {
  if (p >= 0.7) return "High"
  if (p >= 0.4) return "Moderate"
  return "Low"
}

export function CrowdSentimentSection() {
  const { analysis } = useAnalysis()
  const crowd = analysis?.crowd_signals

  if (!crowd) return null

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Crowd Signals</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <div className="text-sm text-muted-foreground">Federal Reserve Bias</div>
          <div className="text-lg font-semibold">
            {crowd.fed_policy_bias}
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="text-sm text-muted-foreground">Recession Risk</div>
          <div className="text-lg font-semibold">
            {Math.round(crowd.recession_probability * 100)}%
            <span className="ml-2 text-sm text-muted-foreground">
              ({getProbabilityLabel(crowd.recession_probability)})
            </span>
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="text-sm text-muted-foreground">Rate Cut Bias</div>
          <div className="text-lg font-semibold">
            {crowd.rate_cut_bias}
          </div>
        </Card>
      </div>
    </div>
  )
}