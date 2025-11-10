# Hướng dẫn cài đặt Logo Yggdrasil

## Bước 1: Lưu logo vào thư mục public

1. Lưu ảnh logo (cây mạch điện tử gradient xanh-teal) vào:
   - `apps/web/public/logo.png` (cho logo chính)
   - `apps/web/public/favicon.ico` (cho favicon trình duyệt)

2. Khuyến nghị kích thước:
   - `logo.png`: 512x512px hoặc lớn hơn (PNG với nền trong suốt)
   - `favicon.ico`: 32x32px, 16x16px multi-size ICO

## Bước 2: Các file đã được cập nhật

Sau khi lưu logo, các component sau sẽ tự động hiển thị logo:

1. **Landing page header** (`apps/web/src/app/(marketing)/page.tsx`)
   - Logo hiển thị ở góc trái header
   - Tự động responsive cho mobile

2. **Sidebar** (`apps/web/src/components/Sidebar.tsx`)
   - Logo hiển thị ở đầu sidebar
   - Thu nhỏ khi sidebar collapsed

3. **Login/Register pages** (`apps/web/src/app/(auth)/login/page.tsx`, `register/page.tsx`)
   - Logo hiển thị ở trên cùng form đăng nhập

4. **Footer** (landing page)
   - Logo hiển thị trong footer

5. **Metadata** (`apps/web/src/app/layout.tsx`)
   - Favicon tự động load từ /favicon.ico

## Bước 3: Verify

Sau khi lưu logo, chạy:
```bash
cd apps/web
npm run dev
```

Truy cập http://localhost:3000 và kiểm tra:
- ✓ Logo hiển thị ở header landing page
- ✓ Logo hiển thị trong sidebar app
- ✓ Logo hiển thị ở trang login
- ✓ Favicon hiển thị trên tab trình duyệt
