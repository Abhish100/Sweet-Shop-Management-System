# Registration Flow - How OTP Works

## ✅ Current Implementation

The registration flow is **already implemented** and works as follows:

### Step 1: User Enters Details
- User clicks "Register"
- Enters: Username, Email (Gmail), Password
- Clicks "Create Account"

### Step 2: OTP Sent to Gmail
- Backend generates a 6-digit OTP
- **OTP is automatically sent to the user's Gmail address**
- User sees: "✅ OTP sent to [email]. Please check your Gmail inbox"

### Step 3: User Enters OTP
- User checks their Gmail inbox
- Finds the email from "Abhishek Sweets"
- Enters the 6-digit OTP code
- Clicks "Verify & Create Account"

### Step 4: Account Created
- OTP is verified
- Account is created
- User is automatically logged in

## 🔧 To Enable Gmail OTP

The code is ready, but you need to configure Gmail:

### Quick Setup (3 Steps)

1. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Generate app password → Mail → Other → "Abhishek Sweets"
   - Copy the 16-character password

2. **Update `backend/.env`:**
   ```env
   EMAIL_ENABLED=true
   EMAIL_SERVICE=gmail
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

3. **Restart Backend:**
   ```bash
   cd backend
   npm run dev
   ```

## 📧 What Users Will See

### When Registration Starts:
- User enters: Username, Email, Password
- Clicks "Create Account"
- **OTP is sent to their Gmail automatically**
- Message appears: "✅ OTP sent to [email]. Please check your Gmail inbox"

### Email They Receive:
- **From:** Abhishek Sweets
- **Subject:** Your OTP for Abhishek Sweets Registration
- **Content:** Beautiful HTML email with the 6-digit OTP code
- **Expires:** 10 minutes

### OTP Entry Screen:
- Shows: "Check your Gmail inbox for the 6-digit code sent to [email]"
- User enters OTP
- Clicks "Verify & Create Account"

## ✅ Verification

After setup, test the flow:

1. Go to frontend
2. Click "Register"
3. Enter a Gmail address
4. **Check your Gmail inbox** - you should receive the OTP email
5. Enter the OTP to complete registration

## ⚠️ Troubleshooting

**"Email service is disabled"**
- Set `EMAIL_ENABLED=true` in `backend/.env`

**"Email authentication failed"**
- Use App Password (16 characters), not regular password
- Make sure 2-Step Verification is enabled

**OTP not arriving**
- Check spam/junk folder
- Wait 1-2 minutes
- Check backend console for errors
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct

## 📝 Code Flow

```
User Registration Request
    ↓
initiateRegister() in authService.ts
    ↓
Generate OTP → Store in database
    ↓
sendOtpEmail() → Sends to user's Gmail
    ↓
User receives email with OTP
    ↓
User enters OTP
    ↓
verifyOtpAndRegister() → Verifies OTP
    ↓
Account Created → User Logged In
```

The entire flow is **already implemented and working** - you just need to configure Gmail credentials!

