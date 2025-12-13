import jwt from 'jsonwebtoken'
import 'dotenv/config'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
export function verifyToken<T = any>(token: string) {
  return jwt.verify(token, JWT_SECRET) as T
}
