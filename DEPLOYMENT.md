# 🚀 دليل النشر والتوزيع

هذا الدليل يوضح كيفية نشر مشروع سند على منصات مختلفة.

## 📋 متطلبات النشر

### الحد الأدنى من المتطلبات
- **Node.js**: 18.0.0 أو أحدث
- **npm**: 8.0.0 أو أحدث
- **قاعدة بيانات**: PostgreSQL 13+ أو SQLite
- **ذاكرة**: 512MB RAM كحد أدنى
- **مساحة**: 1GB مساحة تخزين

### متغيرات البيئة المطلوبة
```env
# قاعدة البيانات
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# المصادقة
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# البيئة
NODE_ENV="production"
```

## ☁️ النشر على Vercel

### 1. التحضير
```bash
# تأكد من أن المشروع جاهز
npm run build
npm run lint
npm run type-check
```

### 2. ربط المشروع
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# ربط المشروع
vercel link
```

### 3. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة بيانات PostgreSQL على Vercel
vercel postgres create

# أو استخدام Supabase
# إنشاء مشروع جديد على https://supabase.com
# نسخ DATABASE_URL من إعدادات المشروع
```

### 4. إعداد متغيرات البيئة
```bash
# إضافة متغيرات البيئة
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add GEMINI_API_KEY
```

### 5. النشر
```bash
# نشر للإنتاج
vercel --prod

# أو استخدام GitHub Integration
# ربط المستودع بـ Vercel وسيتم النشر تلقائياً
```

### 6. إعداد قاعدة البيانات
```bash
# تشغيل migrations
npx prisma migrate deploy

# إنشاء بيانات تجريبية (اختياري)
npx prisma db seed
```

## 🐳 النشر باستخدام Docker

### 1. إنشاء Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. إنشاء docker-compose.yml
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/sanadbot
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-here
      - GEMINI_API_KEY=your-api-key
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=sanadbot
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### 3. البناء والتشغيل
```bash
# بناء الصورة
docker-compose build

# تشغيل الخدمات
docker-compose up -d

# تشغيل migrations
docker-compose exec app npx prisma migrate deploy

# إنشاء بيانات تجريبية
docker-compose exec app npx prisma db seed
```

## 🌐 النشر على Netlify

### 1. إعداد المشروع
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# ربط المشروع
netlify link
```

### 2. إعداد netlify.toml
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. النشر
```bash
# نشر للإنتاج
netlify deploy --prod
```

## 🖥️ النشر على VPS/خادم مخصص

### 1. إعداد الخادم
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# تثبيت Nginx
sudo apt install nginx -y

# تثبيت PM2
npm install -g pm2
```

### 2. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة بيانات
sudo -u postgres createdb sanadbot
sudo -u postgres createuser --interactive
```

### 3. نسخ المشروع
```bash
# استنساخ المشروع
git clone https://github.com/yourusername/sanad-bot.git
cd sanad-bot

# تثبيت التبعيات
npm ci --production

# إنشاء ملف البيئة
cp .env.example .env
# تحرير .env بالقيم الصحيحة

# بناء المشروع
npm run build

# تشغيل migrations
npx prisma migrate deploy
```

### 4. إعداد PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'sanad-bot',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/sanad-bot',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

```bash
# تشغيل التطبيق
pm2 start ecosystem.config.js

# حفظ إعدادات PM2
pm2 save
pm2 startup
```

### 5. إعداد Nginx
```nginx
# /etc/nginx/sites-available/sanad-bot
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/sanad-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. إعداد SSL
```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx -y

# الحصول على شهادة SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📊 مراقبة الأداء

### 1. إعداد المراقبة
```bash
# مراقبة PM2
pm2 monit

# سجلات التطبيق
pm2 logs sanad-bot

# إحصائيات النظام
pm2 status
```

### 2. إعداد التنبيهات
```javascript
// تثبيت pm2-logrotate
pm2 install pm2-logrotate

// إعداد تدوير السجلات
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## 🔄 التحديثات التلقائية

### 1. إعداد GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### 2. إعداد Webhook للخادم المخصص
```bash
# إنشاء سكريبت التحديث
#!/bin/bash
# deploy.sh

cd /path/to/sanad-bot
git pull origin main
npm ci --production
npm run build
npx prisma migrate deploy
pm2 reload sanad-bot

echo "تم التحديث بنجاح في $(date)"
```

## 🛡️ الأمان في الإنتاج

### 1. متغيرات البيئة الآمنة
```env
# استخدم كلمات مرور قوية
NEXTAUTH_SECRET="complex-random-string-here"
DATABASE_URL="postgresql://user:strong-password@host:port/db"

# تفعيل HTTPS
NEXTAUTH_URL="https://yourdomain.com"

# تقييد CORS
ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

### 2. إعدادات الأمان
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

## 📈 تحسين الأداء

### 1. تحسين قاعدة البيانات
```sql
-- إنشاء فهارس للأداء
CREATE INDEX idx_conversations_bot_id ON "Conversation"("botId");
CREATE INDEX idx_conversations_created_at ON "Conversation"("createdAt");
CREATE INDEX idx_qas_bot_id ON "QA"("botId");
CREATE INDEX idx_knowledge_sources_bot_id ON "KnowledgeSource"("botId");
```

### 2. تحسين Next.js
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  compress: true,
  poweredByHeader: false,
};
```

## 🔧 استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في الاتصال بقاعدة البيانات
```bash
# التحقق من الاتصال
npx prisma db pull

# إعادة إنشاء العميل
npx prisma generate
```

#### 2. مشاكل في البناء
```bash
# مسح الكاش
npm run clean
rm -rf .next
npm run build
```

#### 3. مشاكل في المصادقة
```bash
# التحقق من متغيرات البيئة
echo $NEXTAUTH_URL
echo $NEXTAUTH_SECRET
```

### سجلات مفيدة
```bash
# سجلات التطبيق
pm2 logs sanad-bot --lines 100

# سجلات قاعدة البيانات
sudo tail -f /var/log/postgresql/postgresql-*.log

# سجلات Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 📞 الدعم

للحصول على مساعدة في النشر:
- 📧 البريد الإلكتروني: support@sanadbot.com
- 📚 التوثيق: [README.md](README.md)
- 🐛 الإبلاغ عن مشاكل: [GitHub Issues](https://github.com/yourusername/sanad-bot/issues)

---

**نصيحة**: اختبر النشر على بيئة تجريبية قبل النشر للإنتاج!