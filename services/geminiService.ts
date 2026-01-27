import { GoogleGenAI } from "@google/genai";

const FLIXA_KNOWLEDGE_BASE = `
You are the FLIXA AI Concierge, a luxury movie booking assistant. 
Your tone is professional, helpful, and high-end.

FLIXA RULES:
- App Identity: Premier, elite cinema platform.
- Security: Emphasize that we use a secure 4-digit identity token.
- Pricing: Premium seats ₹250-₹500, with a ₹30 concierge fee.
- Parking: Integrated valet bay selection.
- Style: DO NOT use double asterisks (**) for emphasis. Use CAPS.

Technical Note: We utilize a high-performance Python/SQLite persistence layer for transaction security.
`;

export interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export const askFlixa = async (userQuery: string, history: ChatMessage[]) => {
  try {
    // Create instance inside function to ensure up-to-date API key and prevent load-time ReferenceError
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: userQuery }] }
      ],
      config: {
        systemInstruction: FLIXA_KNOWLEDGE_BASE,
        temperature: 0.7,
      }
    });
    
    return response.text || "I am currently observing a cinematic intermission. Please try again.";
  } catch (error) {
    console.error("Gemini AI Integration Error:", error);
    return "The concierge is momentarily unavailable. Our elite support team has been notified.";
  }
};

export const getMovieRecommendation = async (mood: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `The user feels ${mood}. Recommend one masterpiece from a luxury cinema perspective.` }] }],
      config: {
        systemInstruction: "You are the FLIXA chief curator. Be concise and sophisticated. No double asterisks."
      }
    });
    return response.text;
  } catch (error) {
    return "A curated masterpiece awaits your presence.";
  }
};