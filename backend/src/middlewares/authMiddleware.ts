import { Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { findUserById } from '../repositories/userRepository'
import { UnauthorizedError, ForbiddenError } from '../utils/errors'
import type { AuthRequest } from '../types'

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header')
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyToken(token)
    const user = await findUserById(payload.sub)

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    req.user = { id: user.id, role: user.role }
    next()
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message })
    } else {
      res.status(401).json({ error: 'Invalid token' })
    }
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Admin access required' })
    return
  }

  next()
}
