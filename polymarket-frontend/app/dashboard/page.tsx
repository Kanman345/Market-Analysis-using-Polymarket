"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

import { SentimentGauge } from "@/components/sentiment-gauge"
import { StatusBadges } from "@/components/status-badges"
import { MarketRegimeSection } from "@/components/market-regime-section"
import { CrowdSentimentSection } from "@/components/crowd-sentiment-section"
import { AssetOutlookSection } from "@/components/asset-outlook-section"
import { RiskStressSection } from "@/components/risk-stress-section"

import { useAnalysis } from "@/lib/analysis-context"

export default function MarketPulseDashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  const {
    analysis,
    isLoading,
    error,
    runAnalysis,
  } = useAnalysis()

  useEffect(() => {
    runAnalysis()
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <div className="bg-background text-foreground min-h-screen">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                <span className="text-lg font-bold">MP</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Market Pulse</h1>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Loading / Error States */}
          {isLoading && (
            <Card className="p-6 text-center text-muted-foreground">
              Analyzing market signals…
            </Card>
          )}

          {error && (
            <Card className="p-6 text-center text-destructive">
              Failed to load analysis
            </Card>
          )}

          {analysis && (
            <>
              <Card className="p-6">
                <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
                  <SentimentGauge value={analysis.market_sentiment.score} />
                  <StatusBadges
                    risk={analysis.market_regime.risk}
                    liquidity={analysis.market_regime.liquidity}
                    volatility={analysis.market_regime.volatility}
                  />
                </div>
              </Card>

              <MarketRegimeSection />
              <CrowdSentimentSection  />
              <AssetOutlookSection asset_outlook={analysis.asset_outlook} />
              <RiskStressSection risk_indicators={analysis.risk_indicators} />
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Market Pulse • Visual Analytics Dashboard</p>
            <p className="mt-1">Not Financial Advice</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
