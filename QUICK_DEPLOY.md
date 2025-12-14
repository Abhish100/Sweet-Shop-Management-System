# Quick Vercel Deployment Guide

## ⚠️ CRITICAL: Database Migration Required

**SQLite will NOT work on Vercel.** You MUST migrate to PostgreSQL before deploying.

## Quick Steps

### 1. Get PostgreSQL Database (5 minutes)

**Option A: Vercel Postgres** (Easiest)
1. Vercel Dashboard → Your Project → Storage → Create Database
2. Select "Postgres"
3. Copy connection string

**Option B: Supabase** (Free)
1. Go to https://supabase.com
2. Create project
3. Settings → Database → Connection string

### 2. Update Database (2 minutes)

```bash
cd backend
# Update schema.prisma - change provider to "postgresql"
# Then run:
npx prisma migrate dev --name migrate_to_postgres
npx prisma generate
```

### 3. Deploy Backend (10 minutes)

1. **Vercel Dashboard** → New Project
2. **Import** your repository
3. **Root Directory**: `backend`
4. **Framework**: Other
5. **Build Command**: `npm run vercel-build`
6. **Output Directory**: `dist`
7. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://...?sslmode=require
   JWT_SECRET=<generate-strong-secret>
   FRONTEND_URL=https://your-frontend.vercel.app
   GEMINI_API_KEY=your-key
   EMAIL_ENABLED=false
   ```
8. **Deploy** → Note the URL

### 4. Deploy Frontend (5 minutes)

1. **Vercel Dashboard** → New Project
2. **Import** same repository
3. **Root Directory**: `/` (root)
4. **Framework**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
8. **Deploy**

## Generate JWT Secret

```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Test After Deployment

1. Open frontend URL
2. Try registering a new user
3. Check OTP in email (or backend logs if email disabled)
4. Complete registration
5. Logout and login again with same credentials
6. Verify you can access protected routes

## ✅ Authentication Status

- ✅ Passwords: Hashed with bcrypt (10 rounds)
- ✅ JWT: Generated on registration/login
- ✅ Tokens: Validated on protected routes
- ✅ Security: Ready for production

**Your authentication is working correctly!** Just need to migrate database to PostgreSQL for Vercel.

