import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON bodies
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with User-Agent for telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// 1. Fusion API Endpoint
app.post("/api/fuse", async (req, res) => {
  try {
    const { animal1, animal2_or_object, style, customStyle } = req.body;

    if (!animal1 || !animal2_or_object) {
      return res.status(400).json({ error: "Please provide both creatures/items to fuse." });
    }

    const ai = getGeminiClient();

    // Mapping pre-set styles to descriptions
    const styleDescriptions: Record<string, string> = {
      pixar_3d: "3D digital character art, vibrant claymation style, big expressive glassy eyes, soft smooth textures, cinematic lighting, cheerful and cute studio render.",
      vintage_watercolor: "Delicate watercolor and ink illustration, soft pastel color palette, gentle washes of color, detailed fine-line sketch overlays, cozy children's book aesthetic.",
      cyberpunk_neon: "Futuristic cyberpunk aesthetic, glowing neon accents embedded in fur/scales, dark rainy alleyway background with reflections, dramatic cyberpunk lighting, rich contrast.",
      studio_ghibli: "Classic anime cell style, hand-painted textured background, nostalgic and whimsical atmosphere, soft natural daylight, rich organic colors.",
      retro_8bit: "Charming retro 8-bit pixel art style, vibrant limited color palette, clean grid layouts, nostalgia-inducing vintage video game aesthetic.",
    };

    const chosenStyleDescription = styleDescriptions[style] || customStyle || "A unique hand-crafted digital art style.";

    const systemInstruction = `You are the ultimate "Master Geneticist" of the Pet Fusion Laboratory. 
Your job is to take two random animals (or an animal and an object) and blend them into a highly descriptive, visually stunning prompt optimized for AI image generation.

You must:
- Design how the anatomy features are blended (e.g., A shark with the fluffy fur and floppy ears of a golden retriever).
- Place the creature in an appropriate, whimsical, or epic background that matches its vibe.
- Specify exact textures (iridescent scales, ultra-fluffy fur) and lighting styles (soft cinematic rim lighting, vibrant neon glow) for high quality.
- Emphasize the requested art style.
- Output a creative, funny hybrid name.
- Output a short, funny 1-2 sentence bio or quirk of the creature from a scientific perspective.
`;

    const userPrompt = `Fuse these two things:
1. Subject A: "${animal1}"
2. Subject B: "${animal2_or_object}"
Desired Art Style: "${chosenStyleDescription}"

Generate the JSON response according to the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            creatureName: {
              type: Type.STRING,
              description: "A funny, highly creative hybrid name (e.g., 'The Fluffy Gummy-Shark' or 'Alpacasaurus Rex').",
            },
            imagePrompt: {
              type: Type.STRING,
              description: "The complete, detailed, expanded image prompt optimized for text-to-image models. Describe the fused anatomy, setting, textures, precise lighting, and explicit art style details. Do not use generic buzzwords like 'photorealistic'.",
            },
            funBio: {
              type: Type.STRING,
              description: "A humorous scientific observation about this hybrid's behavior, diet, or unique superpower.",
            },
          },
          required: ["creatureName", "imagePrompt", "funBio"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response content from Gemini.");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/fuse:", error);
    res.status(500).json({ error: error?.message || "Genetic fusion matrix error!" });
  }
});

// 2. Image Generation Endpoint (Optional rendering)
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided for generation." });
    }

    const ai = getGeminiClient();

    console.log("Generating image with prompt:", prompt);
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    let base64Image = null;
    const parts = response.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        break;
      }
    }

    if (base64Image) {
      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } else {
      res.status(500).json({ error: "The model did not return image data." });
    }
  } catch (error: any) {
    console.error("Error in /api/generate-image:", error);
    // Return a friendly error message, but specifically indicate why it might have failed
    // so the client can display a cute laboratory-themed error/mock fallback.
    res.status(500).json({
      error: error?.message || "Failed to render genetic specimen.",
      isQuotaOrAuthError: error?.message?.includes("API key") || error?.message?.includes("quota") || error?.message?.includes("not found") || error?.message?.includes("permission"),
    });
  }
});

// 3. Vite or Static file serving setup
async function startServer() {
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
    console.log(`Pet Fusion Laboratory running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
