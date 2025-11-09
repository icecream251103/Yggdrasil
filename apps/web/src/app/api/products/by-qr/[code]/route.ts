import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * GET /api/products/by-qr/[code]
 * Single source of truth (App Router). Legacy `pages/api` duplicate removed to avoid route collision.
 * Loads simple sample product JSON files for MVP demo until real backend is wired.
 * Data directory resolution: monorepo/apps/web -> go up two levels to reach root then /data.
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    // Load sample products from data directory
    const dataDir = path.join(process.cwd(), '..', '..', 'data');
    const productFiles = [
      'sample-product-001.json',
      'sample-product-002.json',
      'sample-product-003.json',
    ];

    const products = productFiles
      .map((file) => {
        const filePath = path.join(dataDir, file);
        if (fs.existsSync(filePath)) {
          return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        return null;
      })
      .filter(Boolean);

    const product = products.find((p) => p.qr_code === code);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', code },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error loading product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
