# Email Service Setup Guide

This guide provides step-by-step instructions for setting up email service for OTP delivery.

## Quick Start

### Enable Email Service

Add to your `backend/.env` file:

```env
EMAIL_ENABLED=true
```

Then configure one of the options below.

---

## Option 1: Gmail (Easiest for Development)

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and your device
3. Click "Generate"
4. Copy the 16-character password (no spaces)

### Step 3: Configure Backend
Add to `backend/.env`:

```env
EMAIL_ENABLED=true
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM=your-email@gmail.com
```

**Note**: Remove spaces from the app password when pasting.

---

## Option 2: SendGrid (Recommended for Production)

### Step 1: Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com) (free tier available)
2. Verify your email address

### Step 2: Create API Key
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name it (e.g., "Abhishek Sweets")
4. Select "Full Access" or "Restricted Access" with Mail Send permissions
5. Copy the API key (shown only once!)

### Step 3: Verify Sender
1. Go to Settings → Sender Authentication
2. Verify a Single Sender or set up Domain Authentication
3. Use the verified email as `EMAIL_FROM`

### Step 4: Configure Backend
Add to `backend/.env`:

```env
EMAIL_ENABLED=true
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASS=SG.your-sendgrid-api-key-here
EMAIL_FROM=verified-email@yourdomain.com
```

---

## Option 3: AWS SES (Amazon Simple Email Service)

### Step 1: Set Up AWS SES
1. Go to AWS Console → SES
2. Verify your email address or domain
3. Request production access if needed (for non-verified emails)

### Step 2: Create SMTP Credentials
1. Go to SES → SMTP Settings
2. Click "Create SMTP Credentials"
3. Save the username and password

### Step 3: Configure Backend
Add to `backend/.env`:

```env
EMAIL_ENABLED=true
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-smtp-username
EMAIL_PASS=your-ses-smtp-password
EMAIL_FROM=verified-email@yourdomain.com
```

**Note**: Replace `us-east-1` with your AWS region.

---

## Option 4: Custom SMTP Server

For any other SMTP provider (Outlook, Yahoo, custom server, etc.):

```env
EMAIL_ENABLED=true
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com
```

### Common SMTP Settings

| Provider | Host | Port | Secure |
|----------|------|------|--------|
| Gmail | smtp.gmail.com | 587 | false |
| Outlook | smtp-mail.outlook.com | 587 | false |
| Yahoo | smtp.mail.yahoo.com | 587 | false |
| Zoho | smtp.zoho.com | 587 | false |
| Custom | smtp.yourdomain.com | 587/465 | false/true |

**Note**: Port 465 requires `EMAIL_SECURE=true`, port 587 uses `EMAIL_SECURE=false`.

---

## Testing Your Configuration

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Check the console output:
   - ✅ `Email configuration verified successfully` - Working!
   - ❌ `Email configuration verification failed` - Check credentials
   - 📧 `Email service disabled` - Set `EMAIL_ENABLED=true`

3. Test registration:
   - Try registering a new user
   - Check your email inbox (and spam folder)
   - If email fails, OTP will be logged to console

---

## Troubleshooting

### Gmail Issues

**Error: "Invalid login"**
- Make sure you're using an App Password, not your regular password
- App passwords are 16 characters (no spaces)

**Error: "Less secure app"**
- Google no longer supports "less secure apps"
- Use App Passwords instead

### SendGrid Issues

**Error: "Authentication failed"**
- Make sure `EMAIL_USER=apikey` (literally the word "apikey")
- Verify your API key is correct
- Check that API key has "Mail Send" permissions

**Error: "Sender not verified"**
- Verify your sender email in SendGrid dashboard
- Use verified email as `EMAIL_FROM`

### General Issues

**Emails not sending**
- Check `EMAIL_ENABLED=true`
- Verify all email variables are set correctly
- Check server console for specific error messages
- Test SMTP settings with an email client first

**OTP still in console**
- Email service falls back to console if sending fails
- Check error messages in server console
- Verify email configuration is correct

**Emails going to spam**
- Set up SPF/DKIM records for your domain
- Use a verified sender email
- Consider using a professional email service (SendGrid, AWS SES)

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use App Passwords** for Gmail (not regular passwords)
3. **Rotate API keys** regularly
4. **Use environment variables** in production (not hardcoded)
5. **Enable 2FA** on email accounts used for sending
6. **Monitor email sending** for suspicious activity
7. **Use dedicated email service** (SendGrid, AWS SES) for production

---

## Production Recommendations

For production, use a dedicated email service:

1. **SendGrid** - Easy setup, free tier (100 emails/day)
2. **AWS SES** - Very cheap, scalable, requires AWS account
3. **Mailgun** - Developer-friendly, free tier available
4. **Postmark** - Great deliverability, paid service

All of these services provide:
- Better deliverability
- Email analytics
- Bounce/spam handling
- Higher sending limits
- Professional reputation

---

## Email Template Customization

The email template is in `backend/src/services/emailService.ts`. You can customize:
- HTML styling
- Email content
- Branding
- OTP display format

Look for the `mailOptions.html` section to modify the template.

