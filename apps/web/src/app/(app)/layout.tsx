'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import BottomNavigation from '@/components/BottomNavigation';

export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`transition-all duration-300 md:${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Topbar />
        <main className="p-4 sm:p-6 pb-20 md:pb-6">{children}</main>
      </div>
      <BottomNavigation />
    </div>
  );
}
