'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signIn('credentials', { 
        email, 
        password, 
        redirect: false,
      });
      
      if (result?.error) {
        setError('Email hoặc mật khẩu không đúng');
      } else if (result?.ok) {
        window.location.href = '/home'; // Force full page reload
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md scroll-reveal visible">
      {/* Decorative floating blobs */}
      <span className="auth-blob auth-blob-1" aria-hidden="true" />
      <span className="auth-blob auth-blob-2" aria-hidden="true" />
      <div className="relative p-[2px] rounded-2xl animated-gradient">
        <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition duration-300 will-change-transform hover:-translate-y-0.5">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <img src="/logo.png" alt="Yggdrasil Logo" className="w-10 h-10 object-contain" />
            <span className="text-3xl font-extrabold gradient-text">Yggdrasil</span>
          </Link>
          <p className="text-slate-500 mt-2">Chống tẩy xanh bằng công nghệ</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-100 rounded-full p-1">
          <div className="flex-1 text-center py-2 bg-teal-500 text-white rounded-full font-medium">Đăng Nhập</div>
          <Link href="/register" className="flex-1 text-center py-2 text-slate-600 hover:text-slate-900 rounded-full font-medium transition">Đăng Ký</Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@yggdrasil.io"
                className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition transition-shadow focus:shadow-[0_0_0_4px_rgba(45,212,191,0.12)]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition transition-shadow focus:shadow-[0_0_0_4px_rgba(45,212,191,0.12)]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 text-white font-semibold rounded-lg transition ripple">
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs text-slate-600 mb-2 font-medium">Demo Account:</p>
          <p className="text-xs text-slate-500">Email: demo@yggdrasil.io</p>
          <p className="text-xs text-slate-500">Password: demo123</p>
        </div>

        {/* Back to landing */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-600 hover:text-teal-600 transition">← Quay lại trang chủ</Link>
        </div>
        </div>
      </div>
      {/* Local styles for animated border & blobs */}
      <style jsx>{`
        .animated-gradient {
          background: linear-gradient(120deg, rgba(45,212,191,.6), rgba(34,197,94,.6), rgba(6,182,212,.6));
          background-size: 300% 300%;
          animation: borderFlow 8s ease infinite;
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .auth-blob { position: absolute; border-radius: 9999px; filter: blur(60px); opacity: .35; }
        .auth-blob-1 { width: 260px; height: 260px; top: -70px; right: -90px; background: radial-gradient(circle at 30% 30%, rgba(45,212,191,.5), transparent 60%); animation: float1 12s ease-in-out infinite alternate; }
        .auth-blob-2 { width: 300px; height: 300px; bottom: -100px; left: -110px; background: radial-gradient(circle at 70% 70%, rgba(6,182,212,.45), transparent 60%); animation: float2 14s ease-in-out infinite alternate; }
        @keyframes float1 { from { transform: translateY(0px) } to { transform: translateY(12px) } }
        @keyframes float2 { from { transform: translateY(0px) } to { transform: translateY(-12px) } }
      `}</style>
    </div>
  );
}
