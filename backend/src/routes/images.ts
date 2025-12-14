import { Router } from 'express'
import { generateImage } from '../controllers/imageController'

export const imagesRouter = Router()

// Generate image for a sweet (public endpoint for easier access)
imagesRouter.post('/generate', generateImage)

