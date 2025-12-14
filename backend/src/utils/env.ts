import 'dotenv/config'

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET']

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  // Validate email configuration if EMAIL_ENABLED is true
  if (process.env.EMAIL_ENABLED === 'true') {
    const emailRequired = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM']
    const missingEmail = emailRequired.filter((key) => !process.env[key])
    if (missingEmail.length > 0) {
      console.warn(`⚠️  Email enabled but missing configuration: ${missingEmail.join(', ')}`)
      console.warn('   Email service will fall back to console logging')
    }
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Email configuration
  EMAIL_ENABLED: process.env.EMAIL_ENABLED === 'true',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@abhisheksweets.in',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE, // Optional: 'gmail', 'sendgrid', etc.
  // Gemini API
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
}

