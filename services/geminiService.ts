
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VerificationResult, GroundingChunk } from "../types";

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Screen content using the standard flash model
 */
export const screenContent = async (title: string, content: string): Promise<VerificationResult> => {
  const ai = getAi();
  const prompt = `Analyze the following text for credibility. 
  Title: ${title}
  Content: ${content}
  Provide a structured analysis including a credibility score (0-100), a detailed analysis of the claims, potential sources, and flags.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            credibilityScore: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
            sourcesFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            flags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["credibilityScore", "analysis", "sourcesFound", "flags"]
        }
      }
    });

    return JSON.parse(response.text?.trim() || "{}");
  } catch (error) {
    console.error("AI Screening failed:", error);
    return { credibilityScore: 50, analysis: "Error during analysis.", sourcesFound: [], flags: ["Service Error"] };
  }
};

/**
 * Grounded search using Gemini 3 Flash
 */
export const searchGrounding = async (query: string) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: { tools: [{ googleSearch: {} }] },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

/**
 * Maps grounding using Gemini 2.5 Flash
 */
export const mapsGrounding = async (query: string, location?: { lat: number; lng: number }) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: { 
      tools: [{ googleMaps: {} }],
      toolConfig: location ? {
        retrievalConfig: { latLng: { latitude: location.lat, longitude: location.lng } }
      } : undefined
    },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

/**
 * Generate images with Gemini 3 Pro Image
 */
export const generateImage = async (prompt: string, aspectRatio: string = "1:1", imageSize: "1K"|"2K"|"4K" = "1K") => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio, imageSize }
    },
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

/**
 * Generate videos with Veo 3.1
 */
export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
  const ai = getAi();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
  });
  
  while (!operation.done) {
    await new Promise(r => setTimeout(r, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }
  
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

/**
 * Advanced reasoning with thinking budget (Gemini 3 Pro)
 */
export const complexReasoning = async (prompt: string) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { 
      thinkingConfig: { thinkingBudget: 32768 }
    },
  });
  return response.text;
};

/**
 * Low latency responses with Flash Lite
 */
export const quickResponse = async (prompt: string) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite-latest",
    contents: prompt
  });
  return response.text;
};

/**
 * Text-to-Speech Generation
 */
export const generateSpeech = async (text: string) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

/**
 * Transcribe Audio from base64
 */
export const transcribeAudio = async (base64Data: string) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: "audio/wav" } },
        { text: "Transcribe this audio exactly as spoken." }
      ]
    }
  });
  return response.text;
};

/**
 * Analyze Media (Image or Video)
 */
export const analyzeMedia = async (base64Data: string, mimeType: string, prompt: string = "Analyze this media for factual content.") => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};
