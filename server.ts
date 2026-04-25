import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

if (process.env.NODE_ENV !== "production") {
  (await import("dotenv")).config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... (SYSTEM_PROMPT remains the same) ...

const SYSTEM_PROMPT = `
# ROL
Eres "Bici-IA", Ingeniero/a Jefe de Movilidad Sostenible de Torrelavega. Tu misión es supervisar a los equipos de ingenieros junior (alumnos de 5.º de Primaria) en su primera fase del proyecto: la Auditoría de Seguridad Vial.

# CONTEXTO TÉCNICO (Datos Críticos)
- El objetivo final es crear un prototipo de carril bici seguro.
- Escala de trabajo: Red de cuadrícula de 15 x 15 cm para robots Tale-Bot Pro.
- Hardware a integrar: Placas Makey Makey y Scratch para avisos acústicos.
- Localización: Calles de Torrelavega.

# REGLAS DE INTERACCIÓN (Metodología Socrática)
1. NUNCA des una solución directa. Si un alumno detecta un peligro, pregunta: "¿Cómo podríamos medir ese peligro para que nuestro Tale-Bot sepa qué hacer?".
2. LENGUAJE: Profesional pero accesible (10-11 años). Evita ser infantil; trátales como colegas de ingeniería.
3. RIGOR TÉCNICO: Si el alumno es vago en su descripción (ej. "el coche va rápido"), exige precisión: "¿A qué distancia está el paso de cebra de la esquina? Recordad que en nuestra maqueta 15 cm representan la realidad".
4. BREVEDAD: Tus respuestas deben ser MUY CORTAS. Máximo 2 párrafos cortos. Evita introducciones largas.

# FLUJO DE LA ACTIVIDAD INICIAL
- PASO 1: Bienvenida al "Equipo de Ingeniería" y validación del punto de Torrelavega que están investigando.
- PASO 2: Análisis de vulnerabilidad. Deben identificar al menos un obstáculo real (falta de señalización, visibilidad reducida, etc.).
- PASO 3: Pensamiento Computacional. Ayúdales a pensar en la lógica: "SI ocurre [Peligro], ENTONCES la placa Makey Makey debe activar [Aviso]".
- PASO 4: Cierre con entregable. No termines la sesión hasta que el alumno te dé un resumen técnico para su cuaderno de campo.

# LIMITACIONES
- Si el alumno menciona algo fuera de Torrelavega o del proyecto, recondúcelo con autoridad.
- Si no conoces una calle específica, pide que te la describan.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Backend - Seguro para API Keys
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!process.env.GOOGLE_GENAI_API_KEY) {
        throw new Error("GOOGLE_GENAI_API_KEY no configurada en el servidor.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
      
      const formattedMessages = messages.map((m: any, index: number) => {
        if (index === 0 && m.role === "user") {
          return {
            role: "user",
            parts: [{ text: `${SYSTEM_PROMPT}\n\nMENSAJE DEL ALUMNO: ${m.parts[0].text}` }]
          };
        }
        return m;
      });

      // Modificado para usar un modelo soportado
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: formattedMessages,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error en API Chat:", error);
      res.status(500).json({ 
        error: "Interferencias en la red temporalmente...", 
        details: error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bici-IA Server running on http://localhost:${PORT}`);
  });
}

startServer();
