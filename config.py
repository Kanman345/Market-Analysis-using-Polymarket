from dotenv import load_dotenv
import os

# Load env vars
load_dotenv("key.env")

# ===============================
# API KEYS
# ===============================

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

if not SARVAM_API_KEY:
    raise RuntimeError("SARVAM_API_KEY not found in key.env")

# ===============================
# POLYMARKET CONFIG
# ===============================

GAMMA_BASE = "https://gamma-api.polymarket.com"
CLOB_BASE = "https://clob.polymarket.com"

CACHE_FILE = "polymarket_cache.json"

PREDEFINED_EVENT_IDS = {
    "fed_decision_march": 67284,
    "treasury_yield_high": 79104,
    "treasury_yield_low": 79123,
    "microstrategy_btc_sale": 16167,
    "ai_frontiermath_90": 79080,
    "inflation_2026": 80773,
    "us_recession_2026": 48802,
    "nvidia_february_2026": 186955,
    "fed_rate_cuts_2026": 51456,
}
