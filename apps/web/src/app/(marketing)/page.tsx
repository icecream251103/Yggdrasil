"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, Lightbulb, Shield, Coins, Menu, X } from "lucide-react";

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/home");
  }, [status, router]);

  useEffect(() => {
    // Header scroll effect
    const header = document.getElementById("header");
    const onScrollHeader = () => {
      if (!header) return;
      if (window.scrollY > 50) {
        header.classList.add("py-2", "bg-white/70", "backdrop-blur-lg", "shadow-md");
        header.classList.remove("py-4");
      } else {
        header.classList.add("py-4");
        header.classList.remove("py-2", "bg-white/70", "backdrop-blur-lg", "shadow-md");
      }
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader);

    // Scroll reveal
    const scrollRevealElements = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    scrollRevealElements.forEach((el) => observer.observe(el));

    // Magic Card & Hero Effect
    document.querySelectorAll<HTMLElement>(".magic-card, .magic-hero").forEach((el) => {
      el.addEventListener("mousemove", (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty("--mouse-x", `${x}px`);
        el.style.setProperty("--mouse-y", `${y}px`);
      });
    });

    // Ripple effect
    function createRipple(this: HTMLElement, event: MouseEvent) {
      const button = this;
      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - (button.getBoundingClientRect().left + radius)}px`;
      circle.style.top = `${event.clientY - (button.getBoundingClientRect().top + radius)}px`;
      circle.classList.add("ripple-effect");
      const ripple = button.getElementsByClassName("ripple-effect")[0];
      if (ripple) ripple.remove();
      button.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    }
    const rippleButtons = document.getElementsByClassName("ripple");
    Array.from(rippleButtons).forEach((btn) => btn.addEventListener("click", createRipple as any));

    // Parallax blobs
    const blob1 = document.getElementById("blob1");
    const blob2 = document.getElementById("blob2");
    const blob3 = document.getElementById("blob3");
    const onScrollBlobs = () => {
      const y = window.scrollY;
      if (blob1) blob1.style.transform = `translateY(${y * 0.15}px)`;
      if (blob2) blob2.style.transform = `translateY(${y * 0.05}px)`;
      if (blob3) blob3.style.transform = `translateY(${y * 0.1}px)`;
    };
    window.addEventListener("scroll", onScrollBlobs);

    return () => {
      window.removeEventListener("scroll", onScrollHeader);
      window.removeEventListener("scroll", onScrollBlobs);
      observer.disconnect();
      Array.from(rippleButtons).forEach((btn) => btn.removeEventListener("click", createRipple as any));
    };
  }, []);

  return (
    <>
      {/* Header */}
      <header id="header" className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center bg-white/70 backdrop-blur-lg rounded-full px-6 py-3 shadow-sm border border-white/20">
            <Link href="#" className="text-2xl font-bold gradient-text">Yggdrasil</Link>
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">Tính năng</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">Cách hoạt động</a>
              <a href="#for-business" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">Cho Doanh nghiệp</a>
            </nav>
            <Link href="/login" className="hidden md:inline-block bg-teal-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 ripple">
              Tham gia ngay
            </Link>
            <button onClick={() => setMobileMenuOpen((o) => !o)} className="md:hidden z-30">
              {mobileMenuOpen ? <X className="h-6 w-6 text-slate-800" /> : <Menu className="h-6 w-6 text-slate-800" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-slate-800/50 backdrop-blur-sm z-20">
            <div className="w-3/4 max-w-sm h-full bg-white p-8 shadow-xl">
              <h2 className="text-3xl font-bold gradient-text mb-10">Yggdrasil</h2>
              <nav className="flex flex-col space-y-6 text-lg">
                <a href="#features" className="mobile-menu-link text-slate-700 hover:text-teal-600" onClick={() => setMobileMenuOpen(false)}>Tính năng</a>
                <a href="#how-it-works" className="mobile-menu-link text-slate-700 hover:text-teal-600" onClick={() => setMobileMenuOpen(false)}>Cách hoạt động</a>
                <a href="#for-business" className="mobile-menu-link text-slate-700 hover:text-teal-600" onClick={() => setMobileMenuOpen(false)}>Cho Doanh nghiệp</a>
                <Link href="/login" className="mt-4 inline-block bg-teal-500 text-white font-semibold px-6 py-3 rounded-full text-center ripple" onClick={() => setMobileMenuOpen(false)}>
                  Tham gia ngay
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/70 to-green-50/40" />
          {/* Hide heavy blobs on very small screens to improve performance */}
          <div id="blob1" className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-green-200/50 rounded-full blur-3xl -mr-20 -mt-20 blob parallax-blob" />
          <div id="blob2" className="hidden sm:block absolute bottom-1/4 left-0 w-64 h-64 bg-teal-200/50 rounded-full blur-3xl -ml-20 blob blob-2 parallax-blob" />
          <div id="blob3" className="hidden sm:block absolute bottom-0 right-1/4 w-56 h-56 bg-purple-200/40 rounded-full blur-3xl blob blob-3 parallax-blob" />

          <div className="container mx-auto px-6 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight animate-in">
                Mua Sắm Minh Bạch. <br className="hidden md:block" /> <span className="gradient-text">Tương Lai Bền Vững.</span>
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto animate-in delay-1">
                Yggdrasil sử dụng AI, AR và Blockchain để hé lộ câu chuyện môi trường đằng sau mỗi sản phẩm. Đưa ra lựa chọn thông minh hơn, ngay hôm nay.
              </p>
              <div className="mt-10 flex justify-center items-center gap-4 animate-in delay-2">
                <Link href="/login" className="bg-teal-500 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 ripple">
                  Tham gia danh sách chờ
                </Link>
                <a href="#features" className="font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                  Tìm hiểu thêm &rarr;
                </a>
              </div>
            </div>
            <div className="mt-10 sm:mt-16 scroll-reveal animate-in delay-3">
              <div className="relative max-w-4xl mx-auto magic-hero rounded-2xl">
                <div className="rounded-2xl overflow-hidden">
                  <div className="aspect-[9/16] sm:aspect-[16/9] md:aspect-[2/1] bg-teal-50 flex items-center justify-center border-4 border-white">
                    <Camera className="w-20 h-20 text-teal-500" />
                    <span className="ml-4 text-2xl text-teal-700 font-semibold">AR Product View Mockup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-base font-semibold text-teal-600 uppercase tracking-wider">Công nghệ đột phá</h3>
              <h4 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">Nền tảng cho sự lựa chọn bền vững</h4>
            </div>
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={<Camera className="w-8 h-8 text-teal-600" />} title="Quét & Khám Phá (AR)" desc="Dùng camera để xem mô hình 3D và hành trình xanh của sản phẩm ngay trước mắt bạn." />
              <FeatureCard icon={<Lightbulb className="w-8 h-8 text-teal-600" />} title="Chỉ số GreenScore (AI)" desc="AI tự động phân tích dữ liệu để tính toán điểm số bền vững, giúp bạn dễ dàng so sánh." delay="150ms" />
              <FeatureCard icon={<Shield className="w-8 h-8 text-teal-600" />} title="Chứng nhận Minh bạch" desc="Mỗi chứng nhận xanh là một NFT trên Blockchain, đảm bảo không thể giả mạo và dễ dàng xác thực." delay="300ms" />
              <FeatureCard icon={<Coins className="w-8 h-8 text-teal-600" />} title="Nhận thưởng GreenLeaf" desc="Nhận GreenLeaf token cho mỗi lựa chọn bền vững và dùng chúng để đổi các ưu đãi độc quyền." delay="450ms" />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-base font-semibold text-teal-600 uppercase tracking-wider">Đơn giản & Hiệu quả</h3>
              <h4 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">Chỉ với 3 bước đơn giản</h4>
            </div>
            <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 border-t-2 border-dashed border-slate-300" />
              <StepCard number="1" title="Quét mã sản phẩm" desc="Mở ứng dụng Yggdrasil và hướng camera vào mã QR trên bao bì sản phẩm." />
              <StepCard number="2" title="Thấy rõ tác động" desc="Xem ngay GreenScore, lượng carbon footprint và toàn bộ chuỗi cung ứng minh bạch." delay="200ms" />
              <StepCard number="3" title="Lựa chọn bền vững" desc="Tự tin mua sắm, biết rằng bạn đang góp phần tạo nên một tương lai tốt đẹp hơn." delay="400ms" />
            </div>
          </div>
        </section>

        {/* For business */}
        <section id="for-business" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-slate-800 rounded-2xl p-10 md:p-16 flex flex-col lg:flex-row items-center gap-10 text-white scroll-reveal overflow-hidden relative">
              <div className="absolute -bottom-16 -left-16 w-48 h-48 border-4 border-teal-500/30 rounded-full" />
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl" />
              <div className="lg:w-1/2 relative z-10">
                <h3 className="text-base font-semibold text-teal-400 uppercase tracking-wider">Dành cho Doanh nghiệp</h3>
                <h4 className="mt-2 text-3xl md:text-4xl font-extrabold">Minh bạch hóa cam kết Xanh của bạn</h4>
                <p className="mt-4 text-slate-300">Nền tảng Yggdrasil giúp các doanh nghiệp bền vững kết nối trực tiếp với người tiêu dùng có ý thức. Công bố dữ liệu ESG, xây dựng niềm tin và phát triển thương hiệu của bạn một cách trung thực.</p>
                <Link href="/login" className="mt-8 inline-block bg-teal-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 ripple">Đăng ký làm đối tác</Link>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-slate-700 rounded-lg p-8 aspect-video flex items-center justify-center">
                  <span className="text-teal-400 text-xl font-semibold">Business Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Sẵn sàng thay đổi cách bạn mua sắm?</h3>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Hãy là những người đầu tiên trải nghiệm Yggdrasil. Tham gia danh sách chờ để nhận thông tin cập nhật và quyền truy cập sớm.</p>
            <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input type="email" placeholder="Nhập email của bạn" className="flex-grow w-full px-5 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400" />
              <button className="bg-teal-500 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-teal-600 transition-colors ripple">Gửi</button>
            </div>
          </div>
        </section>

        {/* Sticky CTA for mobile */}
        <div className={`sm:hidden fixed bottom-3 inset-x-3 z-40 ${mobileMenuOpen ? 'hidden' : ''}`}>
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-xl p-2 flex items-center gap-2">
            <Link href="/login" className="flex-1 bg-teal-500 text-white font-semibold py-3 rounded-lg text-center">Tham gia</Link>
            <Link href="/scan" className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-lg text-center">Dùng thử quét</Link>
          </div>
          <div className="h-[env(safe-area-inset-bottom,0px)]" />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Yggdrasil</h1>
              <p className="mt-2 text-sm text-slate-400">Mua Sắm Minh Bạch, Tương Lai Bền Vững.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:col-span-2">
              <div>
                <h5 className="font-semibold tracking-wider text-slate-200">Sản phẩm</h5>
                <nav className="mt-4 space-y-2">
                  <a href="#features" className="block text-sm hover:text-white">Tính năng</a>
                  <a href="#how-it-works" className="block text-sm hover:text-white">Cách hoạt động</a>
                </nav>
              </div>
              <div>
                <h5 className="font-semibold tracking-wider text-slate-200">Công ty</h5>
                <nav className="mt-4 space-y-2">
                  <a href="#" className="block text-sm hover:text-white">Về chúng tôi</a>
                  <a href="#" className="block text-sm hover:text-white">Tuyển dụng</a>
                  <a href="#" className="block text-sm hover:text-white">Liên hệ</a>
                </nav>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>© 2025 Yggdrasil. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Global styles to match provided HTML design exactly */}
      <style jsx global>{`
        .gradient-text {
          background: -webkit-linear-gradient(45deg, #2a9d8f, #264653);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes animate-blob {
          0%, 100% { transform: translate(0px, -20px) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
        }
        @keyframes animate-blob-2 {
          0%, 100% { transform: translate(0px, 20px) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes animate-blob-3 {
          0%, 100% { transform: translate(-20px, 0px) scale(1); }
          50% { transform: translate(20px, 0px) scale(1.05); }
        }
        .blob { animation: animate-blob 10s ease-in-out infinite alternate; }
        .blob-2 { animation: animate-blob-2 12s ease-in-out infinite alternate; animation-delay: 2s; }
        .blob-3 { animation: animate-blob-3 8s ease-in-out infinite alternate; animation-delay: 4s; }
        .parallax-blob { transition: transform 0.1s ease-out; }

        .magic-card, .magic-hero { position: relative; overflow: hidden; }
        .magic-card::before, .magic-hero::before {
          content: '';
          position: absolute;
          left: var(--mouse-x, 50%);
          top: var(--mouse-y, 50%);
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
          transition: transform 0.3s, opacity 0.3s;
          transform: translate(-50%, -50%) scale(0);
        }
        .magic-card:hover::before, .magic-hero:hover::before { opacity: 1; }
        .magic-card::before {
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(45, 212, 191, 0.2) 0%, rgba(45, 212, 191, 0) 70%);
        }
        .magic-card:hover::before { transform: translate(-50%, -50%) scale(2.5); }
        .magic-hero::before {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, rgba(45, 212, 191, 0) 70%);
        }
        .magic-hero:hover::before { transform: translate(-50%, -50%) scale(2); }

        .ripple { position: relative; overflow: hidden; }
        .ripple .ripple-effect {
          position: absolute; border-radius: 50%; transform: scale(0);
          animation: ripple-animation 0.6s linear; background-color: rgba(255, 255, 255, 0.7);
          width: 0; height: 0;
        }
        @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }

        .animate-in { opacity: 0; transform: translateY(20px); animation: fadeInMoveUp 0.8s ease-out forwards; }
        .animate-in.delay-1 { animation-delay: 0.2s; }
        .animate-in.delay-2 { animation-delay: 0.4s; }
        .animate-in.delay-3 { animation-delay: 0.6s; }
        .animate-in.delay-4 { animation-delay: 0.8s; }
        .animate-in.delay-5 { animation-delay: 1.0s; }
        @keyframes fadeInMoveUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}

function FeatureCard({ icon, title, desc, delay = "0ms" }: { icon: React.ReactNode; title: string; desc: string; delay?: string }) {
  return (
    <div className="text-center p-6 bg-slate-50/70 rounded-2xl scroll-reveal magic-card" style={{ transitionDelay: delay }}>
      <div className="mx-auto w-16 h-16 bg-white flex items-center justify-center rounded-2xl shadow-md">{icon}</div>
      <h5 className="mt-5 font-bold text-lg">{title}</h5>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function StepCard({ number, title, desc, delay = "0ms" }: { number: string; title: string; desc: string; delay?: string }) {
  return (
    <div className="relative text-center scroll-reveal" style={{ transitionDelay: delay }}>
      <div className="relative z-10 w-20 h-20 mx-auto flex items-center justify-center bg-white border-4 border-teal-500 rounded-full font-bold text-2xl text-teal-600">
        {number}
      </div>
      <h5 className="mt-5 font-bold text-lg">{title}</h5>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}
