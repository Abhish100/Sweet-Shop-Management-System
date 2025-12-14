import { env } from '../utils/env'

export interface GenerateImageRequest {
  prompt: string
  sweetName: string
  sweetId: string
}

export interface GenerateImageResponse {
  imageUrl: string
  imageData?: string // base64 encoded image
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          data: string
          mimeType?: string
        }
        url?: string
      }>
    }
  }>
}

/**
 * Generate an image using Gemini 2.0 Flash Image Generation API
 */
export async function generateSweetImage(
  sweetName: string,
  sweetId: string,
  category?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY
  
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    throw new Error('GEMINI_API_KEY not configured. Please set it in backend/.env file')
  }

  // Create a detailed prompt for the image
  const prompt = `A beautiful, appetizing plate of authentic Indian sweet ${sweetName}${category ? ` from the ${category} category` : ''}. 
    Professional food photography, white background, high quality, detailed, 
    showcasing the traditional appearance and texture of ${sweetName}. 
    The image should be appetizing and make the viewer want to purchase this sweet.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error:', errorText)
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as GeminiResponse
    
    // Extract image data from response
    // The response structure may vary, so we need to handle it
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const content = data.candidates[0].content
      
      // Check for inline data (base64)
      if (content.parts && content.parts[0] && content.parts[0].inlineData) {
        const base64Data = content.parts[0].inlineData.data
        const mimeType = content.parts[0].inlineData.mimeType || 'image/png'
        return `data:${mimeType};base64,${base64Data}`
      }
      
      // Check for image URL if provided
      if (content.parts && content.parts[0] && content.parts[0].url) {
        return content.parts[0].url
      }
    }
    
    // Fallback: if response structure is different, log it
    console.warn('Unexpected Gemini response structure:', JSON.stringify(data, null, 2))
    throw new Error('Unexpected response format from Gemini API')
    
  } catch (error) {
    console.error('Error generating image with Gemini:', error)
    throw error
  }
}

