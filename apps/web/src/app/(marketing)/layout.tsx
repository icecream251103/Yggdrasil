import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yggdrasil AR - Chống Tẩy Xanh',
  description: 'WebAR + AI + Blockchain platform cho minh bạch môi trường sản phẩm',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
