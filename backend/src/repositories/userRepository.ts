import prisma from './prismaClient'
import type { User } from '@prisma/client'

export async function createUser(data: { email: string, password: string, role?: 'ADMIN' | 'USER' }): Promise<User> {
  return prisma.user.create({ data })
}
export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } })
}
export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } })
}
