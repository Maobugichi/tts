export interface Voice {
  voiceId: string;
  name: string;
  category: string;
  description: string;
  labels: Record<string, string>;
  previewUrl: string;
}

export interface UsageData {
  characterCount: number;
  characterLimit: number;
  charactersRemaining: number;
  tier: string;
}