
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Source } from '../types';

interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export class EboSearchService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async runQuery(prompt: string): Promise<{ text: string; sources: Source[] }> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      const sources: Source[] = groundingChunks
        .map(chunk => chunk.web)
        .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title)
        .filter((web, index, self) => 
            index === self.findIndex((w) => w.uri === web.uri)
        ); // Deduplicate sources

      return { text, sources };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get response from AI model.");
    }
  }
}
