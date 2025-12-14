import { Sweet } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Generate an image for a sweet using Gemini API via backend
 */
export async function generateSweetImage(sweet: Sweet): Promise<string> {
  try {
    const token = localStorage.getItem('auth_token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available (optional for image generation)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/images/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sweetName: sweet.name,
        sweetId: sweet.id,
        category: sweet.category,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

/**
 * Generate image with fallback to placeholder
 */
export async function getSweetImage(sweet: Sweet): Promise<string> {
  try {
    // Try to generate image using Gemini
    return await generateSweetImage(sweet);
  } catch (error) {
    console.warn(`Failed to generate image for ${sweet.name}, using placeholder`, error);
    // Fallback to placeholder
    return `https://placehold.co/600x400/6B1318/FFFDD0?text=${encodeURIComponent(sweet.name)}`;
  }
}

