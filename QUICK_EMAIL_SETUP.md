# Quick Email Setup Guide

## Enable Gmail OTP in 3 Steps

### Step 1: Enable 2-Step Verification & Get App Password

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Select **Mail** → **Other (Custom name)**
5. Enter: `Abhishek Sweets`
6. Click **Generate**
7. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update backend/.env

Open `backend/.env` and change:

```env
EMAIL_ENABLED=true
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
```

**Important:**
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `your-16-character-app-password` with the password from Step 1 (remove spaces)
- Use the **App Password**, NOT your regular Gmail password

### Step 3: Restart Backend

1. Stop the backend server (Ctrl+C)
2. Restart: `cd backend && npm run dev`

### Test It!

1. Go to the frontend
2. Click **Register**
3. Enter your Gmail address
4. Check your **Gmail inbox** (and spam folder) for the OTP
5. Enter the OTP to complete registration

### Troubleshooting

**"Email service is disabled"**
- Set `EMAIL_ENABLED=true` in `backend/.env`

**"Email authentication failed"**
- Check that you're using the **App Password** (16 characters), not your regular password
- Make sure 2-Step Verification is enabled

**"Could not connect to email server"**
- Check `EMAIL_HOST=smtp.gmail.com` and `EMAIL_PORT=587`
- Check your internet connection

**Emails not arriving**
- Check spam/junk folder
- Wait 1-2 minutes (sometimes there's a delay)
- Check backend console for error messages

