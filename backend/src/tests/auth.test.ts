import request from 'supertest'
import app from '../app'
import prisma from '../repositories/prismaClient'

beforeAll(async () => {
  // Ensure DB is clean
  await prisma.sweet.deleteMany().catch(() => {})
  await prisma.user.deleteMany().catch(() => {})
})

describe('Auth API', () => {
  it('registers a new user', async () => {
    const username = 'alice'
    const email = 'alice@example.com'
    const password = 'password123'

    // Initiate registration
    const initiateResponse = await request(app)
      .post('/api/auth/register/initiate')
      .send({ username, email, password })

    expect(initiateResponse.status).toBe(200)
    expect(initiateResponse.body.otp).toBeDefined()

    const otp = initiateResponse.body.otp

    // Verify OTP and complete registration
    const verifyResponse = await request(app)
      .post('/api/auth/register/verify')
      .send({ email, otp, username, password })

    expect(verifyResponse.status).toBe(201)
    expect(verifyResponse.body.user.email).toBe(email)
    expect(verifyResponse.body.user.id).toBeDefined()
    expect(verifyResponse.body.user.password).toBeUndefined()
    expect(verifyResponse.body.token).toBeDefined()
  })

  it('fails registration with duplicate email', async () => {
    const username = 'duplicate'
    const email = 'duplicate@example.com'
    const password = 'password123'

    // First registration
    const initiateResponse1 = await request(app)
      .post('/api/auth/register/initiate')
      .send({ username, email, password })

    expect(initiateResponse1.status).toBe(200)
    const otp1 = initiateResponse1.body.otp

    await request(app)
      .post('/api/auth/register/verify')
      .send({ email, otp: otp1, username, password })

    // Try to register again with same email
    const initiateResponse2 = await request(app)
      .post('/api/auth/register/initiate')
      .send({ username: 'different', email, password })

    expect(initiateResponse2.status).toBe(400)
    expect(initiateResponse2.body.error).toContain('already registered')
  })

  it('fails registration with invalid email', async () => {
    const username = 'testuser'
    const email = 'invalid-email'
    const password = 'password123'

    const response = await request(app)
      .post('/api/auth/register/initiate')
      .send({ username, email, password })

    expect(response.status).toBe(400)
    expect(response.body.error).toBeDefined()
  })

  it('fails registration with short password', async () => {
    const username = 'testuser2'
    const email = 'test@example.com'
    const password = '12345'

    const response = await request(app)
      .post('/api/auth/register/initiate')
      .send({ username, email, password })

    expect(response.status).toBe(400)
    expect(response.body.error).toBeDefined()
  })

  it('logs in with valid credentials', async () => {
    const username = 'bob'
    const email = 'bob@example.com'
    const password = 'password123'

    // Register first
    const initiateResponse = await request(app)
      .post('/api/auth/register/initiate')
      .send({ username, email, password })

    const otp = initiateResponse.body.otp

    await request(app)
      .post('/api/auth/register/verify')
      .send({ email, otp, username, password })

    // Now login
    const response = await request(app)
      .post('/api/auth/login')
      .send({ identifier: email, password })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
    expect(response.body.user).toBeDefined()
    expect(response.body.user.email).toBe(email)
    expect(response.body.user.id).toBeDefined()
  })

  it('fails login with wrong email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'notfound@example.com', password: 'password123' })

    expect(response.status).toBe(401)
    expect(response.body.error).toBeDefined()
  })

  it('fails login with wrong password', async () => {
    const username = 'charlie'
    const email = 'charlie@example.com'
    const password = 'password123'

    // Register first
    const initiateResponse = await request(app)
      .post('/api/auth/register/initiate')
      .send({ username, email, password })

    const otp = initiateResponse.body.otp

    await request(app)
      .post('/api/auth/register/verify')
      .send({ email, otp, username, password })

    // Try login with wrong password
    const response = await request(app)
      .post('/api/auth/login')
      .send({ identifier: email, password: 'wrongpassword' })

    expect(response.status).toBe(401)
    expect(response.body.error).toBeDefined()
  })
})
