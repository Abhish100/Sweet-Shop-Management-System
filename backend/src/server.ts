import app from './app'
import { env } from './utils/env'
import { verifyEmailConfig } from './services/emailService'

// Vercel serverless function handler
export default app

// For local development
if (require.main === module) {
  const port = parseInt(env.PORT, 10)

  app.listen(port, async () => {
    console.log(`Server started on port ${port}`)
    console.log(`Environment: ${env.NODE_ENV}`)
    
    // Verify email configuration on startup
    if (env.EMAIL_ENABLED) {
      await verifyEmailConfig()
    } else {
      console.log('📧 Email service disabled - OTPs will be logged to console')
    }
  })
}
