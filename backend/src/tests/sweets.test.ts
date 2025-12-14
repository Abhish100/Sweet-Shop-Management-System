import request from 'supertest'
import app from '../app'
import prisma from '../repositories/prismaClient'

let token: string

beforeAll(async () => {
  await prisma.sweet.deleteMany().catch(() => {})
  await prisma.user.deleteMany().catch(() => {})

  // Create admin user
  const initiateResponse = await request(app)
    .post('/api/auth/register/initiate')
    .send({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
    })

  const otp = initiateResponse.body.otp

  await request(app)
    .post('/api/auth/register/verify')
    .send({
      email: 'admin@example.com',
      otp,
      username: 'admin',
      password: 'password123',
    })

  // Upgrade to admin
  await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: { role: 'ADMIN' },
  })

  // Login to get token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ identifier: 'admin@example.com', password: 'password123' })

  token = loginResponse.body.token
})
// Do not disconnect Prisma here — keep client alive across tests

describe('Sweets CRUD', () => {
  it('adds a sweet (admin)', async () => {
    const response = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ladoo', category: 'Indian', price: 1.5, quantity: 10 })

    expect(response.status).toBe(201)
    expect(response.body.name).toBe('Ladoo')
    expect(response.body.category).toBe('Indian')
    expect(response.body.price).toBe(1.5)
    expect(response.body.quantity).toBe(10)
  })

  it('lists sweets', async () => {
    const response = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('searches sweets by name', async () => {
    const response = await request(app)
      .get('/api/sweets/search')
      .query({ name: 'lado' })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0].name.toLowerCase()).toContain('lado')
  })

  it('updates a sweet', async () => {
    const createResponse = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Sweet', category: 'Test', price: 2.0, quantity: 5 })

    const sweetId = createResponse.body.id

    const updateResponse = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 3.0, quantity: 8 })

    expect(updateResponse.status).toBe(200)
    expect(updateResponse.body.price).toBe(3.0)
    expect(updateResponse.body.quantity).toBe(8)
  })

  it('purchases a sweet', async () => {
    const createResponse = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Purchase Test', category: 'Test', price: 1.0, quantity: 5 })

    const sweetId = createResponse.body.id
    const initialQuantity = createResponse.body.quantity

    const purchaseResponse = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${token}`)

    expect(purchaseResponse.status).toBe(200)
    expect(purchaseResponse.body.quantity).toBe(initialQuantity - 1)
  })

  it('restocks a sweet', async () => {
    const createResponse = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Restock Test', category: 'Test', price: 1.0, quantity: 5 })

    const sweetId = createResponse.body.id
    const initialQuantity = createResponse.body.quantity

    const restockResponse = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 10 })

    expect(restockResponse.status).toBe(200)
    expect(restockResponse.body.quantity).toBe(initialQuantity + 10)
  })

  it('deletes a sweet (admin only)', async () => {
    const createResponse = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Delete Test', category: 'Test', price: 1.0, quantity: 1 })

    const sweetId = createResponse.body.id

    const deleteResponse = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(deleteResponse.status).toBe(200)

    // Verify it's deleted
    const getResponse = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`)

    const deletedSweet = getResponse.body.find((s: { id: string }) => s.id === sweetId)
    expect(deletedSweet).toBeUndefined()
  })
})
