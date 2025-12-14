import nodemailer from 'nodemailer'
import { env } from '../utils/env'

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (!env.EMAIL_ENABLED) {
    return null
  }

  // If transporter already created, return it
  if (transporter) {
    return transporter
  }

  try {
    // Configure transporter based on email service
    if (env.EMAIL_SERVICE === 'gmail' || env.EMAIL_HOST === 'smtp.gmail.com') {
      // Gmail configuration
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      })
    } else if (env.EMAIL_SERVICE === 'sendgrid') {
      // SendGrid configuration
      transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: env.EMAIL_PASS, // SendGrid API key
        },
      })
    } else {
      // Generic SMTP configuration
      transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        secure: env.EMAIL_SECURE, // true for 465, false for other ports
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
        // For development/testing with self-signed certificates
        tls: {
          rejectUnauthorized: env.NODE_ENV === 'production',
        },
      })
    }

    return transporter
  } catch (error) {
    console.error('Failed to create email transporter:', error)
    return null
  }
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  // Check if email is enabled
  if (!env.EMAIL_ENABLED) {
    console.log(`\n📬 [EMAIL DISABLED - DEVELOPMENT MODE]`)
    console.log(`   Email: ${email}`)
    console.log(`   OTP: ${otp}`)
    console.log(`   ℹ️  Email service is disabled. To enable email, set EMAIL_ENABLED=true in .env\n`)
    return // Allow registration to proceed without email
  }

  const transporterInstance = getTransporter()

  // If transporter failed to create, allow to proceed with OTP logged to console
  if (!transporterInstance) {
    console.error('❌ Failed to create email transporter. Check email configuration.')
    console.log(`\n📬 [EMAIL DELIVERY FAILED - FALLBACK TO CONSOLE]`)
    console.log(`   Email: ${email}`)
    console.log(`   OTP: ${otp}\n`)
    return // Allow registration to proceed
  }

  try {
    const mailOptions = {
      from: `"Abhishek Sweets" <${env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your OTP for Abhishek Sweets Registration',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #fff;
                border: 2px solid #6B1318;
                border-radius: 10px;
                padding: 30px;
                text-align: center;
              }
              .header {
                color: #6B1318;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
              }
              .otp-box {
                background-color: #FFFDD0;
                border: 3px dashed #6B1318;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #6B1318;
                font-family: 'Courier New', monospace;
              }
              .message {
                color: #666;
                font-size: 14px;
                margin: 20px 0;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #999;
              }
              .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 10px;
                margin: 20px 0;
                font-size: 12px;
                color: #856404;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">🍬 Abhishek Sweets 🍬</div>
              <h2>Email Verification Code</h2>
              <p class="message">Thank you for registering with Abhishek Sweets!</p>
              <p class="message">Please use the following One-Time Password (OTP) to complete your registration:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p class="message">This code will expire in <strong>10 minutes</strong>.</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this code with anyone. Abhishek Sweets will never ask for your OTP.
              </div>
              
              <div class="footer">
                <p>If you didn't request this code, please ignore this email.</p>
                <p>© ${new Date().getFullYear()} Abhishek Sweets. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Abhishek Sweets - Email Verification
        
        Thank you for registering with Abhishek Sweets!
        
        Your One-Time Password (OTP) is: ${otp}
        
        This code will expire in 10 minutes.
        
        If you didn't request this code, please ignore this email.
        
        © ${new Date().getFullYear()} Abhishek Sweets. All rights reserved.
      `,
    }

    const info = await transporterInstance.sendMail(mailOptions)
    console.log(`✅ Email sent successfully to ${email}`)
    console.log(`   Message ID: ${info.messageId}`)
    console.log(`   OTP: ${otp} (also sent via email)`)
  } catch (error: any) {
    console.error(`❌ Failed to send email to ${email}:`, error)
    // Re-throw with a helpful message
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check EMAIL_USER and EMAIL_PASS in backend/.env file. See GMAIL_OTP_SETUP.md or QUICK_EMAIL_SETUP.md for setup instructions.')
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to email server. Please check EMAIL_HOST and EMAIL_PORT in backend/.env file.')
    } else {
      throw new Error(`Failed to send email: ${error.message || 'Unknown error'}. Please check your email configuration.`)
    }
  }
}

export function generateOtp(): string {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  if (!env.EMAIL_ENABLED) {
    console.log('📧 Email service is disabled (EMAIL_ENABLED=false)')
    return false
  }

  const transporterInstance = getTransporter()
  if (!transporterInstance) {
    console.log('📧 Email transporter not available')
    return false
  }

  try {
    await transporterInstance.verify()
    console.log('✅ Email configuration verified successfully')
    return true
  } catch (error) {
    console.error('❌ Email configuration verification failed:', error)
    return false
  }
}
