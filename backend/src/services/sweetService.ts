import * as repo from '../repositories/sweetRepository'
import { NotFoundError, ValidationError } from '../utils/errors'
import type { CreateSweetRequest, UpdateSweetRequest, SearchSweetsQuery } from '../types'

export async function addSweet(data: CreateSweetRequest) {
  return repo.createSweet(data)
}

export async function listSweets() {
  return repo.getSweets()
}

export async function searchSweets(query: SearchSweetsQuery) {
  const searchParams: {
    name?: string
    category?: string
    minPrice?: number
    maxPrice?: number
  } = {}

  if (query.name) searchParams.name = query.name
  if (query.category) searchParams.category = query.category
  if (query.minPrice !== undefined) searchParams.minPrice = query.minPrice
  if (query.maxPrice !== undefined) searchParams.maxPrice = query.maxPrice

  return repo.searchSweets(searchParams)
}

export async function updateSweet(id: string, data: UpdateSweetRequest) {
  const existing = await repo.findSweetById(id)
  if (!existing) {
    throw new NotFoundError('Sweet')
  }

  return repo.updateSweet(id, data)
}

export async function deleteSweet(id: string) {
  const existing = await repo.findSweetById(id)
  if (!existing) {
    throw new NotFoundError('Sweet')
  }

  return repo.deleteSweet(id)
}

export async function purchase(id: string) {
  const sweet = await repo.findSweetById(id)
  if (!sweet) {
    throw new NotFoundError('Sweet')
  }

  if (sweet.quantity <= 0) {
    throw new ValidationError('Sweet is out of stock')
  }

  return repo.updateSweet(id, { quantity: sweet.quantity - 1 })
}

export async function restock(id: string, amount: number) {
  if (amount <= 0) {
    throw new ValidationError('Restock amount must be positive')
  }

  const sweet = await repo.findSweetById(id)
  if (!sweet) {
    throw new NotFoundError('Sweet')
  }

  return repo.updateSweet(id, { quantity: sweet.quantity + amount })
}

export async function updateSweetImage(id: string, imageUrl: string) {
  const sweet = await repo.findSweetById(id)
  if (!sweet) {
    throw new NotFoundError('Sweet')
  }

  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new ValidationError('Valid imageUrl is required')
  }

  return repo.updateSweet(id, { imageUrl })
}
