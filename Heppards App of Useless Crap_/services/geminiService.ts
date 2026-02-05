
import { GoogleGenAI, Chat, HarmCategory, HarmBlockThreshold, Part, Type } from "@google/genai";
import { type Message } from '../types';
import { LUMINA_SYSTEM_PROMPT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY });

let chatSession: Chat | null = null;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];


function getChatSession(history: Message[]): Chat {
  const textHistory = history.filter(m => !m.image); // Don't include images in history
  
  const formattedHistory = textHistory.map(msg => ({
    role: msg.author === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Re-create session to ensure context is always right, especially when game modes change.
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: formattedHistory,
    config: {
      systemInstruction: LUMINA_SYSTEM_PROMPT,
      safetySettings,
    }
  });
  return chatSession;
}

export const streamMessage = async (
  fullPrompt: string,
  history: Message[],
  onChunk: (chunk: string) => void,
  imageB64?: string
): Promise<void> => {
  const session = getChatSession(history);
  
  const messageParts: Part[] = [{ text: fullPrompt }];

  if (imageB64) {
      const base64Data = imageB64.split(',')[1];
      if (base64Data) {
          messageParts.push({
              inlineData: {
                  mimeType: 'image/png',
                  data: base64Data
              }
          });
      }
  }

  try {
    const stream = await session.sendMessageStream({ message: messageParts });

    for await (const chunk of stream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Error streaming message:", error);
    onChunk("My apologies, a solar flare in my dimension seems to have scrambled my thoughts. Could you repeat that?");
  }
};

export const generateImageEdit = async (prompt: string, imageB64: string): Promise<string | null> => {
    try {
        const base64Data = imageB64.split(',')[1];
        if (!base64Data) {
            throw new Error("Invalid base64 image data");
        }

        const imagePart = {
            inlineData: {
                mimeType: 'image/png',
                data: base64Data,
            },
        };

        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;

    } catch (error)
 {
        console.error("Error generating image edit:", error);
        return null;
    }
};

export const analyzeSentiment = async (text: string): Promise<{score: number, emotion: string} | null> => {
    const prompt = `Analyze the sentiment of the following text. Respond ONLY with a JSON object containing two keys: "score" (a number from -1.0 for very negative/stressed to 1.0 for very positive/joyful) and "emotion" (a single descriptive word like 'joyful', 'frustrated', 'curious', 'sad'). Text: "${text}"`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        emotion: { type: Type.STRING }
                    },
                    required: ["score", "emotion"]
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error analyzing sentiment:", error);
        return null;
    }
};
