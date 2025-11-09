# Deployment Guide

Hướng dẫn deploy Yggdrasil lên production/staging.

## Overview

- **Frontend**: Vercel (recommended) hoặc Netlify
- **Backend**: Railway, Render, hoặc DigitalOcean
- **Contracts**: Base Sepolia testnet (MVP), mainnet sau
- **Database**: (production) Supabase, PlanetScale, hoặc Railway Postgres

## Frontend Deployment (Vercel)

### 1. Setup Vercel Project

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd apps\web
vercel
```

### 2. Environment Variables

Trong Vercel dashboard, thêm:

```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_NETWORK_NAME=Base Sepolia
```

### 3. Build Settings

- **Framework**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 4. Custom Domain (optional)

- Vercel Settings → Domains
- Add: `yggdrasil.yourdomain.com`
- DNS: CNAME → `cname.vercel-dns.com`

## Backend Deployment (Railway)

### 1. Create Railway Project

- Đi tới https://railway.app
- New Project → Deploy from GitHub
- Select repo `yggdrasil_ar`
- Root directory: `services/api`

### 2. Environment Variables

Trong Railway dashboard:

```
RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_testnet_private_key
DATABASE_URL=${{Postgres.DATABASE_URL}}  # nếu dùng Railway Postgres
PORT=8000
```

### 3. Start Command

Railway Settings:

```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 4. Add Postgres (optional)

- Railway dashboard → New → Database → PostgreSQL
- Auto-injects `DATABASE_URL`
- Migrate schema (thêm sau khi implement SQLAlchemy models)

## Contracts Deployment (Testnet)

### 1. Get Testnet ETH

**Base Sepolia:**
- https://www.alchemy.com/faucets/base-sepolia
- https://portal.cdp.coinbase.com/products/faucet

**Sepolia ETH:**
- https://www.alchemy.com/faucets/ethereum-sepolia

### 2. Deploy Contracts

```powershell
cd contracts

# Ensure .env has DEPLOYER_PRIVATE_KEY
npm run deploy
```

### 3. Verify on Block Explorer

```powershell
# Base Sepolia
npx hardhat verify --network baseSepolia <NFT_ADDRESS>
npx hardhat verify --network baseSepolia <TOKEN_ADDRESS>
```

### 4. Update Frontend & Backend

Copy từ `contracts/deployments.json`:

**Frontend** (`apps/web/src/lib/contracts.ts`):
```typescript
export const CONTRACTS = {
  baseSepolia: {
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    GreenCertNFT: '0xYourNFTAddress',
    GreenLeafToken: '0xYourTokenAddress',
  },
};
```

**Backend** (đọc tự động từ `deployments.json`).

## Domain & SSL

### Vercel
- Tự động SSL với Let's Encrypt
- Custom domain free

### Railway
- `*.railway.app` có sẵn SSL
- Custom domain: Settings → Networking → Custom Domain

## Database Migration (Production)

Khi ready để persist data:

### Option 1: Railway Postgres

```python
# services/api/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
```

### Option 2: Supabase

- https://supabase.com → New project
- Copy DATABASE_URL
- Use với SQLAlchemy hoặc Supabase client

### Schema

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  qr_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  green_score FLOAT,
  carbon_kg FLOAT,
  data JSONB  -- full product JSON
);

CREATE TABLE scan_events (
  id SERIAL PRIMARY KEY,
  product_id TEXT,
  qr_code TEXT,
  user_wallet TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

## Monitoring & Logs

### Vercel
- Dashboard → Logs
- Real-time function logs
- Analytics built-in

### Railway
- Dashboard → Deployments → View Logs
- Metrics tab for CPU/RAM

### Error Tracking (optional)
- Sentry: https://sentry.io
- Add DSN to env vars
- Install SDK:
  ```
  npm i @sentry/nextjs  # frontend
  pip install sentry-sdk  # backend
  ```

## CI/CD

GitHub Actions đã setup (`.github/workflows/ci.yml`):
- Auto-run trên push/PR
- Type check, lint, build
- Deploy tự động (nếu connect Railway/Vercel với GitHub)

## Security Checklist

- [ ] `.env` trong `.gitignore`
- [ ] Private keys NEVER committed
- [ ] CORS configured cho production domain
- [ ] Rate limiting (thêm middleware)
- [ ] Input validation (Pydantic auto-handles)
- [ ] HTTPS enabled (auto với Vercel/Railway)
- [ ] Environment vars set correctly
- [ ] Database credentials secure

## Rollback

### Vercel
- Dashboard → Deployments → Previous → Promote

### Railway
- Dashboard → Deployments → Redeploy older version

### Contracts
- **No rollback** - contracts immutable
- Deploy new version, update addresses

## Cost Estimates (MVP)

- **Vercel**: Free tier (100GB bandwidth/month)
- **Railway**: $5-10/month (Hobby plan)
- **Base Sepolia**: Free (testnet ETH from faucets)
- **Database**: Railway Postgres free tier hoặc Supabase free
- **Domain**: $10-15/year (optional)

**Total**: ~$5-15/month cho MVP testnet.

## Scaling Considerations

Khi grow:
- **Frontend CDN**: Vercel auto-scales
- **Backend**: Railway Pro ($20+) hoặc self-host VPS
- **Database**: Upgrade to paid tier, connection pooling
- **Blockchain**: Consider L2 aggregators (Alchemy, Infura)
- **IPFS**: Pinata, Web3.Storage cho metadata

## Mainnet Migration (Future)

Khi ready:
1. Audit contracts (CertiK, OpenZeppelin)
2. Deploy to mainnet (Base, Ethereum, Polygon)
3. Multi-sig wallet for admin (Gnosis Safe)
4. Higher gas budgets
5. Real token economics model
6. Legal compliance (depending on jurisdiction)

---

**Questions?** Check README.md files hoặc tạo GitHub issue.
