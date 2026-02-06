import statistics
from typing import Dict, Any
import json

def compute_company_signal(company: str, market_data: list):
    """
    Derives company signal ONLY from Polymarket-derived probabilities.
    No hardcoded numbers. No hallucinated confidence.
    """

    company = company.upper()

    # Currently only NVIDIA has structured price-target markets
    if company not in ["NVDA", "NVIDIA"]:
        return {
            "confidence": None,
            "avg_probability": None,
            "dispersion": None,
            "num_targets": 0
        }

    probs = []

    for m in market_data:
        # m is COMPRESSED
        question = m["question"].lower()
        outcomes = m["outcomes"]

        if "nvidia" in question and "reach $" in question:
            try:
                price = int(question.split("$")[1].split()[0])
            except Exception:
                continue

            # Focus on meaningful upside levels
            if price >= 200:
                probs.append(outcomes.get("Yes", 0))

    if len(probs) < 2:
        return {
            "confidence": None,
            "avg_probability": None,
            "dispersion": None,
            "num_targets": len(probs)
        }

    avg = statistics.mean(probs)
    std = statistics.pstdev(probs)

    return {
        "confidence": round(avg * (1 - std), 3),
        "avg_probability": round(avg, 3),
        "dispersion": round(std, 3),
        "num_targets": len(probs)
    }


def compute_fed_rate_cut_signal(event: dict):
    """
    Computes expected Fed rate cuts from multi-outcome Polymarket event
    """

    if not event or "markets" not in event:
        return {
            "expected_cuts": None,
            "cut_bias": "Unknown"
        }

    cuts = []

    for market in event.get("markets", []):
        labels = market.get("outcomes")
        prices = market.get("outcomePrices")

        if not labels or not prices:
            continue

        # Parse if stringified
        if isinstance(labels, str):
            try:
                labels = json.loads(labels)
            except:
                continue

        if isinstance(prices, str):
            try:
                prices = json.loads(prices)
            except:
                continue

        if len(labels) != len(prices):
            continue

        for label, prob in zip(labels, prices):
            label = label.lower()

            # Extract number of cuts
            if "no" in label:
                cuts.append((0, float(prob)))
            else:
                import re
                match = re.search(r"(\d+)", label)
                if match:
                    cuts.append((int(match.group(1)), float(prob)))

    if not cuts:
        return {
            "expected_cuts": None,
            "cut_bias": "Unknown"
        }

    expected = sum(n * p for n, p in cuts)

    return {
        "expected_cuts": round(expected, 2),
        "cut_bias": (
            "Aggressive" if expected >= 3
            else "Moderate" if expected >= 1
            else "Restrictive"
        )
    }