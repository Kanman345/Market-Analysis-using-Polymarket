import json, time, requests
from config import GAMMA_BASE, CLOB_BASE, CACHE_FILE, PREDEFINED_EVENT_IDS
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import os
from config import PREDEFINED_EVENT_IDS

GROUP_EVENTS = {
    "fed_rate_cuts_2026",
}

def make_session():
    session = requests.Session()

    retries = Retry(
        total=5,
        backoff_factor=1.5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"]
    )

    adapter = HTTPAdapter(max_retries=retries)
    session.mount("https://", adapter)

    return session

SESSION = make_session()

def get_event_by_id(event_id):
    try:
        resp = SESSION.get(
            f"{GAMMA_BASE}/events/{event_id}",
            timeout=15
        )
        resp.raise_for_status()
        return resp.json()

    except requests.exceptions.RequestException as e:
        print(f"⚠️ Failed to fetch event {event_id}: {e}")
        return None
    
def fetch_token_midpoint(token_id):
    try:
        resp = requests.get(
            f"{CLOB_BASE}/midpoint",
            params={"token_id": token_id},
            timeout=10
        )

        if resp.status_code != 200:
            return None

        data = resp.json()

        # Handle all real-world cases
        if "midpoint" in data and data["midpoint"] is not None:
            return float(data["midpoint"])

        if "price" in data and data["price"] is not None:
            return float(data["price"])

        return None

    except (requests.exceptions.RequestException, ValueError, TypeError):
        return None
    
def parse_outcome_prices(outcome_prices):
    """
    outcomePrices can be:
    - list[str]
    - JSON-encoded string of list[str]
    """
    if isinstance(outcome_prices, str):
        try:
            outcome_prices = json.loads(outcome_prices)
        except json.JSONDecodeError:
            return None

    if not isinstance(outcome_prices, list):
        return None

    return [float(p) for p in outcome_prices]

def get_safe_outcome_labels(market, token_ids):
    labels = market.get("outcomes")

    if isinstance(labels, list) and len(labels) == len(token_ids):
        return labels

    # Heuristic: binary markets
    if len(token_ids) == 2:
        return ["No", "Yes"]

    return [f"Outcome_{i}" for i in range(len(token_ids))]

def fetch_all_market_data(use_cache=True):
    if use_cache and os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    results = []

    for key, event_id in PREDEFINED_EVENT_IDS.items():
        if key in GROUP_EVENTS:
            continue

        time.sleep(0.3)
        event = get_event_by_id(event_id)
        if not event:
            continue

        for market in event.get("markets", []):
            if "clobTokenIds" not in market:
                continue

            token_ids = json.loads(market["clobTokenIds"])

            raw_prices = {}

            # Try CLOB first
            for token_id in token_ids:
                price = fetch_token_midpoint(token_id)
                if price is not None:
                    raw_prices[token_id] = price

            # If CLOB is illiquid, fall back to Gamma outcomePrices
            if len(raw_prices) < 2:
                outcome_prices = market.get("outcomePrices")
                if not outcome_prices:
                    continue

                # outcomePrices are strings like ["0.32", "0.68"]
                parsed_prices = parse_outcome_prices(market.get("outcomePrices"))
                if not parsed_prices or len(parsed_prices) != len(token_ids):
                    continue

                raw_prices = {
                    token_id: price
                    for token_id, price in zip(token_ids, parsed_prices)
                }

            total = sum(raw_prices.values())
            if total == 0:
                continue

            labels = get_safe_outcome_labels(market, token_ids)

            outcomes = {
                label: round(raw_prices[token_id] / total, 4)
                for label, token_id in zip(labels, token_ids)
            }

            results.append({
                "event_key": key,
                "event_id": event_id,
                "event_title": event["title"],
                "market_id": market["id"],
                "market_question": market["question"],
                "outcomes": outcomes,
                "volume": market.get("volume", 0),
                "end_date": market.get("endDate")
            })
    with open(CACHE_FILE, "w") as f:
        json.dump(results, f, indent=2)

    return results

def attach_event_keys(events: list) -> list:
    id_to_key = {str(v): k for k, v in PREDEFINED_EVENT_IDS.items()}

    for event in events:
        event_id = str(event.get("id"))
        if event_id in id_to_key:
            event["event_key"] = id_to_key[event_id]

    return events

def fetch_group_event(event_key):
    event_id = PREDEFINED_EVENT_IDS.get(event_key)
    if not event_id:
        return None
    return get_event_by_id(event_id)


