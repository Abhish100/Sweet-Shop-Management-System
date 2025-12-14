import prisma from './prismaClient'
import type { User } from '@prisma/client'

export interface CreateUserData {
  username: string
  email: string
  password: string
  role?: 'ADMIN' | 'USER'
}

export async function findUserByUsername(username: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { username } })
}

export async function findUserByUsernameOrEmail(identifier: string): Promise<User | null> {
  // Normalize identifier if it looks like an email
  const normalizedIdentifier = identifier.includes('@') 
    ? identifier.toLowerCase().trim() 
    : identifier.trim()
  
  return prisma.user.findFirst({
    where: {
      OR: [
        { username: normalizedIdentifier },
        { email: normalizedIdentifier }
      ]
    }
  })
}

export async function createUser(data: CreateUserData): Promise<User> {
  // Normalize email before creating user
  const normalizedData = {
    ...data,
    email: data.email.toLowerCase().trim()
  }
  
  try {
    return await prisma.user.create({ data: normalizedData })
  } catch (error: any) {
    // Handle database constraint violations
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('email')) {
        throw new Error('Email address is already registered')
      }
      if (error.meta?.target?.includes('username')) {
        throw new Error('Username is already taken')
      }
    }
    throw error
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  // Normalize email to lowercase for case-insensitive lookup
  const normalizedEmail = email.toLowerCase().trim()
  return prisma.user.findUnique({ where: { email: normalizedEmail } })
}

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } })
}
