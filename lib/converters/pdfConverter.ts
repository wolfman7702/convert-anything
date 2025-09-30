import { PDFDocument } from 'pdf-lib';
import jsPDF from 'jspdf';
import { ConversionOptions } from '../types';

export async function pdfToImages(file: File, format: 'png' | 'jpg' = 'jpg'): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();
  const images: Blob[] = [];

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = width;
    canvas.height = height;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), `image/${format}`);
    });
    images.push(blob);
  }
  return images;
}

export async function imagesToPDF(files: File[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    let image;

    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(imageBytes);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      continue;
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function splitPDF(file: File): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();
  const pdfs: Blob[] = [];

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);
    const pdfBytes = await newPdf.save();
    pdfs.push(new Blob([pdfBytes], { type: 'application/pdf' }));
  }

  return pdfs;
}

export async function compressPDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function htmlToPDF(htmlContent: string): Promise<Blob> {
  const doc = new jsPDF();
  doc.html(htmlContent, {
    callback: function (doc) {
      doc.save('document.pdf');
    },
  });
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
}

export async function textToPDF(text: string): Promise<Blob> {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 10);
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
}

export async function rotatePDF(file: File, degrees: number): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  
  pages.forEach(page => {
    page.setRotation({ type: 'degrees', angle: degrees });
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function deletePDFPages(file: File, pagesToDelete: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();
  
  // Create new PDF with pages to keep
  const newPdf = await PDFDocument.create();
  const pagesToKeep = [];
  
  for (let i = 0; i < pageCount; i++) {
    if (!pagesToDelete.includes(i + 1)) { // pagesToDelete is 1-indexed
      pagesToKeep.push(i);
    }
  }
  
  if (pagesToKeep.length > 0) {
    const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
    copiedPages.forEach(page => newPdf.addPage(page));
  }

  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function extractTextFromPDF(file: File): Promise<string> {
  console.log('Starting PDF text extraction for file:', file.name);
  
  try {
    // Try multiple methods to extract text from PDF
    
    // Method 1: Try reading as text (works for some PDFs)
    const textContent = await file.text();
    
    // Check if we got readable text (not binary data)
    const readableText = textContent.replace(/[^\x20-\x7E\s]/g, '').trim();
    if (readableText.length > 50 && !textContent.includes('%%EOF')) {
      console.log('Successfully extracted text from PDF using FileReader');
      return readableText;
    }
    
    // Method 2: Try to extract text using ArrayBuffer analysis
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Look for text streams in the PDF
    let extractedText = '';
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    
    // Extract text between BT (Begin Text) and ET (End Text) operators
    const textMatches = pdfString.match(/BT\s*.*?\s*ET/gs);
    if (textMatches) {
      for (const match of textMatches) {
        // Extract text content from the match
        const textContent = match.replace(/BT|ET|\/F\d+\s+\d+\s+Tf|\d+\s+\d+\s+Td|Tj|TJ|'|"/g, '');
        const cleanText = textContent.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanText) {
          extractedText += cleanText + ' ';
        }
      }
    }
    
    if (extractedText.trim()) {
      console.log('Successfully extracted text using PDF parsing');
      return extractedText.trim();
    }
    
    // Method 3: Fallback - provide helpful instructions
    const fallbackText = `PDF Text Extraction

This PDF contains content but automated text extraction was not successful.

To convert this PDF to Excel, please follow these steps:

1. Open the PDF in your browser or PDF viewer
2. Select all text (Ctrl+A) and copy (Ctrl+C)  
3. Create a new text file and paste the content
4. Use our "TXT to XLSX" conversion tool
5. Your text will be properly formatted in Excel

Alternative: Use an online PDF-to-Excel converter for better results.

PDF File: ${file.name} (${Math.round(file.size / 1024)}KB)
Status: Manual extraction recommended`;

    console.log('Using fallback text extraction');
    return fallbackText;
    
  } catch (error) {
    console.error('PDF processing error:', error);
    return 'Error processing PDF. The file may be corrupted or password-protected.';
  }
}


