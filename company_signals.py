SIGNAL_CATEGORIES = {
    "rates": [
        "fed_decision_march",
        "treasury_yield_high",
        "treasury_yield_low"
    ],
    "recession": [
        "us_recession_2026"
    ],
    "inflation": [
        "inflation_2026"
    ],
    "liquidity": [
        "microstrategy_btc_sale"
    ],
    "ai_progress": [
        "ai_frontiermath_90"
    ],
    "crypto": [
        "microstrategy_btc_sale"
    ],
    "nvidia_specific": [
        "nvidia_february_2026"
    ]
}

COMPANY_SIGNAL_MAP = {
    "NVDA": {
        "primary": ["nvidia_specific", "ai_progress"],
        "macro": ["rates", "liquidity", "recession"]
    },

    "MSFT": {
        "primary": ["ai_progress"],
        "macro": ["rates", "recession"]
    },

    "GOOGL": {
        "primary": ["ai_progress"],
        "macro": ["rates", "recession"]
    },

    "AAPL": {
        "primary": [],
        "macro": ["rates", "inflation", "recession"]
    },

    "AMZN": {
        "primary": ["consumer_spending"],
        "macro": ["rates", "inflation", "recession"]
    },

    "XOM": {
        "primary": ["inflation"],
        "macro": ["rates", "recession"]
    },

    "JNJ": {
        "primary": [],
        "macro": ["recession", "rates"]
    }
}

def get_relevant_event_keys(company: str):
    company = company.upper()

    if company not in COMPANY_SIGNAL_MAP:
        return []

    signal_groups = (
        COMPANY_SIGNAL_MAP[company]["primary"] +
        COMPANY_SIGNAL_MAP[company]["macro"]
    )

    event_keys = set()
    for group in signal_groups:
        for key in SIGNAL_CATEGORIES.get(group, []):
            event_keys.add(key)

    return list(event_keys)