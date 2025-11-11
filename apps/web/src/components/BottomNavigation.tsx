'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Scan, ShoppingCart, User } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/home', label: 'Trang Chủ', icon: Home },
  { href: '/catalog', label: 'Danh Mục', icon: Package },
  { href: '/scan', label: 'Quét AR', icon: Scan },
  { href: '/cart', label: 'Giỏ Hàng', icon: ShoppingCart },
  { href: '/account', label: 'Tài Khoản', icon: User },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex-1 flex flex-col items-center gap-1 px-2 py-3 transition-all active:scale-95',
                isActive
                  ? 'text-teal-500'
                  : 'text-slate-600 hover:text-slate-800'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive && 'text-teal-500')} />
              <span className={clsx('text-xs font-medium', isActive && 'text-teal-500')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}