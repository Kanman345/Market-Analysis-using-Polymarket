AI-Driven Macro Market Intelligence System

An end-to-end macro market intelligence pipeline that uses real-money prediction market data to infer market regimes, economic outlooks, and regime-aware stock opportunities.

This project leverages Polymarket probabilities and a large language model (LLaMA-3) to transform crowd-sourced expectations into structured macro insights.

⸻

🔍 What This Project Does
	•	Ingests live prediction-market data across major macroeconomic themes
	•	Normalizes probabilistic signals from liquid and illiquid markets
	•	Infers market sentiment, risk regime, liquidity conditions, and volatility
	•	Produces regime-aware equity outlooks and stock selections
	•	Outputs strict, structured JSON suitable for dashboards or downstream systems

⸻

📊 Data Sources
	•	Polymarket Gamma API – event & market metadata
	•	Polymarket CLOB API – real-time midpoint prices for outcome tokens

Tracked macro themes include:
	•	Federal Reserve rate decisions
	•	Treasury yield ceilings & floors
	•	Inflation expectations
	•	U.S. recession probability
	•	AI progress benchmarks
	•	Crypto-related corporate behavior

⸻

🧠 Intelligence Layer

The system uses a large language model (LLaMA-3 via Groq) with carefully engineered prompts to:
	•	Infer macro regime (Risk-On / Risk-Off / Transitional)
	•	Assess liquidity and volatility conditions
	•	Derive crowd-implied recession and policy bias
	•	Generate sector-diverse, ETF-free stock recommendations
	•	Enforce strict output validation (JSON-only, no hallucinated assets)

⸻

🏗️ System Architecture

Polymarket APIs
   │
   ├─ Event & Market Fetching (Gamma API)
   ├─ Price Normalization (CLOB midpoint + fallbacks)
   │
   ▼
Structured Macro Probability Dataset
   │
   ▼
LLM Macro Reasoning Engine
   │
   ▼
Market Regime + Asset Outlook + Stock Picks (JSON)


⸻

⚙️ Tech Stack
	•	Python
	•	Polymarket Gamma & CLOB APIs
	•	LangChain
	•	LLaMA-3 (via Groq)
	•	REST APIs
	•	Environment-based secret management

⸻

🚀 How to Run

1️⃣ Clone the repository

git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

2️⃣ Set up environment variables

Create a file named key.env:

GROQ_API_KEY=your_api_key_here

⚠️ key.env is ignored by Git and should never be committed.

(Optional example file is provided as key.env.example.)

3️⃣ Install dependencies

pip install requests langchain-groq python-dotenv

4️⃣ Run the pipeline

python Polymarket_Updated.py


⸻

📈 Sample Output

The system outputs a single structured JSON object containing:
	•	Market sentiment score
	•	Risk & liquidity regime
	•	Crowd-implied recession probability
	•	Asset outlook (equities, bitcoin, U.S. economy)
	•	Top 3 regime-aligned stocks
	•	Risk & stress indicators

Designed for easy integration into dashboards or front-end UIs.

⸻

🔐 Security & Best Practices
	•	API keys are managed via environment variables
	•	Secrets are excluded using .gitignore
	•	Strict JSON validation prevents malformed outputs
	•	ETF and index leakage explicitly blocked

⸻

🎯 Use Cases
	•	Macro regime monitoring
	•	Quant-adjacent research
	•	Market dashboards
	•	AI-assisted investment analysis
	•	Prediction-market research

⸻

📌 Disclaimer

This project is for educational and research purposes only.
It does not constitute financial advice.
