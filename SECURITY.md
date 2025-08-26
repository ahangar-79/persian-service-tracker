# راهنمای امنیت - سیستم ردیابی خدمات فارسی

## 🔐 تنظیمات Environment Variables

### فایل‌های مورد نیاز

1. **ایجاد فایل `.env.local`** در root directory:

```bash
# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# NextAuth Configuration - تغییر دهید!
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Authentication Credentials (فقط برای Development)
AUTH_USERNAME=ali-ahangar
AUTH_PASSWORD=test1

# Database Configuration (در آینده)
# DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# API Security
API_SECRET_KEY=your-api-secret-key-here

# Session Configuration (بر حسب ثانیه)
SESSION_MAX_AGE=86400

# Security Settings
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### متغیرهای ضروری

#### `NEXTAUTH_SECRET` 🔑
- **الزامی**: حداقل 32 کاراکتر
- **تولید**: `openssl rand -base64 32`
- **مثال**: `KJH23kjh4k23h4jk23h4jk23h4jk23h4k23h4jk`

#### `NEXTAUTH_URL` 🌐
- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

#### `AUTH_USERNAME` & `AUTH_PASSWORD` 👤
- **فقط برای Development**
- **در Production**: حذف کنید و از Database استفاده کنید

## 🛡️ امکانات امنیتی

### 1. Authentication & Authorization
- ✅ **JWT-based sessions** با NextAuth.js
- ✅ **Password validation** و sanitization
- ✅ **Role-based access control**
- ✅ **Session timeout** قابل تنظیم

### 2. Rate Limiting & Brute Force Protection
- ✅ **Login rate limiting** (5 تلاش در 15 دقیقه)
- ✅ **IP-based blocking** برای درخواست‌های زیاد
- ✅ **Automatic lockout** پس از تلاش‌های نامعتبر
- ✅ **Countdown timer** برای unlock

### 3. Input Validation & Sanitization
- ✅ **Zod schemas** برای validation
- ✅ **XSS prevention** با input sanitization
- ✅ **CSRF protection** از طریق NextAuth
- ✅ **SQL injection prevention** (آماده برای database)

### 4. Security Headers
- ✅ **CSP (Content Security Policy)**
- ✅ **X-Frame-Options: DENY**
- ✅ **X-Content-Type-Options: nosniff**
- ✅ **X-XSS-Protection**
- ✅ **HSTS** (در production)
- ✅ **Referrer Policy**

### 5. Password Security
- ✅ **bcrypt hashing** با salt rounds قابل تنظیم
- ✅ **Password strength validation**
- ✅ **Common password detection**
- ✅ **Secure password storage**

## 🚀 نصب و راه‌اندازی

### 1. Dependencies نصب کنید:

```bash
pnpm install
# یا
npm install
```

### 2. Environment Variables تنظیم کنید:

```bash
cp .env.example .env.local
# سپس .env.local را ویرایش کنید
```

### 3. NEXTAUTH_SECRET تولید کنید:

```bash
# روش 1: OpenSSL
openssl rand -base64 32

# روش 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# روش 3: Online Generator
# https://generate-secret.vercel.app/32
```

### 4. پروژه را اجرا کنید:

```bash
pnpm dev
```

## 🔍 بررسی امنیت

### چک‌لیست امنیت:

- [ ] `NEXTAUTH_SECRET` حداقل 32 کاراکتر
- [ ] `AUTH_PASSWORD` در production حذف شده
- [ ] HTTPS در production فعال
- [ ] Database connection secure
- [ ] Environment variables محفوظ
- [ ] CSP headers تنظیم شده
- [ ] Rate limiting فعال

### ابزارهای بررسی:

```bash
# بررسی dependencies
npm audit

# بررسی TypeScript
pnpm type-check

# بررسی linting
pnpm lint
```

## 📚 مراجع امنیت

### Best Practices:
1. **هرگز secrets را commit نکنید**
2. **Environment variables را secure نگه دارید**
3. **Passwords را hash کنید**
4. **Rate limiting استفاده کنید**
5. **Input validation انجام دهید**
6. **Security headers اعمال کنید**
7. **Regular security audits انجام دهید**

### منابع مفید:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

## 🐛 گزارش مشکلات امنیتی

اگر مشکل امنیتی پیدا کردید:

1. **هرگز در public issue گزارش ندهید**
2. **ایمیل به**: security@yourcompany.com
3. **شامل جزئیات کامل**
4. **پاسخ در 24 ساعت**

## 🔄 بروزرسانی امنیت

### مراحل بروزرسانی:

1. **Dependencies را بروز کنید**:
   ```bash
   pnpm update
   npm audit fix
   ```

2. **Security patches را نصب کنید**
3. **Environment variables را بررسی کنید**
4. **Logs را مانیتور کنید**

---

**⚠️ هشدار**: این راهنما برای development است. در production، از database و security measures اضافی استفاده کنید.
