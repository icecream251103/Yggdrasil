"""
Scoring utilities for GreenScore calculation (v1.0)
"""
import json
from pathlib import Path
from typing import Dict, Any

SCHEMAS_DIR = Path(__file__).parent.parent.parent / "schemas"
CONFIG_PATH = SCHEMAS_DIR / "scoring_config.json"

def load_scoring_config() -> Dict[str, Any]:
    """Load scoring configuration from schemas/"""
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    raise FileNotFoundError(f"Scoring config not found at {CONFIG_PATH}")

def calculate_green_score(lifecycle_stages: list) -> float:
    """
    Calculate GreenScore v1.0 from lifecycle stages
    Weights: materials 35%, production 30%, transport 20%, end_of_life 15%
    """
    config = load_scoring_config()
    weights = config["weights"]
    
    stage_scores = {}
    for stage in lifecycle_stages:
        if stage.get("metrics") and stage["metrics"].get("score") is not None:
            stage_scores[stage["stage"]] = stage["metrics"]["score"]
    
    # Calculate weighted average
    total_score = 0.0
    for stage_name, weight in weights.items():
        score = stage_scores.get(stage_name, 50)  # default 50 if missing
        total_score += score * weight
    
    return round(total_score, 1)

def calculate_carbon_footprint(lifecycle_stages: list) -> float:
    """
    Calculate total carbon footprint (kg CO2e) from lifecycle stages
    """
    total_carbon = 0.0
    for stage in lifecycle_stages:
        if stage.get("metrics") and stage["metrics"].get("carbon_kg") is not None:
            total_carbon += stage["metrics"]["carbon_kg"]
    
    return round(total_carbon, 2)

def get_score_rating(score: float) -> str:
    """Get rating label for score"""
    if score >= 90:
        return "Excellent"
    elif score >= 80:
        return "Very Good"
    elif score >= 70:
        return "Good"
    elif score >= 60:
        return "Fair"
    elif score >= 50:
        return "Poor"
    else:
        return "Very Poor"

def get_score_color(score: float) -> str:
    """Get color code for score"""
    if score >= 80:
        return "green"
    elif score >= 60:
        return "yellow"
    else:
        return "red"
