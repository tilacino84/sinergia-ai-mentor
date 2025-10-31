// Gemini API Service
// Centraliza todas las llamadas a la API de Gemini

const GEMINI_API_KEY = "AIzaSyBoatqxPg_jkONwZvZj9Uj2XEJpLN8MjT8";
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export type GeminiModel = 
  | "gemini-2.5-pro"
  | "gemini-2.5-flash" 
  | "gemini-2.5-flash-lite";

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GeminiRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    thinkingConfig?: {
      mode: "THINKING_MODE_ENABLED" | "THINKING_MODE_DISABLED";
    };
  };
  tools?: any[];
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason: string;
  }>;
}

/**
 * Genera contenido usando Gemini API
 */
export async function generateContent(
  model: GeminiModel,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  options?: {
    temperature?: number;
    maxOutputTokens?: number;
    enableThinking?: boolean;
  }
): Promise<string> {
  const geminiMessages: GeminiMessage[] = messages.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const request: GeminiRequest = {
    contents: geminiMessages,
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxOutputTokens ?? 2048,
      ...(options?.enableThinking && {
        thinkingConfig: {
          mode: "THINKING_MODE_ENABLED",
        },
      }),
    },
  };

  const endpoint = `${GEMINI_API_BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API Error: ${error}`);
  }

  const data: GeminiResponse = await response.json();
  const text = data.candidates[0]?.content.parts[0]?.text || "";
  
  return text;
}

/**
 * Análisis profundo con gemini-2.5-pro y máxima configuración de pensamiento
 */
export async function deepAnalysis(query: string): Promise<string> {
  return generateContent(
    "gemini-2.5-pro",
    [
      {
        role: "assistant",
        content: "Eres Sinergia AI, un consultor de negocios experto especializado en análisis estratégico profundo para empresas B2B.",
      },
      { role: "user", content: query },
    ],
    {
      temperature: 0.8,
      maxOutputTokens: 4096,
      enableThinking: true,
    }
  );
}

/**
 * Respuesta rápida con gemini-2.5-flash-lite
 */
export async function quickResponse(query: string): Promise<string> {
  return generateContent(
    "gemini-2.5-flash-lite",
    [
      {
        role: "assistant",
        content: "Eres Sinergia AI, un consultor de negocios que da respuestas directas y accionables.",
      },
      { role: "user", content: query },
    ],
    {
      temperature: 0.5,
      maxOutputTokens: 1024,
    }
  );
}

/**
 * Chat conversacional para evaluación
 */
export async function chatEvaluation(
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const systemPrompt = {
    role: "assistant" as const,
    content: `Eres Sinergia AI, un consultor de negocios experto. Tu objetivo es diagnosticar si el cliente necesita:
- Manual de Marca (identidad visual, logo, colores, lineamientos)
- Auditoría de Procesos (optimización operativa, flujos de trabajo)
- Ambos

Haz preguntas guiadas de forma conversacional para entender el negocio y dar recomendaciones precisas.`,
  };

  return generateContent(
    "gemini-2.5-flash",
    [systemPrompt, ...conversationHistory],
    {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  );
}
