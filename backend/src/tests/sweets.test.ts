import request from 'supertest'
import app from '../app'
import prisma from '../repositories/prismaClient'

let token: string
beforeAll(async () => {
  console.log('sweets.test: beforeAll start')
  await prisma.sweet.deleteMany().catch(() => {})
  await prisma.user.deleteMany().catch(() => {})
  // create user
  console.log('sweets.test: registering user')
  const reg = await request(app).post('/api/auth/register').send({ email: 'admin@example.com', password: 'pass' })
  console.log('sweets.test: register response', reg.status, reg.body)
  // upgrade to admin
  console.log('sweets.test: created user, upgrading to admin')
  const upd = await prisma.user.update({ where: { email: 'admin@example.com' }, data: { role: 'ADMIN' } })
  console.log('sweets.test: update result', !!upd)
  console.log('sweets.test: login request')
  const r = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'pass' })
  console.log('sweets.test: login response', r.status, r.body)
  token = r.body.token
})
// Do not disconnect Prisma here — keep client alive across tests

describe('Sweets CRUD', () => {
  it('adds a sweet (admin)', async () => {
    const r = await request(app).post('/api/sweets').set('Authorization', `Bearer ${token}`).send({ name: 'Ladoo', category: 'Indian', price: 1.5, quantity: 10 })
    expect(r.status).toBe(201)
    expect(r.body.name).toBe('Ladoo')
  })
  it('lists sweets', async () => {
    const r = await request(app).get('/api/sweets').set('Authorization', `Bearer ${token}`)
    expect(r.status).toBe(200)
    expect(Array.isArray(r.body)).toBe(true)
  })
  it('searches sweets by name', async () => {
    const r = await request(app).get('/api/sweets/search').query({ name: 'lado' }).set('Authorization', `Bearer ${token}`)
    expect(r.status).toBe(200)
    expect(r.body.length).toBeGreaterThan(0)
  })
})
