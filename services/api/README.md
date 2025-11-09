# Yggdrasil API

FastAPI backend cho Yggdrasil AR platform.

## Features

- **Product API**: `/products/by-qr/{code}` - Get product by QR code
- **Scoring**: `/score/recompute/{product_id}` - Rule-based GreenScore v1.0
- **Events**: `/scan-events` - Log scan events
- **Blockchain (stub)**: `/blockchain/mint-cert`, `/blockchain/reward`

## Tech Stack

- **Framework**: FastAPI + Uvicorn
- **Validation**: Pydantic v2
- **Database**: (MVP) In-memory; (production) SQLite/Postgres
- **Blockchain**: web3.py + eth-account (testnet signer)

## Setup

```powershell
# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port 8000

# Or
python main.py
```

## Environment Variables

Tạo `.env`:

```env
RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key_here_DO_NOT_COMMIT
DATABASE_URL=sqlite:///./yggdrasil.db
```

## API Documentation

Sau khi start server:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints

### GET /products/by-qr/{code}

Lấy product theo QR code.

**Response:**
```json
{
  "id": "prod-001",
  "qr_code": "PROD-001",
  "name": "Áo Thun Cotton Organic Unisex",
  "green_score": 87,
  "carbon_kg": 3.2,
  "scoring_version": "v1.0",
  "lifecycle_stages": [...],
  "claims": [...]
}
```

### POST /score/recompute/{product_id}

Tính lại GreenScore theo rule-based v1.0.

**Response:**
```json
{
  "product_id": "prod-001",
  "green_score": 87.0,
  "carbon_kg": 3.2,
  "scoring_version": "v1.0",
  "recomputed_at": "2024-11-06T..."
}
```

### POST /scan-events

Log scan event (MVP: in-memory).

**Body:**
```json
{
  "product_id": "prod-001",
  "qr_code": "PROD-001",
  "user_wallet": "0x...",
  "timestamp": "2024-11-06T..."
}
```

### POST /blockchain/mint-cert

Mint GreenCert NFT (MVP: stub, trả mock response).

**Body:**
```json
{
  "product_id": "prod-001",
  "recipient_address": "0x...",
  "metadata_uri": "ipfs://..."
}
```

### POST /blockchain/reward

Thưởng GreenLeaf tokens (MVP: stub).

**Body:**
```json
{
  "recipient_address": "0x...",
  "amount": 10.0,
  "reason": "scanned_verified_product"
}
```

## Scoring Logic (v1.0)

### Weights
- Materials: 35%
- Production: 30%
- Transport: 20%
- End of Life: 15%

### Formula
```
GreenScore = Σ (stage_score × weight)
Carbon = Σ (stage_carbon_kg)
```

### Config
Load từ `schemas/scoring_config.json`:
- Material scores (organic=90, plastic=20, etc.)
- Production scores (renewable_energy_100=95, fossil=30)
- Transport scores (local=90, air=-20)
- EOL scores (recyclable=95, landfill=20)

## Development

### Add new endpoint

```python
@app.post("/my-endpoint")
def my_function(data: MyModel):
    # logic here
    return {"status": "ok"}
```

### Add database (production)

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Use dependency injection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Blockchain integration (production)

```python
from web3 import Web3
from eth_account import Account
import os

w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_URL")))
signer = Account.from_key(os.getenv("PRIVATE_KEY"))

# Load contract ABI from deployments.json
# contract = w3.eth.contract(address=..., abi=...)
# tx = contract.functions.mint(...)
# signed = signer.sign_transaction(tx)
# tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
```

## Testing

```powershell
# Manual test với curl
curl http://localhost:8000/products/by-qr/PROD-001

# Test recompute score
curl -X POST http://localhost:8000/score/recompute/prod-001

# Test scan event
curl -X POST http://localhost:8000/scan-events \
  -H "Content-Type: application/json" \
  -d '{\"product_id\":\"prod-001\",\"qr_code\":\"PROD-001\"}'
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Railway / Render

- Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add env vars: `RPC_URL`, `PRIVATE_KEY`, `DATABASE_URL`

## Security Notes

- **NEVER** commit `.env` hoặc private keys
- Backend signer holds `MINTER_ROLE` cho contracts
- Rate limiting: thêm middleware (production)
- Input validation: Pydantic models handle auto
