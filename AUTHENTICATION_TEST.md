# Authentication Flow Verification

## Current Implementation Status

### ✅ Password Security
- **Hashing**: Passwords are hashed using `bcrypt` with 10 salt rounds
- **Storage**: Only hashed passwords are stored in database
- **Verification**: `bcrypt.compare()` used to verify passwords
- **Location**: `backend/src/utils/hash.ts`

### ✅ JWT Implementation
- **Token Generation**: Uses `jsonwebtoken` library
- **Secret**: Stored in `JWT_SECRET` environment variable
- **Expiry**: 7 days
- **Payload**: Contains user ID (`sub`) and role
- **Location**: `backend/src/utils/jwt.ts`

### ✅ Registration Flow
1. User initiates registration → `POST /api/auth/register/initiate`
   - Validates username, email, password
   - Checks for duplicates
   - Generates OTP
   - Sends OTP email
   - Stores OTP in database

2. User verifies OTP → `POST /api/auth/register/verify`
   - Validates OTP
   - Checks expiration (10 minutes)
   - **Hashes password** with bcrypt
   - Creates user in database
   - Generates JWT token
   - Returns token and user data

### ✅ Login Flow
1. User logs in → `POST /api/auth/login`
   - Accepts username OR email
   - Finds user by username/email
   - **Verifies password** using bcrypt.compare()
   - Generates JWT token
   - Returns token and user data

### ✅ Token Usage
- **Storage**: Frontend stores token in `localStorage` as `auth_token`
- **Headers**: Token sent in `Authorization: Bearer <token>` header
- **Validation**: `requireAuth` middleware verifies token on protected routes
- **Location**: `backend/src/middlewares/authMiddleware.ts`

## Security Features

✅ **Password Hashing**: bcrypt with 10 rounds
✅ **JWT Tokens**: Signed with secret, 7-day expiry
✅ **Token Verification**: Middleware validates tokens
✅ **Password Never Exposed**: Only hashes stored
✅ **OTP Expiration**: 10-minute expiry
✅ **Input Validation**: Zod schemas validate all inputs

## Database Schema

```sql
User Table:
- id (UUID, primary key)
- username (unique)
- email (unique)
- password (hashed, bcrypt)
- role (default: 'USER')
- createdAt

OtpVerification Table:
- id (UUID)
- email
- otp
- expiresAt
- createdAt
```

## Testing Authentication

### Test Registration:
```bash
# Step 1: Initiate Registration
curl -X POST http://localhost:4000/api/auth/register/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123456"
  }'

# Response: { "message": "...", "otp": "123456" }

# Step 2: Verify OTP
curl -X POST http://localhost:4000/api/auth/register/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "username": "testuser",
    "password": "test123456"
  }'

# Response: { "token": "jwt-token", "user": {...} }
```

### Test Login:
```bash
# Login with username
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "test123456"
  }'

# Login with email
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "test123456"
  }'

# Response: { "token": "jwt-token", "user": {...} }
```

### Test Protected Route:
```bash
# Get sweets (requires auth)
curl -X GET http://localhost:4000/api/sweets \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Verification Checklist

- [x] Passwords are hashed before storage
- [x] Passwords are never returned in API responses
- [x] JWT tokens are generated on registration
- [x] JWT tokens are generated on login
- [x] Tokens are validated on protected routes
- [x] Tokens expire after 7 days
- [x] Users can login with username OR email
- [x] OTP verification required for registration
- [x] OTP expires after 10 minutes
- [x] Duplicate username/email prevented

## Code Flow

### Registration:
```
User → Frontend → POST /api/auth/register/initiate
  → Backend validates → Generates OTP → Stores OTP → Sends Email
  → User enters OTP → POST /api/auth/register/verify
  → Backend validates OTP → Hashes password → Creates user → Generates JWT
  → Returns token → Frontend stores in localStorage
```

### Login:
```
User → Frontend → POST /api/auth/login
  → Backend finds user → Compares password (bcrypt) → Generates JWT
  → Returns token → Frontend stores in localStorage
```

### Authenticated Request:
```
Frontend → GET /api/sweets (with Authorization header)
  → Backend middleware verifies JWT → Extracts user ID → Processes request
  → Returns data
```

## Production Deployment Notes

1. **Database**: Must use PostgreSQL (not SQLite) for Vercel
2. **JWT_SECRET**: Must be strong and unique in production
3. **Environment Variables**: All must be set in Vercel dashboard
4. **CORS**: Frontend URL must match in `FRONTEND_URL`
5. **Email**: Configure email service for production OTP delivery

