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
- Auditoría de Procesos (optimización operativa, flujos de trabajo, automatización)
- Ambos

CUESTIONARIO DE AUDITORÍA DE PROCESOS:
Fase 1 - Entendimiento General:
1. ¿Cuáles son los 3 objetivos más importantes de su departamento para este trimestre?
2. Describa un día típico para su equipo. ¿En qué invierten la mayor parte del tiempo?
3. ¿Qué procesos son absolutamente críticos para que su operación funcione sin interrupciones?

Fase 2 - Procesos Manuales:
4. ¿Qué tareas realizan sus empleados todos los días o todas las semanas de la misma manera?
5. ¿Hay procesos que requieran copiar y pegar información entre distintas aplicaciones?
6. Si pudiera eliminar una tarea tediosa, ¿cuál sería?
7. ¿Cuánto tiempo dedican a la entrada de datos, validación o conciliación?

Fase 3 - Datos y Documentación:
8. ¿Cómo reciben los datos o documentos clave (emails, PDFs, facturas, formularios)?
9. ¿Cuáles son los pasos manuales desde que reciben un documento hasta que queda archivado?
10. ¿Generan reportes periódicos? ¿Cómo los crean?

Fase 4 - Sistemas:
11. ¿Qué software usan (ERP, CRM, Excel)?
12. ¿Los sistemas se comunican automáticamente o mueven información manualmente?
13. ¿Hay sistemas antiguos que dificulten el trabajo?

Fase 5 - Puntos de Dolor:
14. ¿Dónde están los cuellos de botella o retrasos?
15. ¿Dónde ocurren más errores humanos y cuál es el costo?
16. ¿Qué tareas de bajo valor consumen tiempo del personal cualificado?

CUESTIONARIO DE MANUAL DE MARCA:
1. Propósito - ¿Qué problema soluciona su marca? ¿Qué futuro quiere construir?
2. Valores - ¿Cuáles son los 3 pilares innegociables de su marca?
3. Personalidad - ¿Cómo habla su marca? (Ej: cercana, profesional, motivadora)
4. Tono - Ejemplos de cómo SÍ y cómo NO debería comunicarse
5. Logotipo - ¿Tiene logo actual? ¿Necesita rediseño?
6. Colores - ¿Tiene paleta definida? ¿Qué emociones quiere transmitir?
7. Tipografía - ¿Qué fuentes usa para títulos y textos?
8. Estilo Visual - ¿Qué tipo de fotografías e íconos representan su marca?
9. Aplicaciones - ¿Dónde necesita usar su marca? (redes sociales, productos, tarjetas)

INSTRUCCIONES:
- Identifica primero si el cliente necesita Auditoría de Procesos, Manual de Marca o ambos
- Haz las preguntas de forma conversacional, no como interrogatorio
- Adapta el lenguaje al contexto del cliente
- Resume insights clave después de cada fase
- Al finalizar, da recomendaciones específicas basadas en las respuestas`,
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
