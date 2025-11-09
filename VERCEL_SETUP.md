# Hướng dẫn Setup Vercel cho Yggdrasil

## ⚠️ BẮT BUỘC - Setup Ngay Sau Khi Deploy

### Bước 1: Tạo NEXTAUTH_SECRET

**Chạy lệnh này để tạo secret:**

**PowerShell (Windows):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac/WSL:**
```bash
openssl rand -base64 32
```

**Hoặc trực tuyến:**
https://generate-secret.vercel.app/32

**→ Copy output, bạn sẽ cần nó ở bước 2.**

---

### Bước 2: Thêm Environment Variables vào Vercel

1. Mở **Vercel Dashboard**: https://vercel.com/dashboard
2. Chọn project **yggdrasil-web**
3. Vào **Settings** → **Environment Variables**
4. Thêm **2 biến** sau:

#### Biến 1: NEXTAUTH_SECRET (BẮT BUỘC)

- **Name**: `NEXTAUTH_SECRET`
- **Value**: (paste secret từ bước 1)
- **Environment**: Chọn **Production**, **Preview**, **Development** (cả 3)
- Click **Save**

#### Biến 2: NEXTAUTH_URL (BẮT BUỘC cho Production)

- **Name**: `NEXTAUTH_URL`
- **Value**: `https://yggdrasil-web.vercel.app`
- **Environment**: Chỉ chọn **Production**
- Click **Save**

---

### Bước 3: Redeploy Project

**SAU KHI thêm environment variables, BẮT BUỘC phải redeploy:**

1. Vào tab **Deployments**
2. Click vào deployment **mới nhất** (top of list)
3. Click nút **"..."** (3 dots) ở góc phải
4. Chọn **"Redeploy"**
5. Chọn **"Use existing Build Cache"** (nhanh hơn)
6. Click **"Redeploy"**

⏱️ Đợi 2-3 phút để build hoàn tất.

---

## ✅ Kiểm tra sau khi deploy

### Test 1: Kiểm tra Auth Providers

Mở URL:
```
https://yggdrasil-web.vercel.app/api/auth/providers
```

**Kết quả mong đợi:**
```json
{
  "credentials": {
    "id": "credentials",
    "name": "Credentials",
    "type": "credentials",
    "signinUrl": "https://yggdrasil-web.vercel.app/api/auth/signin/credentials",
    "callbackUrl": "https://yggdrasil-web.vercel.app/api/auth/callback/credentials"
  }
}
```

**Nếu trả về lỗi 500 hoặc trống → thiếu `NEXTAUTH_SECRET`**

### Test 2: Đăng nhập

1. Mở: `https://yggdrasil-web.vercel.app/login`
2. **Nhập:**
   - Email: `demo@yggdrasil.io`
   - Password: `demo123`
3. Click **Đăng nhập**

**Kết quả mong đợi:**
- Redirect về `/home`
- Không bị redirect về `/login?error=Configuration`

### Test 3: Navigate giữa các trang

Sau khi đăng nhập, thử:
- Click **Danh mục** → phải vào `/catalog`
- Click **Quét QR** → phải vào `/scan`
- **KHÔNG bị redirect về login**

---

## 🐛 Troubleshooting

### Lỗi: "Configuration" error khi login

**Nguyên nhân:**
- Thiếu `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` không khớp với domain Vercel

**Giải pháp:**
1. Kiểm tra `NEXTAUTH_SECRET` đã được set chưa (Settings → Environment Variables)
2. Đảm bảo `NEXTAUTH_URL` = `https://yggdrasil-web.vercel.app` (chính xác)
3. **Redeploy** sau khi sửa
4. **Clear cookies** của site trước khi test lại

### Lỗi: Bị redirect về login ngay sau khi login thành công

**Nguyên nhân:**
- Cookie session không được set đúng domain
- `NEXTAUTH_URL` sai hoặc thiếu

**Giải pháp:**
1. Mở DevTools → Application → Cookies
2. Kiểm tra có cookie `next-auth.session-token` không
3. Nếu không có → set lại `NEXTAUTH_URL` chính xác
4. Redeploy và clear cookies

### Lỗi: "There is a problem with the server configuration"

**Nguyên nhân:**
- `NEXTAUTH_SECRET` chưa được set

**Giải pháp:**
1. Thêm `NEXTAUTH_SECRET` (xem Bước 2)
2. **BẮT BUỘC redeploy** sau khi thêm
3. Vercel không tự reload env vars cho deployment cũ

### Không thể đăng ký tài khoản mới

**Nguyên nhân:**
- MVP dùng in-memory mock database, users sẽ mất sau mỗi lần redeploy

**Giải pháp (tạm thời):**
- Dùng tài khoản demo: `demo@yggdrasil.io` / `demo123`
- Hoặc đăng ký và test ngay (trước khi redeploy lần sau)
- **Lâu dài:** Thêm database (Postgres/MongoDB) để persist users

---

## 📋 Checklist Setup Hoàn Chỉnh

- [ ] `NEXTAUTH_SECRET` đã được tạo (32+ ký tự random)
- [ ] `NEXTAUTH_SECRET` đã được thêm vào Vercel (cả 3 environments)
- [ ] `NEXTAUTH_URL` = `https://yggdrasil-web.vercel.app` (Production only)
- [ ] Đã **Redeploy** sau khi thêm env vars
- [ ] Test `/api/auth/providers` trả về JSON đúng
- [ ] Login với `demo@yggdrasil.io` / `demo123` thành công
- [ ] Navigate qua catalog/scan không bị redirect về login
- [ ] Cookie `next-auth.session-token` được set trong DevTools

---

## 🔒 Bảo mật

- **NEXTAUTH_SECRET**: Giữ bí mật, không commit vào Git
- Mỗi environment (production/preview/dev) nên dùng secret khác nhau (tùy chọn)
- Định kỳ rotate secret (khuyến nghị 3-6 tháng)

---

**Nếu vẫn gặp lỗi sau khi làm theo hướng dẫn trên:**

1. Check **Vercel Deployment Logs** (Function Logs tab)
2. Check browser DevTools → Console/Network tab
3. Copy error message và gửi để debug tiếp!

