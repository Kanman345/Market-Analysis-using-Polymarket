import json
import re
from market_data import fetch_all_market_data, attach_event_keys
from signals import compute_company_signal
from llm import call_llm, get_llm_client
from company_signals import get_relevant_event_keys
from signals import compute_fed_rate_cut_signal
from config import PREDEFINED_EVENT_IDS
from market_data import fetch_group_event

GROUP_EVENTS = {
    "fed_rate_cuts_2026",
}

# -------------------------------
# JSON EXTRACTION (ROBUST)
# -------------------------------
def extract_json(text: str) -> dict:
    text = text.strip()

    # Remove ```json fences if present
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
        text = re.sub(r"\n?```$", "", text)

    # Extract largest JSON block
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON object found")

    candidate = match.group(0)

    # Fix common trailing comma issues
    candidate = re.sub(r",\s*}", "}", candidate)
    candidate = re.sub(r",\s*]", "]", candidate)

    return json.loads(candidate)


# -------------------------------
# MARKET DATA COMPRESSION
# -------------------------------
def compress_market_data(market_data):
    return [
        {
            "event_key": m["event_key"],
            "question": m["market_question"],
            "outcomes": m["outcomes"]
        }
        for m in market_data
    ]


# -------------------------------
# ENFORCE ASSET KEYS
# -------------------------------
def enforce_asset_keys(parsed_output: dict, companies: list) -> dict:
    outlook = parsed_output.get("asset_outlook", {})
    allowed = {c.lower() for c in companies}

    parsed_output["asset_outlook"] = {
        k: v for k, v in outlook.items()
        if k.lower() in allowed
    }

    return parsed_output


# -------------------------------
# CORE ENGINE
# -------------------------------
def run_engine(selected_events: list, companies: list):
    # --- 1. Resolve GROUP events (Fed cuts etc.) ---
    group_events = {}

    for key in selected_events:
        if key in GROUP_EVENTS:
            event = fetch_group_event(key)
            if event:
                group_events[key] = event

    # --- 2. Load ALL flattened market data once ---
    all_markets = fetch_all_market_data()

    # --- 3. Decide which event_keys are allowed ---
    event_keys = set(selected_events)

    # OPTIONAL: auto-expand only if explicitly enabled
    AUTO_EXPAND = False

    if AUTO_EXPAND:
        for company in companies:
            event_keys.update(get_relevant_event_keys(company))

    # --- 4. Filter flattened markets ---
    market_data = [
        m for m in all_markets
        if m["event_key"] in event_keys
    ]


    # --- 5. Compress data ---
    market_data = compress_market_data(market_data)

    # --- 6. Compute GROUP signals ---
    fed_signal = None
    if "fed_rate_cuts_2026" in group_events:
        fed_signal = compute_fed_rate_cut_signal(
            group_events["fed_rate_cuts_2026"]
        )

    # --- 7. Compute COMPANY signals ---
    company_signals = {
        c: compute_company_signal(c, market_data)
        for c in companies
    }
    # 5. Build prompt
    prompt = f"""
You are a deterministic macro market intelligence engine.
You must strictly follow rules and output valid JSON only.

You are given probabilistic market signals derived from live market data.
Your job is to infer the current macro regime and produce
a regime-consistent outlook for selected assets and stocks.

FED RATE CUT SIGNAL:
{json.dumps(fed_signal, indent=2)}

COMPANY SIGNALS:
{json.dumps(company_signals, indent=2)}

INPUT DATA:
{json.dumps(market_data, indent=2)}
STOCK SELECTION UNIVERSE:
You may ONLY select stocks from the following list.
t
Technology:
- NVIDIA (NVDA)
- Microsoft (MSFT)
- Alphabet (GOOGL)
- Amazon (AMZN)
- Apple (AAPL)

Energy:
- Exxon Mobil (XOM)
- Chevron (CVX)

Consumer Staples:
- Procter & Gamble (PG)
- Coca-Cola (KO)

Healthcare:
- Johnson & Johnson (JNJ)
- Pfizer (PFE)

Financials:
- JPMorgan Chase (JPM)
- Bank of America (BAC)

OUTPUT REQUIREMENTS:
Return ONE valid JSON object with the following structure:

{{
  "market_sentiment": {{
    "label": "Bullish | Neutral | Bearish",
    "score": integer between 0 and 100
  }},
  "market_regime": {{
    "risk": "Risk-On | Risk-Off | Transitional",
    "liquidity": "Easing | Neutral | Tightening",
    "volatility": "Low | Normal | Elevated"
  }},
  "crowd_signals": {{
    "fed_policy_bias": "",
    "recession_probability": number between 0 and 1,
    "rate_cut_bias": ""
  }},
  "asset_outlook": {{
    "<asset_name>": {{
      "bias": "Positive | Neutral | Negative",
      "confidence": number between 0 and 1,
      "reasoning": ""
    }}
  }},
  "top_stocks": [
    {{
      "name": "",
      "ticker": "",
      "sector": "",
      "reasoning": "",
      "expected_outperformance": "Moderate | High"
    }}
  ],
  "risk_indicators": {{
    "bubble_risk": integer between 0 and 100,
    "market_fragility": integer between 0 and 100,
    "upside_probability": integer between 0 and 100
  }}
}}
STOCK SELECTION RULES(Mandatory):
- Each selected stock MUST be explicitly justified by the inferred macro regime
- In Risk-Off regimes, prefer defensive sectors (Healthcare, Staples, Energy)
- In Risk-On regimes, prefer growth sectors (Technology, Discretionary)
- Do NOT select stocks that contradict the regime

You are STRICTLY FORBIDDEN from returning sector-level, thematic, or generic stock names.
Each entry in "top_stocks" MUST be a real, publicly traded company with a valid ticker.

RULES (MANDATORY):
- Base conclusions ONLY on provided probabilities and signals
- Prioritize rates, yields, inflation, and recession risk
- Do NOT mention prediction markets
- Do NOT add text outside JSON
- Stocks MUST be individual operating companies
- ETFs, indices, sector funds, and baskets are STRICTLY forbidden
- Return EXACTLY 3 stocks in "top_stocks"
- Asset outlook entries MUST correspond to provided COMPANY SIGNALS
- Use company signal confidence as the asset confidence
- Reasoning MUST reference signal strength and dispersion where available
- Do NOT copy a single probability as confidence
- Do NOT include a generic equities outlook
- Reasoning strings MUST be ≤ 25 words
- Do NOT use commas inside reasoning unless necessary
- Prefer short, factual sentences
- fed_policy_bias and rate_cut_bias MUST be derived from FED RATE CUT SIGNAL
- If expected_cuts is null, set both fields to "Unknown"
- Do NOT include probabilities or percentages in labels

CONSISTENCY RULES (ENFORCE):
- If recession_probability > 0.6:
  - market_sentiment MUST NOT be "Bullish"
  - market_regime.risk MUST be "Risk-Off" or "Transitional"
- If fed_policy_bias is "Hawkish" AND rate_cut_bias is "Unlikely":
  - liquidity MUST NOT be "Easing"
- If volatility is "Elevated":
  - market_sentiment.score MUST be ≤ 60

  HARD CONSTRAINT:
- If recession_probability > 0.6, you MUST set:
  - market_sentiment.label to "Neutral" or "Bearish"
  - market_regime.risk to "Risk-Off" or "Transitional"
- You are NOT allowed to violate this rule.

Sentiment scoring guidance:
- 0–30 = Bearish
- 31–60 = Neutral
- 61–100 = Bullish

Return ONLY valid JSON.
"""

    # 6. Call LLM
    client = get_llm_client()
    raw_output = call_llm(client, prompt)

    # 7. Parse + validate output
    try:
        parsed_output = extract_json(raw_output)
        parsed_output = enforce_asset_keys(parsed_output, companies)

        # 🔒 ADD THIS LINE
        parsed_output = enforce_recession_guardrails(parsed_output)

    except Exception as e:
        parsed_output = {
            "error": "LLM_OUTPUT_PARSE_FAILED",
            "message": str(e),
            "raw_output": raw_output[:1500] if isinstance(raw_output, str) else str(raw_output)
        }

    return parsed_output

def enforce_recession_guardrails(output: dict) -> dict:
    """
    Hard safety rules that the LLM is not allowed to violate.
    """

    crowd = output.get("crowd_signals", {})
    regime = output.get("market_regime", {})
    sentiment = output.get("market_sentiment", {})

    recession_prob = crowd.get("recession_probability")

    if recession_prob is not None and recession_prob > 0.6:
        # Sentiment cannot be bullish
        if sentiment.get("label") == "Bullish":
            sentiment["label"] = "Neutral"

        # Cap sentiment score
        if "score" in sentiment:
            sentiment["score"] = min(sentiment["score"], 60)

        # Risk regime cannot be Risk-On
        regime["risk"] = "Risk-Off"

    return output