export interface FusionResult {
  creatureName: string;
  imagePrompt: string;
  funBio: string;
}

export interface ArtStylePreset {
  id: string;
  name: string;
  description: string;
  promptAddon: string;
  tagline: string;
}

export interface GeneticSpecimen {
  id: string;
  animal1: string;
  animal2: string;
  style: string;
  result: FusionResult;
  imageUrl?: string;
  timestamp: string;
}
