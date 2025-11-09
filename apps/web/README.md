# Yggdrasil Web Frontend

Next.js 14 App Router frontend cho Yggdrasil AR platform.

## Features

- **Landing Page** (`/`): 3 trụ cột + MVP flow
- **Scan Page** (`/scan`): QR scanner với jsQR + camera API
- **Product Viewer**: WebAR với model-viewer + hotspots lifecycle
- **API Routes**: `/api/products/by-qr/[code]` serve sample data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (dark theme default)
- **WebAR**: @google/model-viewer v3.4
- **QR**: jsQR
- **Icons**: lucide-react

## Setup

```powershell
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start

# Type check
npm run type-check
```

## Environment Variables

Tạo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_NETWORK_NAME=Base Sepolia
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with model-viewer script
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles + Tailwind
│   ├── scan/
│   │   └── page.tsx        # QR scanner page
│   └── api/
│       └── products/
│           └── by-qr/
│               └── [code]/
│                   └── route.ts  # API endpoint
└── components/
    └── ProductViewer.tsx   # AR viewer + metrics display
```

## Usage

### 1. QR Scanning

- Mở `/scan`
- Click "Mở Camera"
- Quét QR code (hoặc test nhanh với buttons PROD-001/002/003)
- Tự động fetch product và render AR viewer

### 2. AR Interaction

- Xoay/zoom model bằng mouse/touch
- Click hotspots 🌱 để xem lifecycle details
- View GreenScore, Carbon, Claims

## API Response Format

```typescript
{
  id: string;
  qr_code: string;
  name: string;
  brand: string;
  green_score: number;        // 0-100
  carbon_kg: number;
  scoring_version: string;    // "v1.0"
  model_url: string;          // .glb or .gltf
  lifecycle_stages: Array<{
    stage: string;
    title: string;
    description: string;
    hotspot_position?: string; // "0m 0.5m 0m"
    metrics?: {
      score?: number;
      carbon_kg?: number;
      details?: string;
    };
  }>;
  claims: Array<{
    type: string;
    value: string;
    verified: boolean;
    verifier?: string;
    evidence_url?: string;
  }>;
}
```

## Customization

### Hotspot Styling

Edit `src/app/globals.css`:

```css
model-viewer .hotspot {
  background: rgba(34, 197, 94, 0.9);
  /* customize colors, sizes, animations */
}
```

### Score Colors

Edit `src/components/ProductViewer.tsx`:

```typescript
const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-400';
  // adjust thresholds
};
```

## Notes

- **Errors trước npm install**: Bình thường, ignore
- **model-viewer**: CDN load từ layout.tsx
- **Sample data**: API route load từ `../../data/sample-product-*.json`
- **Camera permission**: Cần HTTPS hoặc localhost

## Deployment

### Vercel (recommended)

```powershell
npm i -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Troubleshooting

### QR không detect

- Đảm bảo QR rõ nét, đủ sáng
- Test với QR generator: https://www.qr-code-generator.com/
- Check console logs

### Model không load

- Verify `model_url` accessible (CORS)
- Check browser console errors
- Fallback: dùng placeholder từ modelviewer.dev

### API 404

- Verify data/ directory trong monorepo root
- Check path.join() trong route.ts
- Fallback: hardcode sample data trong route
