'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Package, TrendingUp, ShoppingCart, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

// Sample products from data/
const PRODUCTS = [
  {
    id: 'PROD-001',
    name: 'Áo Thun Cotton Organic Unisex',
    brand: 'GreenWear',
    score: 87,
    carbon: 3.2,
    price: 350000,
    image: '/images/products/tshirt.jpg', // placeholder
  },
  {
    id: 'PROD-002',
    name: 'Bình Nước Thép Tái Chế',
    brand: 'GreenLife Co.',
    score: 76,
    carbon: 8.5,
    price: 280000,
    image: '/images/products/bottle.jpg',
  },
  {
    id: 'PROD-003',
    name: 'Hộp Đựng Thực Phẩm Nhựa PP',
    brand: 'BambooStyle',
    score: 28,
    carbon: 15.3,
    price: 150000,
    image: '/images/products/bag.jpg',
  },
];

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const qParam = searchParams?.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState(qParam);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const router = useRouter();

  // Keep input in sync when URL ?q changes (e.g., from Topbar search)
  useEffect(() => {
    setSearchQuery(qParam);
  }, [qParam]);

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'high') return matchesSearch && p.score >= 70;
    if (filter === 'medium') return matchesSearch && p.score >= 50 && p.score < 70;
    if (filter === 'low') return matchesSearch && p.score < 50;
    return matchesSearch;
  });

  const addToCart = (productId: string) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === productId);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (product) cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ hàng!');
  };

  const viewAR = (productId: string) => {
    router.push(`/scan?code=${encodeURIComponent(productId)}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="scroll-reveal visible">
        <h1 className="text-3xl font-extrabold gradient-text mb-2">Danh Mục Sản Phẩm</h1>
        <p className="text-slate-600">Khám phá các sản phẩm xanh được xác thực</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-teal-500 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-teal-300'
              }`}
            >
              {f === 'all' ? 'Tất Cả' : f === 'high' ? 'Cao' : f === 'medium' ? 'Trung Bình' : 'Thấp'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition duration-300"
          >
            {/* Image Placeholder */}
            <div className="h-48 bg-slate-100 flex items-center justify-center">
              <Package className="w-16 h-16 text-slate-500" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-600 transition">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500">{product.brand}</p>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-600">Score: {product.score}</span>
                </div>
                <div className="text-sm text-slate-500">CO₂: {product.carbon} kg</div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-xl font-bold text-slate-900">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => viewAR(product.id)}
                    className="px-3 py-2 border border-teal-300 text-teal-700 hover:bg-teal-50 rounded-lg text-sm transition"
                    title="Xem AR (test)"
                  >
                    Xem AR
                  </button>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition ripple"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">Thêm</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">Không tìm thấy sản phẩm nào</p>
        </div>
      )}
    </div>
  );
}
