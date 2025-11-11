'use client';

import { useSession, signOut } from 'next-auth/react';
import { Search, User, LogOut, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [q, setQ] = useState('');

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    // Use absolute URL based on current origin to avoid port mismatches
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    signOut({ callbackUrl: `${origin}/login` });
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Logo */}
        <div className="md:hidden">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Yggdrasil Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            <span className="font-extrabold text-lg gradient-text">Yggdrasil</span>
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4 md:mx-0">
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              const query = q.trim();
              router.push(query ? `/catalog?q=${encodeURIComponent(query)}` : '/catalog');
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 bg-white border border-slate-300 rounded-lg text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              aria-label="Tìm kiếm sản phẩm"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                aria-label="Xoá từ khoá"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 text-slate-500"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
          </form>
        </div>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 hover:bg-slate-100 rounded-lg transition"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-500 flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-slate-900">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{session?.user?.email}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-200">
                <p className="text-sm font-medium text-slate-900">{session?.user?.name}</p>
                <p className="text-xs text-slate-500">{session?.user?.email}</p>
              </div>
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Trang Landing
              </a>
              <a
                href="/account"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <User className="w-4 h-4" />
                Tài Khoản
              </a>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Đăng Xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
