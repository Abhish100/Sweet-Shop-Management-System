import { Request, Response } from 'express'
import * as authService from '../services/authService'

export async function register(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    console.log('authController.register: called', email)
    const u = await authService.register(email, password)
    console.log('authController.register: created user', u.email)
    res.status(201).json(u)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    console.log('authController.login: called', email)
    const out = await authService.login(email, password)
    console.log('authController.login: service returned', out ? 'ok' : 'no')
    res.json(out)
  } catch (err: any) {
    res.status(401).json({ error: err.message })
  }
}

