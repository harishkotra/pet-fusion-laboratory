# Pet Fusion Laboratory

Welcome to the **Pet Fusion Laboratory**! This is an interactive full-stack web application designed for master geneticists to blend two random animals (or an animal and an object) into highly creative, optimized text-to-image prompts using advanced Google Gemini models. It then utilizes Gemini image generation models to visualize the synthesized hybrid specimens live!

*Built with precision and loaded with beautiful biotech themed animations, historical log tracking, and multiple preset artistic filters.*

---

## Features
1. **Double DNA Helix Input**: Choose or randomly roll two distinct animals, objects, or organic items.
2. **Preset Artistic DNA Filters**: Optimize prompts directly with one click for:
   - **Pixar 3D**: Vibrant claymation character design with large glassy eyes.
   - **Vintage Watercolor**: Soft children's book washes and fine lines.
   - **Cyberpunk Neon**: Glowing highlights in rainy reflective alleys.
   - **Studio Ghibli**: Classic anime style with nostalgia-inducing organic colors.
   - **Retro 8-Bit**: Grid-locked vintage game pixels.
   - **Custom Formula**: Write custom artistic styles and filters.
3. **Advanced AI Splicing**: Powered by **Gemini 3.1-Flash-Lite** to formulate highly detailed prompts, humorous bios, and creative names for your hybrids.
4. **Visualizer Scan Stage**: Integrated with **Gemini 3.1-Flash-Lite-Image** to render physical previews of your creature. If api/quota constraints occur, it falls back to a high-fidelity cyan blueprint schematic view.
5. **Specimen Catalog Logs**: Automatically archives fusion events in local storage, allowing you to load or incinerate historic genetic files dynamically.

---

## System Architecture

```
                                  +-------------------+
                                  |   Web Browser     |
                                  |  (React/Tailwind) |
                                  +---------+---------+
                                            |
                         REST /api/fuse     |   REST /api/generate-image
                        +-------------------+--------------------+
                        |                                        |
                        v                                        v
         +--------------+--------------+          +--------------+--------------+
         |     Express API Server      |          |     Express API Server      |
         |      (server.ts / Node)     |          |      (server.ts / Node)     |
         +--------------+--------------+          +--------------+--------------+
                        |                                        |
                        | @google/genai SDK                      | @google/genai SDK
                        v                                        v
         +--------------+--------------+          +--------------+--------------+
         |   Gemini 3.1-Flash-Lite     |          | Gemini 3.1-Flash-Lite-Image |
         |   (Custom System prompt)    |          |    (Specimen Rendering)     |
         +-----------------------------+          +-----------------------------+
```

---

## Tech Stack & Dependencies

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Animations), Lucide-React (Biotech UI Icons)
- **Backend**: Express (Custom Node server), Esbuild (Bundler/CJS compilation), Tsx (TypeScript execution in dev)
- **AI Core**: `@google/genai` TypeScript SDK (integrating Gemini 3.1-Flash-Lite for prompt structuring and Gemini 3.1-Flash-Lite-Image for rendering)

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key (Configure in your `.env` file)

### Setup & Local Installation

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
   APP_URL="http://localhost:3000"
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   *The server will mount the Vite frontend on top of the Express backend and start on port `3000`.*

4. **Production Build & Bundle**
   ```bash
   npm run build
   npm run start
   ```

---

## Code Snippets & Key Logic

### 1. Gemini Splicing Middleware
In `/server.ts`, we instruct Gemini to return structured, typed JSON corresponding to our genetic formula:

```typescript
const systemInstruction = `You are the ultimate "Master Geneticist" of the Pet Fusion Laboratory. 
Your job is to take two random animals (or an animal and an object) and blend them into a highly descriptive, visually stunning prompt optimized for AI image generation.`;

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-lite", // Optimized for ultra-low latency and credits
  contents: userPrompt,
  config: {
    systemInstruction,
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        creatureName: { type: Type.STRING },
        imagePrompt: { type: Type.STRING },
        funBio: { type: Type.STRING },
      },
      required: ["creatureName", "imagePrompt", "funBio"],
    },
  },
});
```

### 2. Client-Side Specimen Visualizer
We handle quota limits and missing API keys elegantly by serving custom-designed technical blueprint schematics when image synthesis fails:

```typescript
const renderVisualSpecimen = async () => {
  setIsRendering(true);
  try {
    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: result.imagePrompt }),
    });
    const data = await res.json();
    if (data.imageUrl) onSetImageUrl(data.imageUrl);
  } catch (err) {
    setRenderError("Molecular compilation error: Splicing core unstable.");
  }
};
```

---

## Forking & Contribution Guidelines

We love external geneticists! To start modifying the lab:

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch**: `git checkout -b feature/cool-new-splice`.
3. **Commit Your Changes**: Ensure types are fully validated by running `npm run lint`.
4. **Push & Open a Pull Request**.

### Ideas for Future Upgrades:
- **Sound Synth Effects**: Add synthesized cellular sound loops when splicing (e.g. bubbles popping or electric hums).
- **Interactive Canvas**: Add a drag-and-drop cell combiner canvas where users physically drag elements together to fuse them.
- **DNA Stats Cards**: Generate attributes (e.g., Attack, Agility, Whimsicalness) as a spider chart using D3.js.
- **Export to PNG/GIF Cards**: Allow downloading a collectible trading card containing the bio, stats, and rendering.