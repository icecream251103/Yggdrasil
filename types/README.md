# Yggdrasil Types (Global)

TypeScript type definitions dùng chung trong monorepo (optional, nếu cần share types).

## Product Types

```typescript
export interface LifecycleMetrics {
  score?: number;
  carbon_kg?: number;
  details?: string;
}

export type LifecycleStage =
  | "materials"
  | "production"
  | "transport"
  | "use"
  | "end_of_life";

export interface LifecycleStageData {
  stage: LifecycleStage;
  title: string;
  description: string;
  hotspot_position?: string;
  metrics?: LifecycleMetrics;
}

export type ClaimType =
  | "certification"
  | "carbon_neutral"
  | "recycled_content"
  | "renewable_energy"
  | "water_saved"
  | "other";

export interface Claim {
  type: ClaimType;
  value: string;
  verified: boolean;
  verifier?: string;
  evidence_url?: string;
  issued_date?: string;
}

export interface BlockchainData {
  cert_nft_id?: string | null;
  cert_tx_hash?: string | null;
  network?: string;
}

export interface ProductMetadata {
  created_at: string;
  updated_at: string;
  created_by: string;
}

export type ProductCategory =
  | "fashion"
  | "packaging"
  | "electronics"
  | "food"
  | "other";

export interface Product {
  id: string;
  qr_code: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  model_url: string;
  image_url?: string;
  green_score: number; // 0-100
  carbon_kg: number;
  scoring_version: string;
  lifecycle_stages: LifecycleStageData[];
  claims: Claim[];
  blockchain?: BlockchainData;
  metadata?: ProductMetadata;
}
```

## Usage

Nếu muốn share types giữa frontend và backend:

```typescript
// apps/web/src/types/product.ts
export * from '../../../types/product';
```

Hoặc symlink:

```powershell
cd apps\web\src
New-Item -ItemType SymbolicLink -Path types -Target ..\..\..\types
```

Hiện tại: Mỗi app tự define types local (đơn giản hơn cho MVP).
