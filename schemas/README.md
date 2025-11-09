# Schemas

JSON schemas cho validation dữ liệu trong Yggdrasil platform.

## Files

### `product.schema.json`
Schema cho product data đầy đủ:
- Basic info: id, qr_code, name, brand, category
- Green metrics: green_score (0-100), carbon_kg
- Lifecycle stages với AR hotspot positions
- Claims (verified/pending)
- Blockchain data (optional)

### `scoring_config.json`
Cấu hình rule-based scoring v1.0:
- **Weights**: materials 35%, production 30%, transport 20%, end_of_life 15%
- **Scoring rules**: điểm cho từng material type, energy source, transport mode, EOL option
- **Carbon heuristics**: kg CO2e per kg material, per km transport, base production

## Usage

### Validate product data (TypeScript)
```typescript
import Ajv from 'ajv';
import productSchema from './schemas/product.schema.json';

const ajv = new Ajv();
const validate = ajv.compile(productSchema);
const valid = validate(productData);
```

### Validate product data (Python)
```python
import json
from jsonschema import validate

with open('schemas/product.schema.json') as f:
    schema = json.load(f)
    
validate(instance=product_data, schema=schema)
```

## Hotspot Position Format

Format: `"<x>m <y>m <z>m"` (meters, space-separated)
- Example: `"0m 0.5m 0m"` (center, 0.5m above origin, no depth)
- Sử dụng cho `data-position` attribute trong `<model-viewer>` hotspots

## Scoring Version

Hiện tại: **v1.0** (rule-based)
- Roadmap: v2.0 (ML-enhanced), v3.0 (LCA database integration)
