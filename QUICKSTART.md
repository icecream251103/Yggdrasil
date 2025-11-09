# Quick Start Guide

Hướng dẫn setup toàn bộ Yggdrasil platform từ đầu (2-4 tuần MVP).

## Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.10
- **npm** >= 9.x
- **Git**
- **Code editor**: VS Code (recommended)

## Setup Steps

### 1. Clone & Install

```powershell
# Clone repo (hoặc đã có sẵn workspace)
cd c:\Users\GIGABYTE\Desktop\yggdrasil_ar

# Install root dependencies
npm install

# Install frontend dependencies
cd apps\web
npm install
cd ..\..

# Install backend dependencies
cd services\api
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..\..

# Install contracts dependencies
cd contracts
npm install
cd ..
```

### 2. Environment Setup

Tạo `.env` trong root:

```env
# Frontend (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_NETWORK_NAME=Base Sepolia

# Backend (FastAPI)
RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key_here_DO_NOT_COMMIT
DATABASE_URL=sqlite:///./yggdrasil.db

# Contracts deployment
DEPLOYER_PRIVATE_KEY=your_deployer_key_here_DO_NOT_COMMIT
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_api_key_optional

# Optional
IPFS_GATEWAY=https://ipfs.io/ipfs/
STORAGE_PROVIDER=local
```

**⚠️ IMPORTANT**: 
- Thay `your_private_key_here` bằng private key testnet thật (Base Sepolia)
- NEVER commit file `.env` lên Git
- Lấy testnet ETH từ faucet: https://www.alchemy.com/faucets/base-sepolia

### 3. Start Development Servers

**Terminal 1 - Frontend:**
```powershell
cd apps\web
npm run dev
```
→ http://localhost:3000

**Terminal 2 - Backend:**
```powershell
cd services\api
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```
→ http://localhost:8000/docs

### 4. Deploy Contracts (Testnet)

**Terminal 3:**
```powershell
cd contracts
npm run compile
npm run deploy
```

Kiểm tra `contracts/deployments.json` để lấy địa chỉ contracts.

### 5. Test MVP Flow

1. **Landing Page**: Mở http://localhost:3000 → Thấy 3 trụ cột
2. **Scan QR**: Click "Quét QR Ngay" → Test với buttons PROD-001/002/003
3. **AR Viewer**: Xem 3D model, click hotspots 🌱
4. **Green Metrics**: Xác minh GreenScore, Carbon, Claims

### 6. Optional - Generate QR Codes

Tạo QR codes thật cho test:

- Mở https://www.qr-code-generator.com/
- Text: `PROD-001` (hoặc `PROD-002`, `PROD-003`)
- Download và in/hiển thị trên màn hình
- Quét bằng /scan page

## Troubleshooting

### Frontend không chạy

```powershell
cd apps\web
rm -rf node_modules .next
npm install
npm run dev
```

### Backend lỗi import

```powershell
cd services\api
.\venv\Scripts\Activate.ps1
pip install --upgrade -r requirements.txt
```

### Contracts compile fail

```powershell
cd contracts
rm -rf cache artifacts
npm install
npm run compile
```

### QR scanner không mở camera

- Đảm bảo chạy trên **localhost** (HTTPS không cần cho localhost)
- Cấp quyền camera trong browser
- Fallback: dùng test buttons PROD-001/002/003

### API 404 cho /products/by-qr/PROD-001

Kiểm tra:
1. Backend đang chạy trên port 8000
2. File `data/sample-product-001.json` tồn tại
3. Path trong `apps/web/src/app/api/products/by-qr/[code]/route.ts` đúng

Fallback: Hardcode sample data trong route.ts nếu path issue.

## Development Workflow

### Making Changes

1. **Frontend**: Edit files trong `apps/web/src/`, auto-reload
2. **Backend**: Edit `services/api/main.py`, auto-reload với `--reload`
3. **Contracts**: Edit `.sol` files, compile lại, deploy lại testnet

### Commit Convention

```
feat: Add new feature
fix: Bug fix
refactor: Code restructure
docs: Documentation
chore: Tooling/config
test: Tests
```

### Testing

```powershell
# Frontend type check
cd apps\web
npm run type-check

# Backend manual test
curl http://localhost:8000/products/by-qr/PROD-001

# Contracts compile check
cd contracts
npm run compile
```

## MVP Checklist

- [ ] Landing page hiển thị 3 trụ cột
- [ ] /scan page mở camera, detect QR (hoặc test buttons)
- [ ] Fetch product từ API, render model-viewer
- [ ] Hotspots lifecycle click được, hiển thị metrics
- [ ] GreenScore + Carbon + Claims display đúng
- [ ] Backend /score/recompute trả đúng v1.0
- [ ] Contracts deploy testnet thành công
- [ ] deployments.json sinh ra đúng addresses

## Next Steps

1. **Integrate blockchain**: Wire backend endpoints với deployed contracts
2. **IPFS metadata**: Upload product metadata lên IPFS cho NFT
3. **Wallet auth**: Thêm WalletConnect/wagmi cho user login
4. **Database**: Migrate từ in-memory sang SQLite/Postgres
5. **Deploy**: Host frontend (Vercel), backend (Railway), keep testnet

## Resources

- **Docs**: Xem README.md trong từng folder (apps/web, services/api, contracts)
- **Sample data**: `data/sample-product-*.json`
- **Schemas**: `schemas/product.schema.json`, `scoring_config.json`
- **Copilot instructions**: `.github/copilot-instructions.md`

## Support

Gặp vấn đề? Check:
1. README.md trong folder tương ứng
2. Console logs (browser DevTools, terminal)
3. API docs: http://localhost:8000/docs
4. GitHub Issues

---

**Happy hacking! 🌳**
