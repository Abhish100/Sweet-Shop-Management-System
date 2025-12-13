import prisma from '../repositories/prismaClient'

export default async function globalTeardown() {
  try {
    await prisma.$disconnect()
    console.log('globalTeardown: prisma disconnected')
  } catch (err) {
    console.warn('globalTeardown: prisma disconnect failed', err)
  }
}
