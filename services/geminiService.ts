import { GoogleGenAI, Type } from "@google/genai";
import { Sweet } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const getSweetRecommendations = async (
  inventory: Sweet[],
  userPrompt: string
): Promise<{ recommendations: { sweetId: string; reason: string }[] }> => {
  
  const ai = getAiClient();
  
  // Create a simplified inventory list to save tokens
  const simplifiedInventory = inventory.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    category: s.category,
    price: s.price,
    inStock: s.quantity > 0
  }));

  const systemPrompt = `
    You are an expert Sweet Shop Sommelier. 
    You have the following inventory: ${JSON.stringify(simplifiedInventory)}.
    
    Based on the user's request, recommend up to 3 items from the inventory.
    Only recommend items that are in stock (inStock: true).
    Return the result strictly as a JSON object matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sweetId: { type: Type.STRING },
                  reason: { type: Type.STRING, description: "A short, enticing reason why this matches the user request." }
                },
                required: ["sweetId", "reason"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) return { recommendations: [] };
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { recommendations: [] };
  }
};