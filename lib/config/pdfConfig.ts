let pdfjsLib: any = null;
let isInitialized = false;

export async function initializePDFJS() {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only be initialized in the browser');
  }

  if (isInitialized && pdfjsLib) {
    return pdfjsLib;
  }

  const module = await import('pdfjs-dist');
  pdfjsLib = module;
  
  // SINGLE SOURCE OF TRUTH for PDF.js version - matches package.json
  pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.js';
  
  isInitialized = true;
  return pdfjsLib;
}

export function getPDFJS() {
  if (!pdfjsLib) {
    throw new Error('PDF.js not initialized. Call initializePDFJS() first.');
  }
  return pdfjsLib;
}
