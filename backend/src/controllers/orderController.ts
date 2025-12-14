import { Response } from 'express'
import { createOrderService, getUserOrdersService } from '../services/orderService'
import { AppError } from '../utils/errors'
import type { AuthRequest } from '../types'
import type { CreateOrderData } from '../types'

export async function createOrderController(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const { items, deliveryAddress } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Items array is required and cannot be empty' })
      return
    }

    if (!deliveryAddress) {
      res.status(400).json({ error: 'Delivery address is required' })
      return
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    const orderData: CreateOrderData = {
      userId: req.user.id,
      items: items.map((item: any) => ({
        sweetId: item.id,
        quantity: item.cartQuantity || item.quantity,
        price: item.price,
      })),
      totalAmount,
      deliveryAddress,
    }

    const order = await createOrderService(orderData)
    res.status(201).json(order)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      console.error('Create order error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export async function getUserOrdersController(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const orders = await getUserOrdersService(req.user.id)
    res.json(orders)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      console.error('Get user orders error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

