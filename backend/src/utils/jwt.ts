import jwt from 'jsonwebtoken'
import { env } from './env'

export interface JWTPayload {
  sub: string
  role: string
  iat?: number
  exp?: number
}

export function signToken(payload: { sub: string; role: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}
