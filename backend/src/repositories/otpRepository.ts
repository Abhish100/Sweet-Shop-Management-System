import prisma from './prismaClient'
import type { OtpVerification } from '@prisma/client'

export async function createOtp(email: string, otp: string): Promise<OtpVerification> {
  // OTP expires in 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
  
  // Delete any existing OTPs for this email
  await prisma.otpVerification.deleteMany({
    where: { email }
  })
  
  return prisma.otpVerification.create({
    data: {
      email,
      otp,
      expiresAt
    }
  })
}

export async function findOtpByEmail(email: string): Promise<OtpVerification | null> {
  return prisma.otpVerification.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' }
  })
}

export async function deleteOtp(id: string): Promise<void> {
  await prisma.otpVerification.delete({
    where: { id }
  })
}

export async function cleanupExpiredOtps(): Promise<void> {
  await prisma.otpVerification.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
}

