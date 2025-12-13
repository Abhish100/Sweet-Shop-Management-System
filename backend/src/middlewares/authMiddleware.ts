import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { findUserById } from '../repositories/userRepository'

export async function requireAuth(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = auth.split(' ')[1]
  try {
    const payload: any = verifyToken(token)
    const user = await findUserById(payload.sub)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    req.user = { id: user.id, role: user.role }
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
export function requireAdmin(req: Request & { user?: any }, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })
  return next()
}
