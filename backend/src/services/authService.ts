import { createUser, findUserByEmail } from '../repositories/userRepository'
import { hashPassword, comparePassword } from '../utils/hash'
import { signToken } from '../utils/jwt'

export async function register(email: string, password: string) {
  const existing = await findUserByEmail(email)
  if (existing) throw new Error('User already exists')
  const pw = await hashPassword(password)
  const user = await createUser({ email, password: pw })
  return { id: user.id, email: user.email }
}

export async function login(email: string, password: string) {
  console.log('authService.login: called', email)
  const user = await findUserByEmail(email)
  console.log('authService.login: findUserByEmail returned', !!user)
  if (!user) throw new Error('Invalid credentials')
  console.log('authService.login: comparing password')
  const ok = await comparePassword(password, user.password)
  console.log('authService.login: comparePassword result', ok)
  if (!ok) throw new Error('Invalid credentials')
  const token = signToken({ sub: user.id, role: user.role })
  console.log('authService.login: signToken OK')
  return { token, user: { id: user.id, email: user.email, role: user.role } }
}
