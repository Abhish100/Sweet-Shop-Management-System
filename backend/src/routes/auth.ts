import { Router } from 'express'
import { initiateRegister, verifyOtp, login } from '../controllers/authController'

export const authRouter = Router()

authRouter.post('/register/initiate', initiateRegister)
authRouter.post('/register/verify', verifyOtp)
authRouter.post('/login', login)
