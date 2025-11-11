'use client';

import { useSession } from 'next-auth/react';
import { Package, Scan, TrendingUp, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { href: '/scan', label: 'Quét QR', description: 'Quét sản phẩm để xem AR', icon: Scan, color: 'bg-teal-500' },
  { href: '/catalog', label: 'Danh Mục', description: 'Xem các sản phẩm xanh', icon: Package, color: 'bg-cyan-500' },
  { href: '/account', label: 'GreenLeaf', description: 'Token thưởng của bạn', icon: Award, color: 'bg-emerald-500' },
];

const RECENT_SCANS = [
  { id: '001', name: 'Áo Phông Cotton Hữu Cơ', score: 85, date: '2024-01-15' },
  { id: '002', name: 'Bình Nước Thép Tái Chế', score: 72, date: '2024-01-14' },
];

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-6">
      {/* Welcome Section - Mobile Optimized */}
      <section className="relative scroll-reveal visible">
        <div className="relative p-[2px] rounded-2xl animated-gradient">
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-lg">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 gradient-text">
              Chào mừng, {session?.user?.name?.split(' ')[0] || 'bạn'} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-5">
              Khám phá sản phẩm xanh và theo dõi tác động môi trường.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link 
                href="/scan" 
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition ripple font-medium"
              >
                <Scan className="w-5 h-5 sm:w-4 sm:h-4" /> Bắt đầu quét
              </Link>
              <Link 
                href="/catalog" 
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700 transition font-medium"
              >
                Xem danh mục <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions - Mobile Optimized */}
      <section className="scroll-reveal visible">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4 px-1">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition duration-300 active:scale-95"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">{action.label}</h3>
                <p className="text-xs sm:text-sm text-slate-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Scans - Mobile Optimized */}
      <section className="scroll-reveal visible">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4 px-1">Lượt quét gần đây</h2>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {RECENT_SCANS.map((scan, index) => (
            <div
              key={scan.id}
              className={`flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 transition active:bg-slate-100 ${
                index > 0 ? 'border-t border-slate-200' : ''
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base text-slate-900 font-medium truncate">{scan.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500">{scan.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                <span className="text-base sm:text-lg font-bold text-teal-600">{scan.score}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Overview - Mobile Optimized */}
      <section className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4 scroll-reveal visible">
        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-6 shadow-sm">
          <p className="text-xs sm:text-sm text-slate-500 mb-1">Lượt quét</p>
          <p className="text-xl sm:text-3xl font-bold text-slate-900">12</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-6 shadow-sm">
          <p className="text-xs sm:text-sm text-slate-500 mb-1 truncate">GreenLeaf</p>
          <p className="text-xl sm:text-3xl font-bold text-emerald-600">350</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-6 shadow-sm">
          <p className="text-xs sm:text-sm text-slate-500 mb-1 truncate">GreenCert</p>
          <p className="text-xl sm:text-3xl font-bold text-teal-600">2</p>
        </div>
      </section>

      {/* Local styles for animated border */}
      <style jsx>{`
        .animated-gradient {
          background: linear-gradient(120deg, rgba(45,212,191,.5), rgba(34,197,94,.5), rgba(6,182,212,.5));
          background-size: 300% 300%;
          animation: borderFlow 8s ease infinite;
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
