'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, Scan, ShoppingCart, User, Leaf, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/home', label: 'Trang Chủ', icon: Home },
  { href: '/catalog', label: 'Danh Mục', icon: Package },
  { href: '/scan', label: 'Quét AR', icon: Scan },
  { href: '/cart', label: 'Giỏ Hàng', icon: ShoppingCart },
  { href: '/account', label: 'Tài Khoản', icon: User },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Force full page reload to switch from (app) layout to (marketing) layout
    // This is necessary because Next.js maintains layout hierarchy
    window.location.href = '/';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40',
          collapsed ? 'w-20' : 'w-72'
        )}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          {!collapsed && (
            <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
              <img src="/logo.png" alt="Yggdrasil Logo" className="w-8 h-8 object-contain" />
              <span className="font-extrabold text-xl gradient-text">Yggdrasil</span>
            </a>
          )}
          {collapsed && (
            <a href="/" onClick={handleLogoClick} className="flex items-center justify-center w-full cursor-pointer">
              <img src="/logo.png" alt="Yggdrasil Logo" className="w-8 h-8 object-contain" />
            </a>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            {collapsed ? (
              <Menu className="w-5 h-5 text-slate-500" />
            ) : (
              <X className="w-5 h-5 text-slate-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-teal-500 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 text-center">MVP v0.1.0 • Testnet</p>
          </div>
        )}
      </aside>
    </>
  );
}
