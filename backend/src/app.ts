import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { authRouter } from './routes/auth'
import { sweetsRouter } from './routes/sweets'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/sweets', sweetsRouter)

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message })
})

export default app
