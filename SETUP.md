# Sweet Shop Management System - Setup Guide

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=4000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   # Email Configuration (Optional - set EMAIL_ENABLED=true to enable)
   EMAIL_ENABLED=false
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@abhisheksweets.in
   EMAIL_SERVICE=gmail
   ```
   
   **Note**: If `EMAIL_ENABLED=false` or email is not configured, OTPs will be logged to console.

4. Generate Prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:4000`

## Frontend Setup

1. Navigate to the root directory (if not already there)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with:
   ```env
   VITE_API_URL=http://localhost:4000/api
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## Features

### Authentication
- **Registration**: Two-step process with OTP email verification
  - Step 1: Enter username, email, and password → Receive OTP
  - Step 2: Verify OTP → Account created and auto-login
- **Login**: Use username or email with password
- **JWT-based authentication**: Tokens stored in localStorage

### Email/OTP System
- **Real email service integrated** using Nodemailer
- Supports Gmail, SendGrid, and custom SMTP servers
- OTP expires after 10 minutes
- Beautiful HTML email templates with OTP display
- Falls back to console logging if email is disabled or fails

### API Endpoints

#### Authentication
- `POST /api/auth/register/initiate` - Initiate registration (sends OTP)
- `POST /api/auth/register/verify` - Verify OTP and create account
- `POST /api/auth/login` - Login with username/email and password

#### Sweets
- `GET /api/sweets` - List all sweets (public)
- `POST /api/sweets` - Add new sweet (admin only)
- `PUT /api/sweets/:id` - Update sweet (admin only)
- `DELETE /api/sweets/:id` - Delete sweet (admin only)
- `POST /api/sweets/:id/restock` - Restock sweet (admin only)

## Database Schema

The system uses SQLite with Prisma ORM. Key models:
- **User**: username, email, password, role
- **OtpVerification**: email, OTP, expiration
- **Sweet**: name, category, price, quantity, description, imageUrl

## Email Configuration

### Option 1: Gmail (Recommended for Development)

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Add to `.env`:
   ```env
   EMAIL_ENABLED=true
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### Option 2: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Add to `.env`:
   ```env
   EMAIL_ENABLED=true
   EMAIL_SERVICE=sendgrid
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   EMAIL_FROM=noreply@yourdomain.com
   ```

### Option 3: Custom SMTP Server

```env
EMAIL_ENABLED=true
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com
```

### Testing Email Configuration

The server will verify email configuration on startup. Check the console for:
- ✅ `Email configuration verified successfully` - Email is working
- ❌ `Email configuration verification failed` - Check your credentials
- 📧 `Email service disabled` - Set `EMAIL_ENABLED=true` to enable

## Troubleshooting

1. **Backend not starting**: Check that `.env` file exists and has all required variables
2. **Database errors**: Run `npx prisma migrate dev` to apply migrations
3. **CORS errors**: Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
4. **Email not sending**:
   - Check that `EMAIL_ENABLED=true` in `.env`
   - Verify email credentials are correct
   - For Gmail: Use App Password, not regular password
   - Check server console for error messages
   - OTPs will fall back to console logging if email fails
5. **Gmail "Less secure app" error**: Use App Passwords instead of regular password

## Production Deployment

1. Change `JWT_SECRET` to a strong random string
2. Use a production database (PostgreSQL, MySQL, etc.)
3. **Configure email service**:
   - Use a production email service (SendGrid, AWS SES, Mailgun, etc.)
   - Set `EMAIL_ENABLED=true`
   - Use proper SMTP credentials
   - Set `EMAIL_SECURE=true` for port 465
4. Set proper CORS origins in `FRONTEND_URL`
5. Use environment-specific configuration
6. Set `NODE_ENV=production`
7. Use environment variables for all sensitive data (never commit `.env` files)

