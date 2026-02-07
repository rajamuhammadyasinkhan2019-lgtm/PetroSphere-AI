
export enum RockType {
  IGNEOUS = 'Igneous',
  METAMORPHIC = 'Metamorphic',
  SEDIMENTARY = 'Sedimentary'
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  isThinking?: boolean;
  groundingUrls?: Array<{title: string, uri: string}>;
}

export interface RockSample {
  id: string;
  name: string;
  type: RockType;
  description: string;
  imageUrl?: string;
}

export interface ImageGenConfig {
  size: '1K' | '2K' | '4K';
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
}

export interface MicroscopeSpecimen {
  id: string;
  name: string;
  type: RockType;
  description: string;
  pplImageUrl: string;
  xplImageUrl: string;
  minerals: {
    name: string;
    properties: string;
    significance: string;
  }[];
}
