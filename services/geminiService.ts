
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { RockType } from "../types";

// Helper for image handling
export const fileToPart = async (file: File): Promise<{ inlineData: { data: string, mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getGeminiChat = (useThinking: boolean = false) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config: any = {
    systemInstruction: "You are an expert petrologist assisting a user in the study of Igneous, Metamorphic, and Sedimentary rocks. Provide detailed, scientifically accurate information about mineral composition, formation environments, and classification schemes. When requested for complex reasoning, use your thinking capabilities.",
  };

  if (useThinking) {
    // Thinking Config is only available for the Gemini 3 and 2.5 series models.
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config,
  });
};

export const searchRockInfo = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response;
};

// Maps grounding is only supported in Gemini 2.5 series models.
export const findRockLocations = async (query: string, lat?: number, lng?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const toolConfig = lat && lng ? {
    retrievalConfig: {
      latLng: { latitude: lat, longitude: lng }
    }
  } : undefined;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Find geological sites or formations related to: ${query}`,
    config: {
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
      toolConfig,
    },
  });
  return response;
};

export const generatePetrologyImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K') => {
  // Check key selection for gemini-3-pro-image-preview
  if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
    await window.aistudio.openSelectKey();
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `A professional geological sample photo of: ${prompt}. High detail, scientific thin section or macro photography style.` }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

export const editRockImage = async (imageFile: File, prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = await fileToPart(imageFile);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        imagePart,
        { text: prompt }
      ],
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

export const analyzeMicroscopeView = async (imageUrl: string, question: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert data URL to base64 parts
  const base64Data = imageUrl.split(",")[1];
  const mimeType = imageUrl.split(",")[0].split(":")[1].split(";")[0];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: `As a petrologist, analyze this thin section image. ${question}. Focus on optical properties like pleochroism, birefringence, and mineral identification.` }
      ]
    }
  });
  return response.text;
};

// Use the correct alias for flash lite as per guidelines
export const fastAnalyzeRock = async (text: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: `Summarize the following geological description into 3 key bullet points: ${text}`,
    });
    return response.text;
}
