import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { validateEnv } from './utils/env'
import { AppError } from './utils/errors'
import { authRouter } from './routes/auth'
import { sweetsRouter } from './routes/sweets'
import { imagesRouter } from './routes/images'
import { ordersRouter } from './routes/orders'

// Validate environment variables on startup
validateEnv()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/sweets', sweetsRouter)
app.use('/api/images', imagesRouter)
app.use('/api/orders', ordersRouter)

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
  } else {
    console.error('Unexpected error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default app
