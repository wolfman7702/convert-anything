export async function rotateImage(file: File, degrees: 90 | 180 | 270): Promise<Blob> {
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  if (degrees === 90 || degrees === 270) {
    canvas.width = img.height;
    canvas.height = img.width;
  } else {
    canvas.width = img.width;
    canvas.height = img.height;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  URL.revokeObjectURL(imageUrl);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), file.type);
  });
}

export async function flipImage(file: File, direction: 'horizontal' | 'vertical'): Promise<Blob> {
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

  if (direction === 'horizontal') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  }

  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(imageUrl);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), file.type);
  });
}

export async function grayscaleImage(file: File): Promise<Blob> {
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

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }

  ctx.putImageData(imageData, 0, 0);
  URL.revokeObjectURL(imageUrl);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), file.type);
  });
}

export async function invertImage(file: File): Promise<Blob> {
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

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  ctx.putImageData(imageData, 0, 0);
  URL.revokeObjectURL(imageUrl);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), file.type);
  });
}

export async function adjustBrightness(file: File, brightness: number): Promise<Blob> {
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

  ctx.filter = `brightness(${brightness}%)`;
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(imageUrl);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), file.type);
  });
}

export async function extractColorPalette(file: File, numColors: number = 5): Promise<string[]> {
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
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const colorMap = new Map<string, number>();

  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 10) * 10;
    const g = Math.round(data[i + 1] / 10) * 10;
    const b = Math.round(data[i + 2] / 10) * 10;
    const color = `rgb(${r},${g},${b})`;
    colorMap.set(color, (colorMap.get(color) || 0) + 1);
  }

  const sorted = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numColors)
    .map(([color]) => color);

  URL.revokeObjectURL(imageUrl);
  return sorted;
}
