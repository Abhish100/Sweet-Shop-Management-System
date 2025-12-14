import prisma from './prismaClient'
import { Order, OrderItem } from '@prisma/client'
import type { CreateOrderData, CreateOrderItemData } from '../types'

export interface OrderWithItems extends Order {
  items: OrderItem[]
}

export async function createOrder(data: CreateOrderData): Promise<OrderWithItems> {
  return await prisma.$transaction(async (tx) => {
    // Create order
    const order = await tx.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        status: data.status || 'Processing',
        deliveryAddress: JSON.stringify(data.deliveryAddress),
      },
    })

    // Create order items
    const orderItems = await Promise.all(
      data.items.map((item) =>
        tx.orderItem.create({
          data: {
            orderId: order.id,
            sweetId: item.sweetId,
            quantity: item.quantity,
            price: item.price,
          },
        })
      )
    )

    // Reduce stock for each item
    for (const item of data.items) {
      const sweet = await tx.sweet.findUnique({
        where: { id: item.sweetId },
      })

      if (!sweet) {
        throw new Error(`Sweet with id ${item.sweetId} not found`)
      }

      if (sweet.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${sweet.name}. Available: ${sweet.quantity}, Requested: ${item.quantity}`
        )
      }

      await tx.sweet.update({
        where: { id: item.sweetId },
        data: { quantity: sweet.quantity - item.quantity },
      })
    }

    return {
      ...order,
      items: orderItems,
    }
  })
}

export async function findOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  return orders as OrderWithItems[]
}

export async function findOrderById(id: string): Promise<OrderWithItems | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) return null

  return order as OrderWithItems
}

