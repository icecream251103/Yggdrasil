'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  score: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const avgScore = cart.length > 0
    ? Math.round(cart.reduce((sum, item) => sum + item.score * item.quantity, 0) / cart.reduce((sum, item) => sum + item.quantity, 0))
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold gradient-text mb-2">Giỏ Hàng</h1>
          <p className="text-slate-600">{cart.length} sản phẩm</p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Xóa Tất Cả
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <ShoppingCart className="w-20 h-20 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Giỏ Hàng Trống</h2>
          <p className="text-slate-600 mb-6">Thêm sản phẩm từ Danh Mục để tiếp tục</p>
          <a
            href="/catalog"
            className="inline-block px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition ripple"
          >
            Khám Phá Sản Phẩm
          </a>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4 shadow-sm"
              >
                {/* Image placeholder */}
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-8 h-8 text-slate-500" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.brand}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-teal-600">Score: {item.score}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-900">{item.price.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4 text-slate-700" />
                  </button>
                  <span className="w-12 text-center text-white font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition"
                  >
                    <Plus className="w-4 h-4 text-slate-700" />
                  </button>
                </div>

                {/* Subtotal & Remove */}
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 mb-2">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-500 text-sm transition"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600">GreenScore Trung Bình:</span>
              <span className="text-2xl font-bold text-teal-600">{avgScore}</span>
            </div>
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
              <span className="text-xl text-slate-900 font-semibold">Tổng Cộng:</span>
              <span className="text-3xl font-bold text-slate-900">{total.toLocaleString('vi-VN')}₫</span>
            </div>
            <button className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition ripple">
              Thanh Toán (MVP Stub)
            </button>
            <p className="mt-3 text-xs text-center text-slate-500">
              Nhận GreenLeaf token khi mua sản phẩm xanh!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
