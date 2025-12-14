import { Response } from 'express'
import { generateSweetImage } from '../services/geminiImageService'
import { AppError } from '../utils/errors'
import type { AuthRequest } from '../types'

export async function generateImage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { sweetName, sweetId, category } = req.body

    if (!sweetName || !sweetId) {
      res.status(400).json({ error: 'sweetName and sweetId are required' })
      return
    }

    console.log(`Generating image for: ${sweetName} (${sweetId})`)
    const imageUrl = await generateSweetImage(sweetName, sweetId, category)
    
    res.json({ 
      imageUrl,
      sweetId,
      sweetName 
    })
  } catch (error) {
    console.error('Image generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.stack : String(error)
    console.error('Error details:', errorDetails)
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      res.status(500).json({ 
        error: errorMessage || 'Failed to generate image',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      })
    }
  }
}

