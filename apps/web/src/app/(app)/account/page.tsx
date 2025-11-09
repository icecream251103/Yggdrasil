'use client';

import { useSession } from 'next-auth/react';
import { User, Award, TrendingUp, FileText, Wallet } from 'lucide-react';

export default function AccountPage() {
  const { data: session } = useSession();

  // Mock data for MVP
  const stats = {
    totalScans: 12,
    greenLeaf: 350,
    greenCert: 2,
    avgScore: 78,
  };

  const activities = [
    { date: '2024-01-15', action: 'Quét sản phẩm: Áo Phông Cotton Hữu Cơ', reward: '+50 GreenLeaf' },
    { date: '2024-01-14', action: 'Nhận GreenCert NFT #001', reward: 'NFT' },
    { date: '2024-01-12', action: 'Quét sản phẩm: Bình Nước Thép Tái Chế', reward: '+30 GreenLeaf' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="scroll-reveal visible">
        <h1 className="text-3xl font-extrabold gradient-text mb-2">Tài Khoản</h1>
        <p className="text-slate-600">Quản lý thông tin và tài sản của bạn</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{session?.user?.name || 'User'}</h2>
            <p className="text-slate-600">{session?.user?.email}</p>
            <p className="text-sm text-teal-600 mt-1">Thành viên từ 2024</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Tổng Lượt Quét</p>
          <p className="text-2xl font-bold text-slate-900">{stats.totalScans}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <Award className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">GreenLeaf Token</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.greenLeaf}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <FileText className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">GreenCert NFT</p>
          <p className="text-2xl font-bold text-cyan-600">{stats.greenCert}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Avg GreenScore</p>
          <p className="text-2xl font-bold text-slate-900">{stats.avgScore}</p>
        </div>
      </div>

      {/* Blockchain Assets */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-teal-600" />
          <h3 className="text-xl font-semibold text-slate-900">Tài Sản On-Chain</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="text-slate-900 font-medium">GreenLeaf Token (GL)</p>
              <p className="text-sm text-slate-600">ERC-20 • Base Sepolia Testnet</p>
            </div>
            <span className="text-xl font-bold text-emerald-600">{stats.greenLeaf} GL</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="text-slate-900 font-medium">GreenCert NFT</p>
              <p className="text-sm text-slate-600">ERC-721 • Base Sepolia Testnet</p>
            </div>
            <span className="text-xl font-bold text-cyan-600">{stats.greenCert} NFT</span>
          </div>
        </div>

        <button className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg transition text-sm">
          Xem Chi Tiết Trên Explorer (Stub)
        </button>
      </div>

      {/* Activity History */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Hoạt Động Gần Đây</h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200"
            >
              <div>
                <p className="text-slate-900 font-medium">{activity.action}</p>
                <p className="text-sm text-slate-600">{activity.date}</p>
              </div>
              <span className="text-sm font-semibold text-teal-600">{activity.reward}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings (stub) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Cài Đặt</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-900 transition border border-slate-200">
            Đổi Mật Khẩu (MVP Stub)
          </button>
          <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-900 transition border border-slate-200">
            Kết Nối Ví (MVP Stub)
          </button>
          <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-900 transition border border-slate-200">
            Thông Báo (MVP Stub)
          </button>
        </div>
      </div>
    </div>
  );
}
