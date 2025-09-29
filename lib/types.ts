export interface ConversionType {
  id: string;
  name: string;
  from: string;
  to: string;
  category: 'image' | 'pdf' | 'video' | 'audio' | 'document' | 'data' | 'archive' | 'utility';
  description: string;
  popular?: boolean;
}

export interface ConversionOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: string;
  pages?: number[];
  degrees?: number;
  horizontal?: boolean;
  startTime?: number;
  endTime?: number;
  fps?: number;
  [key: string]: any;
}

