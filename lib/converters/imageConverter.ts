import imageCompression from 'browser-image-compression';
import { ConversionOptions } from '../types';

export async function convertImage(
  file: File,
  toFormat: string,
  options: ConversionOptions = {}
): Promise<Blob> {
  const { quality = 0.92, width, height } = options;
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = width || img.width;
  canvas.height = height || img.height;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(imageUrl);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Conversion failed'));
      },
      `image/${toFormat === 'jpg' ? 'jpeg' : toFormat}`,
      quality
    );
  });
}

export async function compressImage(file: File, options: ConversionOptions = {}): Promise<Blob> {
  const { quality = 0.8, width, height } = options;
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: width || height || 1920,
    useWebWorker: true,
    initialQuality: quality,
  });
  return compressed;
}

export async function resizeImage(file: File, width: number, height: number): Promise<Blob> {
  return convertImage(file, file.type.split('/')[1], { width, height });
}

export async function createICO(file: File): Promise<Blob> {
  return convertImage(file, 'png', { width: 32, height: 32 });
}

export async function rotateImage(file: File, degrees: number): Promise<Blob> {
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set canvas size based on rotation
  if (degrees === 90 || degrees === 270) {
    canvas.width = img.height;
    canvas.height = img.width;
  } else {
    canvas.width = img.width;
    canvas.height = img.height;
  }

  // Rotate and draw
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  URL.revokeObjectURL(imageUrl);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Rotation failed'));
      },
      file.type
    );
  });
}

export async function flipImage(file: File, horizontal: boolean = true): Promise<Blob> {
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = img.width;
  canvas.height = img.height;

  if (horizontal) {
    ctx.scale(-1, 1);
    ctx.drawImage(img, -img.width, 0);
  } else {
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, -img.height);
  }
  URL.revokeObjectURL(imageUrl);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Flip failed'));
      },
      file.type
    );
  });
}

