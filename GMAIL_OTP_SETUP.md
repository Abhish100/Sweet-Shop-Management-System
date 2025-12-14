# Gmail OTP Setup Guide

## Configure Gmail to Send OTP Emails

To receive OTP emails on your Gmail account, you need to configure the backend with Gmail SMTP settings.

### Step 1: Enable Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under **2-Step Verification**, make sure it's enabled
4. Scroll down and click on **App passwords**
5. Select **Mail** and **Other (Custom name)**
6. Enter "Abhishek Sweets" as the name
7. Click **Generate**
8. **Copy the 16-character password** (you'll need this)

### Step 2: Update Backend .env File

Open `backend/.env` and add/update these variables:

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
- `EMAIL_USER`: Your Gmail address (e.g., `yourname@gmail.com`)
- `EMAIL_PASS`: The 16-character app password from Step 1 (NOT your regular Gmail password)
- `EMAIL_FROM`: Usually the same as `EMAIL_USER`

### Step 3: Restart Backend Server

After updating the `.env` file:
1. Stop the backend server (Ctrl+C)
2. Restart it: `cd backend && npm run dev`

### Step 4: Test Registration

1. Go to the frontend
2. Click on Register
3. Enter your Gmail address
4. Check your Gmail inbox for the OTP email
5. Enter the OTP to complete registration

### Troubleshooting

**If emails don't arrive:**
1. Check spam/junk folder
2. Verify `EMAIL_ENABLED=true` in `.env`
3. Verify the app password is correct (16 characters, no spaces)
4. Check backend console for error messages
5. Make sure 2-Step Verification is enabled on your Google account

**Common Errors:**
- "Invalid login": App password is incorrect
- "Less secure app access": Use App Password, not regular password
- "Connection timeout": Check internet connection

### Security Note

- Never commit `.env` file to git
- App passwords are safer than regular passwords
- Each app should have its own app password

