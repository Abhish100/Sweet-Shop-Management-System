import { Router } from 'express'
import { createOrderController, getUserOrdersController } from '../controllers/orderController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

// All order routes require authentication
router.post('/', requireAuth, createOrderController)
router.get('/', requireAuth, getUserOrdersController)

export { router as ordersRouter }

