import { z } from 'zod'
import { ValidationError } from './errors'

export const initiateRegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim()
    .refine((email) => {
      // Additional email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }, 'Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
})

export const verifyOtpSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only digits'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
})

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required').trim(),
  password: z.string().min(1, 'Password is required'),
})

export const createSweetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export const updateSweetSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().min(0).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export const searchSweetsSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
})

export const restockSchema = z.object({
  amount: z.number().int().positive('Amount must be a positive integer'),
})

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new ValidationError(messages)
    }
    throw new ValidationError('Validation failed')
  }
}

