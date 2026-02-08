// --------------------
// INPUT TYPES
// --------------------

export type MacroSignalKey =
  | "fed_rate_cuts_2026"
  | "us_recession_2026"
  | "inflation_2026"
  | "treasury_yield_high"
  | "treasury_yield_low"
  | "fed_decision_march"
  | "ai_frontiermath_90"
  | "microstrategy_btc_sale"
  | "nvidia_february_2026"

export type AnalyzeRequest = {
  events: MacroSignalKey[]
  companies: string[]
}

// --------------------
// OUTPUT TYPES
// --------------------

export type MarketSentiment = {
  label: "Bullish" | "Neutral" | "Bearish"
  score: number
}

export type MarketRegime = {
  risk: "Risk-On" | "Risk-Off" | "Transitional"
  liquidity: "Easing" | "Neutral" | "Tightening"
  volatility: "Low" | "Normal" | "Elevated"
}

export type AssetOutlook = {
  bias: "Positive" | "Neutral" | "Negative"
  confidence: number
  reasoning: string
}

export type TopStock = {
  name: string
  ticker: string
  sector: string
  reasoning: string
  expected_outperformance: "Moderate" | "High"
}

export type AnalyzeResponse = {
  market_sentiment: MarketSentiment
  market_regime: MarketRegime
  crowd_signals: {
    fed_policy_bias: string
    recession_probability: number
    rate_cut_bias: string
  }
  asset_outlook: Record<string, AssetOutlook>
  top_stocks: TopStock[]
  risk_indicators: {
    bubble_risk: number
    market_fragility: number
    upside_probability: number
  }
}