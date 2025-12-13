import { Router } from 'express'
import * as ctrl from '../controllers/sweetController'
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware'

export const sweetsRouter = Router()

sweetsRouter.post('/', requireAuth, ctrl.addSweet)
sweetsRouter.get('/', requireAuth, ctrl.listSweets)
sweetsRouter.get('/search', requireAuth, ctrl.searchSweets)
sweetsRouter.put('/:id', requireAuth, ctrl.updateSweet)
sweetsRouter.delete('/:id', requireAuth, requireAdmin, ctrl.deleteSweet)

sweetsRouter.post('/:id/purchase', requireAuth, ctrl.purchaseSweet)
sweetsRouter.post('/:id/restock', requireAuth, requireAdmin, ctrl.restockSweet)
