"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

function getBiasIcon(bias: string) {
  if (bias === "Positive") return <TrendingUp className="h-5 w-5 text-green-500" />
  if (bias === "Negative") return <TrendingDown className="h-5 w-5 text-red-500" />
  return <Minus className="h-5 w-5 text-yellow-500" />
}

function getBiasColor(bias: string) {
  if (bias === "Positive") return "text-green-500"
  if (bias === "Negative") return "text-red-500"
  return "text-yellow-500"
}

export function AssetOutlookSection({
    asset_outlook,
  }: {
    asset_outlook: Record<
      string,
      {
        bias: "Positive" | "Negative" | "Neutral"
        confidence: number
        reasoning: string
      }
    >
  }) {
    const assetOutlook = asset_outlook
  

    if (Object.keys(assetOutlook).length === 0) { 
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Asset Outlook</h2>
        <p className="text-muted-foreground text-sm">
          No asset-level outlook available for the selected inputs.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Asset Outlook</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(assetOutlook).map(([ticker, outlook]) => (
          <Card key={ticker} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{ticker}</h3>
                <p className={`text-sm font-medium ${getBiasColor(outlook.bias)}`}>
                  {outlook.bias}
                </p>
              </div>
              {getBiasIcon(outlook.bias)}
            </div>

            <div className="text-sm text-muted-foreground">
              {outlook.reasoning}
            </div>

            <div className="pt-2 border-t border-border text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="float-right font-semibold">
                {Math.round(outlook.confidence * 100)}%
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}