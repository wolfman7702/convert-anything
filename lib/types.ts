export interface ConversionType {
  id: string;
  name: string;
  from: string;
  to: string;
  category: 'image' | 'pdf' | 'document' | 'data' | 'archive' | 'utility';
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
  brightness?: number;
  findText?: string;
  replaceText?: string;
  // QR Code options
  qrStyle?: string;
  qrSize?: number;
  qrColor?: string;
  // Image effect options
  blurAmount?: number;
  contrast?: number;
  saturation?: number;
  borderWidth?: number;
  borderColor?: string;
  pixelSize?: number;
  // PDF options
  compressionLevel?: string;
  watermarkText?: string;
  password?: string;
  // Removed audio options - no longer supported
  // Other options
  includeWordFrequency?: boolean;
  [key: string]: any;
}

