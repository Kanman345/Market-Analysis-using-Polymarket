Market Pulse

Market Pulse is a probabilistic market intelligence MVP that infers macro regimes and stock-level outlooks using real-money prediction market data.

No narratives. No opinions. Only market-implied probabilities.

⸻

What It Does

Users select:
	•	Macro signals (recession risk, rate cuts, inflation, liquidity)
	•	Companies (e.g. NVDA, MSFT, GOOGL)

Market Pulse then:
	•	Aggregates prediction market probabilities
	•	Infers the current macro regime
	•	Produces regime-consistent asset outlooks

Outputs are deterministic and probability-driven.

⸻

Key Features
	•	Macro Regime: Risk-On / Risk-Off / Transitional
	•	Crowd Signals: Recession probability, policy bias
	•	Asset Outlook: Direction, confidence, reasoning
	•	Risk Indicators: Bubble risk, fragility, asymmetry

⸻

Tech Stack

Backend
	•	Python, FastAPI
	•	Polymarket API
	•	Deterministic signal engine
	•	LLM via Sarvam AI

Frontend
	•	Next.js (App Router)
	•	TypeScript, Tailwind CSS

⸻

Run Locally

Backend

uvicorn app:app --reload

Frontend

npm install
npm run dev


⸻

API Example

{
  "events": ["inflation_2026", "us_recession_2026"],
  "companies": ["NVDA", "MSFT", "GOOGL"]
}


⸻

Notes
	•	MVP for exploration only
	•	Not financial advice
	•	Reflects market beliefs, not certainty

⸻

Powered by Polymarket & Sarvam AI
