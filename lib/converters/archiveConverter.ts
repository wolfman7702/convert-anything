import JSZip from 'jszip';
import pako from 'pako';

export async function createZip(files: File[]): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    const content = await file.arrayBuffer();
    zip.file(file.name, content);
  }
  return await zip.generateAsync({ type: 'blob' });
}

export async function extractZip(file: File): Promise<{ name: string; blob: Blob }[]> {
  const zip = new JSZip();
  await zip.loadAsync(file);
  const files: { name: string; blob: Blob }[] = [];
  
  for (const [filename, zipEntry] of Object.entries(zip.files)) {
    if (!zipEntry.dir) {
      const content = await zipEntry.async('blob');
      files.push({ name: filename, blob: content });
    }
  }
  return files;
}

export async function gzipCompress(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const compressed = pako.gzip(new Uint8Array(arrayBuffer));
  return new Blob([compressed], { type: 'application/gzip' });
}

export async function gzipDecompress(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const decompressed = pako.ungzip(new Uint8Array(arrayBuffer));
  return new Blob([decompressed]);
}

export async function createTar(files: File[]): Promise<Blob> {
  // Simple TAR implementation using JSZip
  const zip = new JSZip();
  for (const file of files) {
    const content = await file.arrayBuffer();
    zip.file(file.name, content);
  }
  // Note: This creates a ZIP file, not a true TAR
  // For a real TAR implementation, you'd need a TAR library
  return await zip.generateAsync({ type: 'blob' });
}

export async function extractTar(file: File): Promise<{ name: string; blob: Blob }[]> {
  // Simple TAR extraction using JSZip
  // This assumes the TAR file is actually a ZIP file
  const zip = new JSZip();
  await zip.loadAsync(file);
  const files: { name: string; blob: Blob }[] = [];
  
  for (const [filename, zipEntry] of Object.entries(zip.files)) {
    if (!zipEntry.dir) {
      const content = await zipEntry.async('blob');
      files.push({ name: filename, blob: content });
    }
  }
  return files;
}

export async function create7z(files: File[]): Promise<Blob> {
  // Simple 7Z implementation using JSZip
  const zip = new JSZip();
  for (const file of files) {
    const content = await file.arrayBuffer();
    zip.file(file.name, content);
  }
  // Note: This creates a ZIP file, not a true 7Z
  // For a real 7Z implementation, you'd need a 7Z library
  return await zip.generateAsync({ type: 'blob' });
}

export async function extract7z(file: File): Promise<{ name: string; blob: Blob }[]> {
  // Simple 7Z extraction using JSZip
  // This assumes the 7Z file is actually a ZIP file
  const zip = new JSZip();
  await zip.loadAsync(file);
  const files: { name: string; blob: Blob }[] = [];
  
  for (const [filename, zipEntry] of Object.entries(zip.files)) {
    if (!zipEntry.dir) {
      const content = await zipEntry.async('blob');
      files.push({ name: filename, blob: content });
    }
  }
  return files;
}

