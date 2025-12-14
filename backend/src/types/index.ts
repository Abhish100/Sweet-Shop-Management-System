import { Request } from 'express'
import { User, Sweet } from '@prisma/client'

export interface AuthRequest extends Request {
  user?: {
    id: string
    role: string
  }
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface InitiateRegisterRequest {
  username: string
  email: string
  password: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface LoginRequest {
  identifier: string // username or email
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
    role: string
  }
}

export interface CreateSweetRequest {
  name: string
  category: string
  price: number
  quantity: number
}

export interface UpdateSweetRequest {
  name?: string
  category?: string
  price?: number
  quantity?: number
}

export interface SearchSweetsQuery {
  name?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}

export interface RestockRequest {
  amount: number
}

export type UserResponse = Omit<User, 'password'>

export interface InitiateRegisterResponse {
  message: string
  otp: string // For demo purposes, return OTP in response
}
export type SweetResponse = Sweet

export interface Address {
  id?: string
  label: string
  street: string
  city: string
  state: string
  zip: string
}

export interface CreateOrderItemData {
  sweetId: string
  quantity: number
  price: number
}

export interface CreateOrderData {
  userId: string
  items: CreateOrderItemData[]
  totalAmount: number
  status?: string
  deliveryAddress: Address
}

export interface OrderResponse {
  id: string
  userId: string
  totalAmount: number
  status: string
  deliveryAddress: Address
  items: OrderItemResponse[]
  createdAt: string
  updatedAt: string
}

export interface OrderItemResponse {
  id: string
  orderId: string
  sweetId: string
  quantity: number
  price: number
  createdAt: string
}

