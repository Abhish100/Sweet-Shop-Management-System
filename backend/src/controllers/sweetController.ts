import { Response } from 'express'
import * as sweetService from '../services/sweetService'
import { validate } from '../utils/validation'
import {
  createSweetSchema,
  updateSweetSchema,
  searchSweetsSchema,
  restockSchema,
} from '../utils/validation'
import { AppError } from '../utils/errors'
import type { AuthRequest } from '../types'

export async function addSweet(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validatedData = validate(createSweetSchema, req.body)
    const sweet = await sweetService.addSweet(validatedData)
    res.status(201).json(sweet)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export async function listSweets(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const sweets = await sweetService.listSweets()
    res.json(sweets)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function searchSweets(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validatedQuery = validate(searchSweetsSchema, req.query)
    const sweets = await sweetService.searchSweets(validatedQuery)
    res.json(sweets)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export async function updateSweet(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validatedData = validate(updateSweetSchema, req.body)
    const sweet = await sweetService.updateSweet(req.params.id, validatedData)
    res.json(sweet)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export async function deleteSweet(req: AuthRequest, res: Response): Promise<void> {
  try {
    const sweet = await sweetService.deleteSweet(req.params.id)
    res.json(sweet)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export async function purchaseSweet(req: AuthRequest, res: Response): Promise<void> {
  try {
    const sweet = await sweetService.purchase(req.params.id)
    res.json(sweet)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export async function restockSweet(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validatedData = validate(restockSchema, req.body)
    const sweet = await sweetService.restock(req.params.id, validatedData.amount)
    res.json(sweet)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export async function updateSweetImage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const { imageUrl } = req.body

    if (!imageUrl) {
      res.status(400).json({ error: 'imageUrl is required' })
      return
    }

    const sweet = await sweetService.updateSweetImage(id, imageUrl)
    res.json(sweet)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
