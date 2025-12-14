# Deployment Guide for Vercel

## Important: Database Migration Required

⚠️ **SQLite will NOT work on Vercel** (serverless functions). You need to use **PostgreSQL**.

## Step 1: Set Up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database
3. Select "Postgres"
4. Create database and note the connection string

### Option B: External PostgreSQL (Railway, Supabase, Neon, etc.)
- **Railway**: https://railway.app
- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Free tier available)

## Step 2: Update Prisma Schema

Update `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
cd backend
npx prisma migrate dev --name migrate_to_postgres
npx prisma generate
```

## Step 3: Backend Deployment (Vercel)

### 3.1 Create `backend/vercel.json` (Already created)

### 3.2 Update `backend/package.json` scripts:
```json
{
  "scripts": {
    "build": "prisma generate && tsc",
    "start": "node dist/server.js",
    "vercel-build": "prisma generate && tsc"
  }
}
```

### 3.3 Deploy Backend:
1. Go to Vercel Dashboard
2. Import your repository
3. Set **Root Directory** to `backend`
4. Add Environment Variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Strong random string (generate with: `openssl rand -base64 32`)
   - `NODE_ENV` - `production`
   - `FRONTEND_URL` - Your frontend URL (e.g., `https://your-app.vercel.app`)
   - `GEMINI_API_KEY` - Your Gemini API key
   - `EMAIL_ENABLED` - `true` or `false`
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`, etc. (if email enabled)

5. Build Command: `npm run vercel-build`
6. Output Directory: `dist`
7. Install Command: `npm install`

## Step 4: Frontend Deployment (Vercel)

### 4.1 Update Frontend API URL

Update `vite.config.ts` or create `.env.production`:
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### 4.2 Deploy Frontend:
1. Create new Vercel project
2. Set **Root Directory** to root (not `backend`)
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variables:
   - `VITE_API_URL` - Your backend API URL
   - `GEMINI_API_KEY` - Your Gemini API key (for frontend if needed)

## Step 5: Environment Variables Checklist

### Backend (.env on Vercel):
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `JWT_SECRET` - Strong secret (32+ characters)
- ✅ `NODE_ENV` - `production`
- ✅ `FRONTEND_URL` - Frontend domain
- ✅ `GEMINI_API_KEY` - For image generation
- ✅ `EMAIL_ENABLED` - `true` or `false`
- ✅ Email config (if enabled)

### Frontend (.env on Vercel):
- ✅ `VITE_API_URL` - Backend API URL
- ✅ `GEMINI_API_KEY` - (Optional, if used in frontend)

## Step 6: Verify Authentication Flow

### Test Registration:
1. User registers → OTP sent
2. User verifies OTP → Account created
3. Password is **hashed** with bcrypt (10 rounds)
4. JWT token generated and returned
5. Token stored in localStorage

### Test Login:
1. User logs in with username/email + password
2. Password verified against hashed password
3. JWT token generated and returned
4. Token used for authenticated requests

## Security Checklist

✅ **Passwords**: Hashed with bcrypt (10 rounds) - ✅ Implemented
✅ **JWT Tokens**: Signed with secret, 7-day expiry - ✅ Implemented
✅ **Token Storage**: localStorage (frontend) - ✅ Implemented
✅ **Token Validation**: Middleware verifies tokens - ✅ Implemented
✅ **Password Never Sent**: Only hashed passwords stored - ✅ Implemented

## Testing Authentication

### Manual Test:
```bash
# Register
curl -X POST https://your-backend.vercel.app/api/auth/register/initiate \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'

# Verify OTP (use OTP from response)
curl -X POST https://your-backend.vercel.app/api/auth/register/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","username":"testuser","password":"test123"}'

# Login
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"testuser","password":"test123"}'
```

## Troubleshooting

### Database Connection Issues:
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL is enabled (add `?sslmode=require` to connection string)

### JWT Issues:
- Verify `JWT_SECRET` is set and strong
- Check token expiration (7 days)
- Verify token is sent in Authorization header

### CORS Issues:
- Ensure `FRONTEND_URL` matches your frontend domain
- Check CORS configuration in `backend/src/app.ts`

## Production Checklist

- [ ] Database migrated to PostgreSQL
- [ ] All environment variables set in Vercel
- [ ] JWT_SECRET is strong and secure
- [ ] Frontend API URL points to backend
- [ ] Email service configured (if using)
- [ ] CORS configured correctly
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test token authentication
- [ ] Verify passwords are hashed in database

