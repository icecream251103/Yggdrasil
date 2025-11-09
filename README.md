# Yggdrasil AR 🌳

**WebAR + AI + Blockchain** platform chống greenwashing. Biến mỗi sản phẩm thành câu chuyện minh bạch về tác động môi trường.

## 🎯 3 Trụ Cột

1. **AI Green Engine**: GreenScore (0-100) + Carbon Footprint với rule-based v1.0
2. **AR Green Journey**: WebAR hiển thị lifecycle hotspots qua model-viewer
3. **Blockchain Trust-Seal**: NFT GreenCert (ERC-721) + GreenLeaf Token (ERC-20) trên testnet

## 🏗️ Cấu Trúc Monorepo

```
yggdrasil_ar/
├── apps/
│   └── web/              # Next.js 14 frontend
├── services/
│   └── api/              # FastAPI backend
├── contracts/            # Hardhat + Solidity
├── data/                 # Sample products, seed data
├── schemas/              # JSON schemas
└── .github/              # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- Python >= 3.10
- npm >= 9

### Setup

```powershell
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your RPC_URL and PRIVATE_KEY

# 3. Start frontend (dev)
npm run dev:web

# 4. Start backend (in another terminal)
cd services/api
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 5. Compile & deploy contracts (testnet)
npm run contracts:compile
npm run contracts:deploy
```

### Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📱 MVP Flow

1. **Scan QR** (`/scan`) → Camera → Detect QR code
2. **Fetch Product** → API `/api/products/by-qr/:code`
3. **AR Display** → model-viewer with lifecycle hotspots
4. **Green Metrics** → GreenScore + Carbon + Claims
5. **Blockchain** → (testnet) Mint NFT cert + reward tokens

## 🧪 Test với Sample Data

```powershell
# Trong browser:
# - Mở /scan
# - Quét QR code "PROD-001" (dùng QR generator online)
# - Hoặc test trực tiếp: http://localhost:3000/api/products/by-qr/PROD-001
```

## 🔒 Security Notes

- **NEVER** commit `.env` hay private keys
- Backend signer holds `MINTER_ROLE` (contracts)
- All blockchain operations server-side only
- Testnet only for MVP (Base Sepolia)

## 📝 Commit Convention

- `feat:` new feature
- `fix:` bug fix
- `refactor:` code restructure
- `docs:` documentation
- `chore:` tooling/config

## 📚 Documentation

- [Frontend README](apps/web/README.md)
- [Backend README](services/api/README.md)
- [Contracts README](contracts/README.md)
- [Data Schemas](schemas/README.md)

## 🤝 Contributing

1. Tạo branch từ `main`: `git checkout -b feat/your-feature`
2. Commit với convention
3. Push và tạo Pull Request
4. Gắn screenshot/video demo nếu có UI changes

## 📄 License

MIT

---

**MVP Target**: 2-4 tuần | Testnet only | Sample data driven
