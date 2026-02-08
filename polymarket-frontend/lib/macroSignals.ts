import { MacroSignalKey } from "./types"

export const MACRO_SIGNALS: Record<
  MacroSignalKey,
  {
    label: string
    description: string
    category: string
  }
> = {
  fed_rate_cuts_2026: {
    label: "Fed rate cuts in 2026",
    description: "Market-implied expectations for monetary easing",
    category: "Monetary Policy"
  },
  us_recession_2026: {
    label: "US recession probability",
    description: "Probability of economic contraction by 2026",
    category: "Growth & Recession"
  },
  inflation_2026: {
    label: "Inflation outlook 2026",
    description: "Long-term inflation expectations",
    category: "Inflation & Liquidity"
  },
  treasury_yield_high: {
    label: "Treasury yield upper bound",
    description: "Market expectations for long-term yields",
    category: "Inflation & Liquidity"
  },
  treasury_yield_low: {
    label: "Treasury yield lower bound",
    description: "Downside yield expectations",
    category: "Inflation & Liquidity"
  },
  fed_decision_march: {
    label: "Fed decision in March",
    description: "Near-term policy action expectations",
    category: "Monetary Policy"
  },
  ai_frontiermath_90: {
    label: "AI frontier progress",
    description: "Risk appetite for frontier technology",
    category: "Risk Appetite"
  },
  microstrategy_btc_sale: {
    label: "Crypto institutional stress",
    description: "Liquidity stress signals in crypto markets",
    category: "Risk Appetite"
  },
  nvidia_february_2026: {
    label: "NVIDIA price targets",
    description: "Market-implied upside expectations",
    category: "Technology"
  }
}