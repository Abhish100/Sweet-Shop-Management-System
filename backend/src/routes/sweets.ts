import { Router } from 'express'
import * as ctrl from '../controllers/sweetController'
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware'

export const sweetsRouter = Router()

// Admin-only routes
sweetsRouter.post('/', requireAuth, requireAdmin, ctrl.addSweet)
sweetsRouter.put('/:id', requireAuth, requireAdmin, ctrl.updateSweet)
sweetsRouter.delete('/:id', requireAuth, requireAdmin, ctrl.deleteSweet)
sweetsRouter.post('/:id/restock', requireAuth, requireAdmin, ctrl.restockSweet)
sweetsRouter.put('/:id/image', requireAuth, requireAdmin, ctrl.updateSweetImage)

// Public route for listing sweets (no auth required for viewing)
sweetsRouter.get('/', ctrl.listSweets)
sweetsRouter.get('/search', requireAuth, ctrl.searchSweets)
sweetsRouter.post('/:id/purchase', requireAuth, ctrl.purchaseSweet)
