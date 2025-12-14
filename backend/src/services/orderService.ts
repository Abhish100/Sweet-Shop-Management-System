import { createOrder, findOrdersByUserId, findOrderById } from '../repositories/orderRepository'
import { findSweetById } from '../repositories/sweetRepository'
import { ValidationError, NotFoundError } from '../utils/errors'
import type { CreateOrderData, OrderResponse } from '../types'

export async function createOrderService(data: CreateOrderData): Promise<OrderResponse> {
  // Validate all items exist and have sufficient stock
  for (const item of data.items) {
    const sweet = await findSweetById(item.sweetId)
    if (!sweet) {
      throw new NotFoundError(`Sweet with id ${item.sweetId}`)
    }
    if (sweet.quantity < item.quantity) {
      throw new ValidationError(
        `Insufficient stock for ${sweet.name}. Available: ${sweet.quantity}, Requested: ${item.quantity}`
      )
    }
  }

  // Create order (this will reduce stock in a transaction)
  const order = await createOrder(data)

  // Transform to response format
  return {
    id: order.id,
    userId: order.userId,
    totalAmount: order.totalAmount,
    status: order.status,
    deliveryAddress: JSON.parse(order.deliveryAddress as string),
    items: order.items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      sweetId: item.sweetId,
      quantity: item.quantity,
      price: item.price,
      createdAt: item.createdAt.toISOString(),
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }
}

export async function getUserOrdersService(userId: string): Promise<OrderResponse[]> {
  const orders = await findOrdersByUserId(userId)
  
  return orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    totalAmount: order.totalAmount,
    status: order.status,
    deliveryAddress: JSON.parse(order.deliveryAddress as string),
    items: order.items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      sweetId: item.sweetId,
      quantity: item.quantity,
      price: item.price,
      createdAt: item.createdAt.toISOString(),
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }))
}

