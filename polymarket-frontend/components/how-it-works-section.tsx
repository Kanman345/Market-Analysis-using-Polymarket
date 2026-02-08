"use client"

import { ArrowRight } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto max-w-4xl px-4 space-y-16">
        {/* Header */}
        <header className="text-center space-y-3">
          <h2 className="text-3xl font-bold">How Market Pulse Works</h2>
          <p className="text-muted-foreground">
            From real-money probabilities to structured market intelligence.
          </p>
        </header>

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Step 1 */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">
              1. Prediction market signals
            </h3>
            <p className="text-muted-foreground">
              Market Pulse ingests probabilities from prediction markets where
              participants put real capital at risk on macroeconomic, policy,
              and company-specific outcomes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">
              2. Signal mapping & filtering
            </h3>
            <p className="text-muted-foreground">
              Each event is mapped to macro drivers such as inflation, rates,
              liquidity, growth, and risk appetite. Irrelevant or redundant
              signals are filtered out.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">
              3. Sarvam AI reasoning layer
            </h3>
            <p className="text-muted-foreground">
              Sarvam AI acts as a structured reasoning engine - translating
              probabilistic signals into coherent market regimes, sentiment
              scores, and asset-level bias.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">
              4. Deterministic outputs
            </h3>
            <p className="text-muted-foreground">
              The result is a transparent, repeatable market snapshot:
              sentiment, risk regime, crowd signals, and confidence-weighted
              outlooks - without narratives or opinions.
            </p>
          </div>
        </div>

        {/* Flow hint */}
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span>Prediction Markets</span>
          <ArrowRight className="h-4 w-4" />
          <span>Sarvam AI</span>
          <ArrowRight className="h-4 w-4" />
          <span>Market Pulse Dashboard</span>
        </div>
      </div>
    </section>
  )
}