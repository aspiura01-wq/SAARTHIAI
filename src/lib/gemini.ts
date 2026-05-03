import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getAssistantResponse(prompt: string, language: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are SaarthiAI, a helpful and empathetic AI assistant for common citizens in India, including low-literacy users, elderly, and workers. 
        Your goal is to provide simple, short, and structured answers. 
        Current language mode: ${language}. Please respond in this language if possible, or in simple English if preferred.
        Avoid complex jargon. provide clear headings and icons if text mode. 
        Always include a short summary for voice output.`,
      },
    });
    return response.text || "I am sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong. Please try again.";
  }
}

export async function analyzeMedicalImage(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: "Extract all medicine names from this receipt/prescription and provide detailed information for each in JSON format." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              salt: { type: Type.STRING },
              price: { type: Type.STRING },
              uses: { type: Type.STRING },
              benefits: { type: Type.STRING },
              sideEffects: { type: Type.STRING },
              safetyWarnings: { type: Type.STRING },
              whoShouldAvoid: { type: Type.STRING },
              prescriptionRequired: { type: Type.BOOLEAN },
              category: { type: Type.STRING },
              alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
              warning: { type: Type.STRING, description: "Must include a standard warning to consult a doctor." }
            },
            required: ["name", "salt", "price", "uses", "warning"]
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Medical OCR Error:", error);
    return [];
  }
}

export async function getNearbyServices(type: string, location: string) {
  // Simulated for now, but Gemini can help structure the search query or provide general info
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `List 5 nearby ${type} services in ${location}. Return as JSON array of NearbyService objects.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            type: { type: Type.STRING },
            distance: { type: Type.STRING },
            address: { type: Type.STRING },
            contact: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
}

export async function getHomeworkHelp(query: string, language: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: `You are SaarthiAI Education Assistant. You specialize in explaining complex homework topics to students and lifelong learners in India.
        Your goal is to be a patient teacher. 
        1. Break down the answer into simple steps.
        2. Use analogies from real life.
        3. Language: ${language}.
        4. If it's a math problem, show steps clearly.
        5. If it's science, explain the 'why' behind the 'what'.
        6. Keep it encouraging and positive.`,
      },
    });
    return response.text || "I am sorry, I couldn't explain that right now.";
  } catch (error) {
    console.error("Homework Help Error:", error);
    return "The education subsystem is currently offline. Please try again later.";
  }
}
