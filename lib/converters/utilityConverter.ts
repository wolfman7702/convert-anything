import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

export async function generateQRCode(text: string, size: number = 256): Promise<Blob> {
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, text, { width: size, margin: 1 });
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

export async function generateBarcode(text: string, format: string = 'CODE128'): Promise<Blob> {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, text, { format });
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

export async function svgToPNG(file: File, width?: number, height?: number): Promise<Blob> {
  const text = await file.text();
  const img = new Image();
  const svg = new Blob([text], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svg);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
  
  const canvas = document.createElement('canvas');
  canvas.width = width || img.width;
  canvas.height = height || img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

export async function svgToJPG(file: File, width?: number, height?: number): Promise<Blob> {
  const text = await file.text();
  const img = new Image();
  const svg = new Blob([text], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svg);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
  
  const canvas = document.createElement('canvas');
  canvas.width = width || img.width;
  canvas.height = height || img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg');
  });
}

export async function svgToPDF(file: File, width?: number, height?: number): Promise<Blob> {
  const pngBlob = await svgToPNG(file, width, height);
  const img = new Image();
  const url = URL.createObjectURL(pngBlob);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
  
  const canvas = document.createElement('canvas');
  canvas.width = width || img.width;
  canvas.height = height || img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  
  // Convert to PDF using jsPDF
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [canvas.width, canvas.height]
  });
  
  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  
  return new Blob([pdf.output('blob')], { type: 'application/pdf' });
}

export function htmlToMarkdown(html: string): string {
  let markdown = html;
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n');
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i>(.*?)<\/i>/gi, '*$1*');
  markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');
  markdown = markdown.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
  markdown = markdown.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
  markdown = markdown.replace(/<[^>]*>/g, '');
  return markdown.trim();
}

export function markdownToHTML(markdown: string): string {
  let html = markdown;
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/\n/g, '<br>');
  return html;
}

export async function extractColorsFromImage(file: File): Promise<string[]> {
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
  URL.revokeObjectURL(imageUrl);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const colors = new Set<string>();

  // Sample every 10th pixel to get dominant colors
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    colors.add(hex);
  }

  return Array.from(colors).slice(0, 10);
}

export async function imageToASCII(file: File, width: number = 80): Promise<string> {
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Calculate height maintaining aspect ratio
  const aspectRatio = img.height / img.width;
  canvas.width = width;
  canvas.height = Math.floor(width * aspectRatio);
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(imageUrl);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const chars = ' .:-=+*#%@';
  let ascii = '';
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const brightness = (r + g + b) / 3;
      const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
      ascii += chars[charIndex];
    }
    ascii += '\n';
  }
  
  return ascii;
}

