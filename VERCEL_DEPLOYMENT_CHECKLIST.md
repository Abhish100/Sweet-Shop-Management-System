# Vercel Deployment Checklist

## ✅ Authentication Verification

### Password Security
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Passwords never stored in plain text
- ✅ Passwords never returned in API responses
- ✅ Password verification uses bcrypt.compare()

### JWT Implementation
- ✅ JWT tokens generated on registration
- ✅ JWT tokens generated on login
- ✅ Tokens signed with JWT_SECRET
- ✅ Tokens expire after 7 days
- ✅ Tokens verified in middleware
- ✅ Tokens stored in localStorage (frontend)

### Database Integration
- ✅ User data stored in database
- ✅ Passwords stored as hashes only
- ✅ Username and email are unique
- ✅ OTP verification before account creation

## 🔧 Pre-Deployment Steps

### 1. Database Migration (REQUIRED)
⚠️ **SQLite will NOT work on Vercel**

**Action Required:**
1. Get PostgreSQL database (Vercel Postgres, Supabase, Railway, or Neon)
2. Update `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Run migration: `npx prisma migrate dev --name migrate_to_postgres`
4. Test locally with PostgreSQL connection string

### 2. Environment Variables Setup

#### Backend (Vercel Project - Root: `backend`)
```
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
JWT_SECRET=<generate-strong-secret-32-chars-min>
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
GEMINI_API_KEY=your-gemini-key
EMAIL_ENABLED=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@abhisheksweets.in
```

#### Frontend (Vercel Project - Root: root)
```
VITE_API_URL=https://your-backend.vercel.app/api
GEMINI_API_KEY=your-gemini-key
```

### 3. Generate Strong JWT Secret
```bash
# Generate a strong secret
openssl rand -base64 32
# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📦 Deployment Steps

### Backend Deployment

1. **Create Vercel Project**
   - Import repository
   - Set **Root Directory** to `backend`
   - Framework: Other

2. **Build Settings**
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add all backend environment variables listed above

4. **Deploy**
   - Click Deploy
   - Note the deployment URL (e.g., `https://your-backend.vercel.app`)

### Frontend Deployment

1. **Create Vercel Project**
   - Import same repository
   - Set **Root Directory** to `/` (root)
   - Framework: Vite

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - `VITE_API_URL` = Your backend URL + `/api`
   - `GEMINI_API_KEY` = Your Gemini API key

4. **Deploy**
   - Click Deploy

## 🧪 Post-Deployment Testing

### Test Registration Flow:
```bash
# 1. Initiate Registration
curl -X POST https://your-backend.vercel.app/api/auth/register/initiate \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123456"}'

# 2. Verify OTP (use OTP from response)
curl -X POST https://your-backend.vercel.app/api/auth/register/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","username":"testuser","password":"test123456"}'

# Should return: {"token":"...","user":{...}}
```

### Test Login Flow:
```bash
# Login with username
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"testuser","password":"test123456"}'

# Should return: {"token":"...","user":{...}}
```

### Test Protected Route:
```bash
# Get sweets (requires auth)
curl -X GET https://your-backend.vercel.app/api/sweets \
  -H "Authorization: Bearer <your-jwt-token>"

# Should return: [...sweets array]
```

## 🔍 Verification Checklist

- [ ] Database migrated to PostgreSQL
- [ ] All environment variables set in Vercel
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Frontend API URL points to backend
- [ ] Registration flow works
- [ ] Login flow works
- [ ] JWT tokens are generated
- [ ] JWT tokens are validated
- [ ] Passwords are hashed in database
- [ ] User can login with same credentials
- [ ] Protected routes require authentication
- [ ] CORS configured correctly

## 🐛 Common Issues

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Ensure SSL is enabled (`?sslmode=require`)
- Check database allows connections from Vercel

### JWT Token Invalid
- Verify `JWT_SECRET` is set correctly
- Check token hasn't expired (7 days)
- Ensure token is sent in `Authorization: Bearer <token>` header

### CORS Error
- Verify `FRONTEND_URL` matches your frontend domain
- Check CORS configuration in `backend/src/app.ts`

### Build Errors
- Ensure `prisma generate` runs during build
- Check all dependencies are in `package.json`
- Verify TypeScript compiles without errors

## 📝 Notes

- **Database**: Must use PostgreSQL (not SQLite) for Vercel
- **JWT Secret**: Must be strong and unique in production
- **Email**: Configure email service for production OTP delivery
- **SSL**: Required for database connections in production

