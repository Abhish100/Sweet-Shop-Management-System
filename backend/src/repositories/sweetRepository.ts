import prisma from './prismaClient'
import type { Sweet, Prisma } from '@prisma/client'

export interface CreateSweetData {
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
}

export interface UpdateSweetData {
  name?: string
  category?: string
  price?: number
  quantity?: number
  description?: string
  imageUrl?: string
}

export interface SearchSweetsParams {
  name?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}

export async function createSweet(data: CreateSweetData): Promise<Sweet> {
  return prisma.sweet.create({ data })
}

export async function getSweets(): Promise<Sweet[]> {
  return prisma.sweet.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function findSweetById(id: string): Promise<Sweet | null> {
  return prisma.sweet.findUnique({ where: { id } })
}

export async function updateSweet(id: string, data: UpdateSweetData): Promise<Sweet> {
  return prisma.sweet.update({ where: { id }, data })
}

export async function deleteSweet(id: string): Promise<Sweet> {
  return prisma.sweet.delete({ where: { id } })
}

export async function searchSweets(query: SearchSweetsParams): Promise<Sweet[]> {
  const where: Prisma.SweetWhereInput = {}

  if (query.name) {
    // SQLite doesn't support case-insensitive mode, so we'll use contains
    where.name = { contains: query.name }
  }

  if (query.category) {
    // SQLite doesn't support case-insensitive mode, so we'll use contains
    where.category = { contains: query.category }
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {}
    if (query.minPrice !== undefined) {
      where.price.gte = query.minPrice
    }
    if (query.maxPrice !== undefined) {
      where.price.lte = query.maxPrice
    }
  }

  return prisma.sweet.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}
