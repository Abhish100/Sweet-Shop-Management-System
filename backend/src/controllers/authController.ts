import { Response } from 'express'
import * as authService from '../services/authService'
import { validate } from '../utils/validation'
import { initiateRegisterSchema, verifyOtpSchema, loginSchema } from '../utils/validation'
import { AppError } from '../utils/errors'
import type { AuthRequest } from '../types'

export async function initiateRegister(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validatedData = validate(initiateRegisterSchema, req.body)
    const result = await authService.initiateRegister(
      validatedData.username,
      validatedData.email,
      validatedData.password
    )
    res.json(result)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export async function verifyOtp(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validatedData = validate(verifyOtpSchema, req.body)
    const result = await authService.verifyOtpAndRegister(
      validatedData.email,
      validatedData.otp,
      validatedData.username,
      validatedData.password
    )
    res.status(201).json(result)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validatedData = validate(loginSchema, req.body)
    const result = await authService.login(validatedData.identifier, validatedData.password)
    res.json(result)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

