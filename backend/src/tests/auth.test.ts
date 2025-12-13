import request from 'supertest'
import app from '../app'
import prisma from '../repositories/prismaClient'

beforeAll(async () => {
  // ensure DB is clean
  await prisma.sweet.deleteMany().catch(() => {})
  await prisma.user.deleteMany().catch(() => {})
})
// Note: Do not disconnect Prisma here — keeps client stable across tests

describe('Auth API', () => {
  it('registers and logs in', async () => {
    const email = 'alice@example.com'
    const password = 'password123'
    const r = await request(app).post('/api/auth/register').send({ email, password })
    expect(r.status).toBe(201)
    const l = await request(app).post('/api/auth/login').send({ email, password })
    expect(l.status).toBe(200)
    expect(l.body.token).toBeDefined()
  })
  it('fails login with wrong credentials', async () => {
    const l = await request(app).post('/api/auth/login').send({ email: 'notfound@example.com', password: 'x' })
    expect(l.status).toBe(401)
  })
})
