# Hướng dẫn Setup Vercel cho Yggdrasil

## Bước 1: Cấu hình Environment Variables trên Vercel

Vào Vercel Dashboard → Project Settings → Environment Variables, thêm các biến sau:

### Required (Bắt buộc)

```bash
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-secret-here-use-openssl-rand-base64-32
```

**Cách tạo NEXTAUTH_SECRET:**
```bash
# Trên terminal (Linux/Mac/WSL):
openssl rand -base64 32

# Hoặc trên PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Hoặc online: https://generate-secret.vercel.app/32
```

### Optional (Tùy chọn - cho tính năng blockchain sau)

```bash
NEXT_PUBLIC_API_URL=https://api.yggdrasil.yourdomain.com
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_NETWORK_NAME=Base Sepolia
```

## Bước 2: Đảm bảo NEXTAUTH_URL đúng

- **Production**: `https://your-project.vercel.app` (URL thật của Vercel deployment)
- **Preview**: Vercel tự động set `VERCEL_URL`, NextAuth sẽ detect
- **Development**: `http://localhost:3000`

## Bước 3: Kiểm tra sau khi deploy

1. Mở `https://your-project.vercel.app/login`
2. Thử đăng nhập với:
   - Email: `demo@yggdrasil.io`
   - Password: `demo123`
3. Hoặc đăng ký tài khoản mới (MVP cho phép đăng ký tự do)

## Lỗi thường gặp

### 1. "Configuration error" / "There is a problem with the server configuration"
**Nguyên nhân**: Thiếu `NEXTAUTH_SECRET`
**Giải pháp**: Thêm `NEXTAUTH_SECRET` vào Vercel Environment Variables

### 2. "Callback URL Mismatch"
**Nguyên nhân**: `NEXTAUTH_URL` không khớp với domain Vercel
**Giải pháp**: 
- Xóa `NEXTAUTH_URL` khỏi Vercel (để NextAuth auto-detect)
- HOẶC set chính xác: `https://your-actual-vercel-url.vercel.app`

### 3. Redirect loop
**Nguyên nhân**: Middleware hoặc session check lỗi
**Giải pháp**: Kiểm tra `middleware.ts` matcher config

### 4. "Invalid credentials" khi đăng nhập đúng
**Nguyên nhân**: Environment variables chưa apply sau khi thay đổi
**Giải pháp**: Redeploy lại project trên Vercel

## Kiểm tra nhanh

Sau khi deploy, truy cập:
```
https://your-project.vercel.app/api/auth/providers
```

Phải trả về JSON:
```json
{
  "credentials": {
    "id": "credentials",
    "name": "Credentials",
    "type": "credentials",
    ...
  }
}
```

Nếu trả về error 500 → thiếu `NEXTAUTH_SECRET`.

## Redeploy sau khi thêm env vars

Sau khi thêm/sửa environment variables:
1. Vào Deployments tab
2. Click vào deployment mới nhất
3. Click "..." → "Redeploy"
4. HOẶC push commit mới lên GitHub để trigger auto-deploy

## Checklist cuối cùng

- [ ] `NEXTAUTH_SECRET` đã được set (32+ ký tự random)
- [ ] `NEXTAUTH_URL` đúng hoặc để trống (auto-detect)
- [ ] Đã redeploy sau khi thêm env vars
- [ ] Thử login với `demo@yggdrasil.io` / `demo123`
- [ ] Middleware không block `/login` route

---

**Lưu ý MVP**: Hiện tại auth dùng in-memory mock database, mọi đăng ký sẽ mất sau khi redeploy. Để persist users, cần thêm database (Postgres/MongoDB) sau.
