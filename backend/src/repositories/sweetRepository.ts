import prisma from './prismaClient'
import type { Sweet } from '@prisma/client'

export async function createSweet(data: { name: string, category: string, price: number, quantity: number }): Promise<Sweet> {
  return prisma.sweet.create({ data })
}
export async function getSweets(): Promise<Sweet[]> {
  return prisma.sweet.findMany()
}
export async function findSweetById(id: string): Promise<Sweet | null> {
  return prisma.sweet.findUnique({ where: { id } })
}
export async function updateSweet(id: string, data: Partial<Sweet>) {
  return prisma.sweet.update({ where: { id }, data })
}
export async function deleteSweet(id: string) {
  return prisma.sweet.delete({ where: { id } })
}
export async function searchSweets(query: { name?: string, category?: string, minPrice?: number, maxPrice?: number }) {
  const where: any = {}
  if (query.name) where.name = { contains: query.name, mode: 'insensitive' }
  if (query.category) where.category = { contains: query.category, mode: 'insensitive' }
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {}
    if (query.minPrice !== undefined) where.price.gte = query.minPrice
    if (query.maxPrice !== undefined) where.price.lte = query.maxPrice
  }
  return prisma.sweet.findMany({ where })
}
