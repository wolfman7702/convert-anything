// Single source of truth for PDF.js configuration
let pdfjs: any = null;

export async function setupPDFJS() {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js only works in browser');
  }

  if (pdfjs) {
    return pdfjs;
  }

  // Dynamic import
  const pdfjsLib = await import('pdfjs-dist');
  
  // CRITICAL: Set worker to exact version we installed
  pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  
  pdfjs = pdfjsLib;
  return pdfjs;
}
