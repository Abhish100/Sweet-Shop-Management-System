import { createUser, findUserByEmail, findUserByUsername, findUserByUsernameOrEmail } from '../repositories/userRepository'
import { createOtp, findOtpByEmail, deleteOtp } from '../repositories/otpRepository'
import { hashPassword, comparePassword } from '../utils/hash'
import { signToken } from '../utils/jwt'
import { sendOtpEmail, generateOtp } from './emailService'
import { ValidationError, UnauthorizedError } from '../utils/errors'
import type { LoginResponse, UserResponse, InitiateRegisterResponse } from '../types'

// Helper to normalize email (lowercase and trim)
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export async function initiateRegister(username: string, email: string, password: string): Promise<InitiateRegisterResponse> {
  // Normalize email (lowercase for case-insensitive uniqueness)
  const normalizedEmail = normalizeEmail(email)
  
  // Check if username already exists
  const existingUsername = await findUserByUsername(username.trim())
  if (existingUsername) {
    throw new ValidationError('Username already exists. Please choose a different username.')
  }

  // Check if email already exists (case-insensitive)
  const existingEmail = await findUserByEmail(normalizedEmail)
  if (existingEmail) {
    throw new ValidationError('Email address is already registered. Please use a different email or try logging in.')
  }

  // Generate and store OTP (use normalized email)
  const otp = generateOtp()
  await createOtp(normalizedEmail, otp)

  // Send OTP email (use original email for display, but store normalized)
  try {
    await sendOtpEmail(normalizedEmail, otp)
  } catch (emailError: any) {
    // If email fails, still allow registration to continue
    console.error('⚠️  Email notification failed:', emailError.message)
    console.log(`📧 OTP for testing: ${otp}`)
  }

  return {
    message: `OTP sent to ${normalizedEmail}. Check your email or console for OTP.`,
    otp // Return OTP for demo purposes (development only)
  }
}

export async function verifyOtpAndRegister(email: string, otp: string, username: string, password: string): Promise<LoginResponse> {
  // Normalize email (lowercase for case-insensitive uniqueness)
  const normalizedEmail = normalizeEmail(email)
  
  // Find OTP record (use normalized email)
  const otpRecord = await findOtpByEmail(normalizedEmail)
  if (!otpRecord) {
    throw new ValidationError('No pending registration found for this email')
  }

  // Check if OTP matches
  if (otpRecord.otp !== otp) {
    throw new ValidationError('Invalid OTP. Please check and try again.')
  }

  // Check if OTP expired
  if (new Date() > otpRecord.expiresAt) {
    await deleteOtp(otpRecord.id)
    throw new ValidationError('OTP expired. Please register again.')
  }
  
  // Verify username and email still available
  const existingUsername = await findUserByUsername(username.trim())
  if (existingUsername) {
    throw new ValidationError('Username already exists. Please choose a different username.')
  }

  const existingEmail = await findUserByEmail(normalizedEmail)
  if (existingEmail) {
    throw new ValidationError('Email address is already registered. Please use a different email or try logging in.')
  }

  // Create user with normalized email
  try {
    const hashedPassword = await hashPassword(password)
    const user = await createUser({ 
      username: username.trim(), 
      email: normalizedEmail, 
      password: hashedPassword 
    })

    // Delete OTP record
    await deleteOtp(otpRecord.id)

    // Generate token and return
    const token = signToken({ sub: user.id, role: user.role })

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error: any) {
    // Handle database constraint violations (double-check)
    if (error.message?.includes('already registered') || error.message?.includes('already taken')) {
      throw new ValidationError(error.message)
    }
    // Re-throw other errors
    throw error
  }
}

export async function login(identifier: string, password: string): Promise<LoginResponse> {
  // Normalize identifier if it looks like an email
  const normalizedIdentifier = identifier.includes('@') 
    ? identifier.toLowerCase().trim() 
    : identifier.trim()
  
  const user = await findUserByUsernameOrEmail(normalizedIdentifier)
  if (!user) {
    throw new UnauthorizedError('Invalid username/email or password')
  }

  const isPasswordValid = await comparePassword(password, user.password)
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid username/email or password')
  }

  const token = signToken({ sub: user.id, role: user.role })

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  }
}
