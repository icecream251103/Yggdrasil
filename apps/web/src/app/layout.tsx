import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootProviders from '@/components/RootProviders';

// Use Inter for landing as per design (Vietnamese subset included by default)
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Yggdrasil - Mua Sắm Minh Bạch, Tương Lai Bền Vững',
  description: 'WebAR + AI + Blockchain platform cho minh bạch môi trường sản phẩm',
  keywords: ['webAR', 'blockchain', 'ESG', 'sustainability', 'greenwashing'],
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
          async
        ></script>
      </head>
      {/* Light theme baseline to match new landing design */}
      <body className={`${inter.variable} antialiased bg-slate-50 text-slate-800`} suppressHydrationWarning>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
