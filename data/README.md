# Sample Data

3 sản phẩm mẫu cho MVP demo với phổ điểm GreenScore đa dạng:

## Products

### PROD-001: Áo Thun Cotton Organic (⭐ Verified High Score)
- **GreenScore**: 87/100
- **Carbon**: 3.2 kg CO2e
- **Highlights**: GOTS certified, 85% renewable energy, local transport
- **Claims**: 3 verified (GOTS, renewable energy, water saved)
- **Use case**: Ví dụ "sản phẩm xanh tốt"

### PROD-002: Bình Nước Thép Không Gỉ (⚠️ Pending Claims)
- **GreenScore**: 76/100
- **Carbon**: 8.5 kg CO2e
- **Highlights**: 60% recycled steel, reusable, 100% recyclable EOL
- **Claims**: 2 unverified (pending evidence)
- **Use case**: Ví dụ "cần xác thực thêm"

### PROD-003: Hộp Nhựa PP Dùng 1 Lần (❌ Low Score)
- **GreenScore**: 28/100
- **Carbon**: 15.3 kg CO2e
- **Highlights**: Virgin plastic, coal energy, air freight, landfill
- **Claims**: 1 verified (food safety only, not green)
- **Use case**: Ví dụ "sản phẩm kém bền vững"

## File Structure

```
data/
├── sample-product-001.json  # High green score
├── sample-product-002.json  # Medium, pending
├── sample-product-003.json  # Low score
└── README.md
```

## QR Codes for Testing

Tạo QR codes với các giá trị:
- `PROD-001` → Áo cotton organic
- `PROD-002` → Bình thép
- `PROD-003` → Hộp nhựa

Dùng https://www.qr-code-generator.com/ hoặc tool tương tự.

## Usage in Frontend

```typescript
// Next.js API route: /pages/api/products/by-qr/[code].ts
const products = [
  require('@/data/sample-product-001.json'),
  require('@/data/sample-product-002.json'),
  require('@/data/sample-product-003.json'),
];

const product = products.find(p => p.qr_code === code);
```

## Usage in Backend

```python
# FastAPI: services/api/main.py
import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent.parent / "data"

def load_product(qr_code: str):
    products = [
        json.loads((DATA_DIR / f"sample-product-{i:03d}.json").read_text())
        for i in range(1, 4)
    ]
    return next((p for p in products if p["qr_code"] == qr_code), None)
```

## Validation

Tất cả 3 files đã validate với `schemas/product.schema.json`:

```bash
# Validate with ajv-cli (Node.js)
npx ajv-cli validate -s schemas/product.schema.json -d "data/sample-product-*.json"
```

## Notes

- **3D models**: Placeholder từ modelviewer.dev (public domain)
- **Images**: via placeholder.com (replace với real images sau)
- **Evidence URLs**: example.com (mock, replace với real docs)
- **Blockchain fields**: null (sẽ fill sau khi mint testnet)
