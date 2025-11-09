from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import json
from pathlib import Path
from datetime import datetime

app = FastAPI(
    title="Yggdrasil Green API",
    description="Backend for WebAR + AI + Blockchain anti-greenwashing platform",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data"
SCHEMAS_DIR = Path(__file__).parent.parent.parent / "schemas"

# Pydantic models
class LifecycleMetrics(BaseModel):
    score: Optional[float] = None
    carbon_kg: Optional[float] = None
    details: Optional[str] = None

class LifecycleStage(BaseModel):
    stage: Literal["materials", "production", "transport", "use", "end_of_life"]
    title: str
    description: str
    hotspot_position: Optional[str] = None
    metrics: Optional[LifecycleMetrics] = None

class Claim(BaseModel):
    type: Literal["certification", "carbon_neutral", "recycled_content", "renewable_energy", "water_saved", "other"]
    value: str
    verified: bool
    verifier: Optional[str] = None
    evidence_url: Optional[str] = None
    issued_date: Optional[str] = None

class BlockchainData(BaseModel):
    cert_nft_id: Optional[str] = None
    cert_tx_hash: Optional[str] = None
    network: Optional[str] = "base-sepolia"

class ProductMetadata(BaseModel):
    created_at: str
    updated_at: str
    created_by: str

class Product(BaseModel):
    id: str
    qr_code: str
    name: str
    brand: str
    category: Literal["fashion", "packaging", "electronics", "food", "other"]
    description: str
    model_url: str
    image_url: Optional[str] = None
    green_score: float = Field(ge=0, le=100)
    carbon_kg: float = Field(ge=0)
    scoring_version: str = "v1.0"
    lifecycle_stages: List[LifecycleStage]
    claims: List[Claim] = []
    blockchain: Optional[BlockchainData] = None
    metadata: Optional[ProductMetadata] = None

class ScoreRecomputeResponse(BaseModel):
    product_id: str
    green_score: float
    carbon_kg: float
    scoring_version: str
    recomputed_at: str

class ScanEvent(BaseModel):
    product_id: str
    qr_code: str
    user_wallet: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class MintCertRequest(BaseModel):
    product_id: str
    recipient_address: str
    metadata_uri: Optional[str] = None

class RewardRequest(BaseModel):
    recipient_address: str
    amount: float
    reason: str

# Helper functions
def load_sample_products() -> List[Product]:
    """Load sample products from data directory"""
    products = []
    for i in range(1, 4):
        file_path = DATA_DIR / f"sample-product-{i:03d}.json"
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                products.append(Product(**data))
    return products

def load_scoring_config():
    """Load scoring configuration"""
    config_path = SCHEMAS_DIR / "scoring_config.json"
    if config_path.exists():
        with open(config_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None

def recompute_green_score(product: Product) -> dict:
    """
    Rule-based scoring v1.0
    Weights: materials 35%, production 30%, transport 20%, end_of_life 15%
    """
    config = load_scoring_config()
    if not config:
        raise ValueError("Scoring config not found")

    weights = config["weights"]
    stage_scores = {}

    for stage in product.lifecycle_stages:
        if stage.metrics and stage.metrics.score is not None:
            stage_scores[stage.stage] = stage.metrics.score

    # Calculate weighted average
    total_score = 0.0
    for stage_name, weight in weights.items():
        score = stage_scores.get(stage_name, 50)  # default 50 if missing
        total_score += score * weight

    # Carbon: sum from all stages
    total_carbon = sum(
        stage.metrics.carbon_kg for stage in product.lifecycle_stages 
        if stage.metrics and stage.metrics.carbon_kg is not None
    )

    return {
        "green_score": round(total_score, 1),
        "carbon_kg": round(total_carbon, 2),
        "scoring_version": config["version"],
    }

# Routes
@app.get("/")
def read_root():
    return {
        "name": "Yggdrasil Green API",
        "version": "0.1.0",
        "status": "running",
        "endpoints": [
            "/products/by-qr/{code}",
            "/score/recompute/{product_id}",
            "/scan-events",
            "/blockchain/mint-cert",
            "/blockchain/reward",
        ],
    }

@app.get("/products/by-qr/{code}", response_model=Product)
def get_product_by_qr(code: str):
    """Get product by QR code"""
    products = load_sample_products()
    product = next((p for p in products if p.qr_code == code), None)
    
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with QR code '{code}' not found")
    
    return product

@app.post("/score/recompute/{product_id}", response_model=ScoreRecomputeResponse)
def recompute_score(product_id: str):
    """Recompute green score for a product (rule-based v1.0)"""
    products = load_sample_products()
    product = next((p for p in products if p.id == product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    
    result = recompute_green_score(product)
    
    return ScoreRecomputeResponse(
        product_id=product_id,
        green_score=result["green_score"],
        carbon_kg=result["carbon_kg"],
        scoring_version=result["scoring_version"],
        recomputed_at=datetime.utcnow().isoformat(),
    )

@app.post("/scan-events", status_code=201)
def log_scan_event(event: ScanEvent):
    """Log a scan event (MVP: just return, no persistence yet)"""
    # TODO: Persist to database in production
    return {
        "status": "logged",
        "event": event.dict(),
        "message": "Scan event recorded (MVP: in-memory only)",
    }

@app.post("/blockchain/mint-cert", status_code=202)
def mint_certificate(request: MintCertRequest):
    """
    Mint GreenCert NFT (ERC-721) for verified product
    MVP: Stub endpoint, returns mock response
    Production: Sign & send tx with backend signer
    """
    # TODO: Implement actual blockchain interaction
    return {
        "status": "pending",
        "product_id": request.product_id,
        "recipient": request.recipient_address,
        "message": "Certificate minting queued (testnet). Check back later for tx_hash.",
        "estimated_time": "2-5 minutes",
    }

@app.post("/blockchain/reward", status_code=202)
def reward_tokens(request: RewardRequest):
    """
    Reward GreenLeaf tokens (ERC-20) to user
    MVP: Stub endpoint
    Production: Backend signer transfers tokens
    """
    # TODO: Implement actual token transfer
    return {
        "status": "pending",
        "recipient": request.recipient_address,
        "amount": request.amount,
        "reason": request.reason,
        "message": f"Reward of {request.amount} GreenLeaf tokens queued.",
        "estimated_time": "1-3 minutes",
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
