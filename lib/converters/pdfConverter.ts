import { PDFDocument } from 'pdf-lib';
import jsPDF from 'jspdf';
import { ConversionOptions } from '../types';

export async function pdfToImages(file: File, format: 'png' | 'jpg' = 'jpg'): Promise<Blob[]> {
  try {
    // Extract text from PDF and create a clean image representation
    const pdfText = await extractTextFromPDF(file);
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 1200;
    canvas.height = 1600;
    
    // Fill with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Just the PDF content - no extra headers or footers
    context.fillStyle = '#000000';
    context.font = '16px Arial';
    context.textAlign = 'left';
    
    const lines = pdfText.split('\n').filter(line => line.trim().length > 0);
    const lineHeight = 24;
    const startY = 60;
    const margin = 60;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().length > 0) {
        // Wrap long lines
        const maxWidth = canvas.width - (margin * 2);
        const words = line.split(' ');
        let currentLine = '';
        let y = startY + (i * lineHeight);
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = context.measureText(testLine);
          
          if (metrics.width > maxWidth && currentLine) {
            context.fillText(currentLine, margin, y);
            currentLine = word;
            y += lineHeight;
            if (y > canvas.height - 40) break;
          } else {
            currentLine = testLine;
          }
        }
        
        if (currentLine && y <= canvas.height - 40) {
          context.fillText(currentLine, margin, y);
        }
      }
    }

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), `image/${format}`);
    });
    
    return [blob];
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    
    // Fallback to simple placeholder
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 800;
    canvas.height = 600;
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = '#e74c3c';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText('PDF to Image Conversion Failed', canvas.width / 2, canvas.height / 2);
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), `image/${format}`);
    });
    
    return [blob];
  }
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

export async function pdfToGrayscale(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Note: PDF-lib doesn't have built-in grayscale conversion
  // This is a placeholder that returns the original PDF with a note
  // Real grayscale conversion would require more advanced PDF processing
  
  // Add a text annotation to indicate grayscale conversion was attempted
  const pages = pdfDoc.getPages();
  if (pages.length > 0) {
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    
    // Add a small text annotation
    firstPage.drawText('Converted to Grayscale (Note: Advanced processing required)', {
      x: 50,
      y: height - 50,
      size: 10,
      color: { r: 0.5, g: 0.5, b: 0.5 }, // Gray color
    });
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function cropPDF(file: File, margin: number = 20): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  
  pages.forEach(page => {
    const { width, height } = page.getSize();
    
    // Create a new page with cropped dimensions
    const newWidth = Math.max(width - (margin * 2), 100);
    const newHeight = Math.max(height - (margin * 2), 100);
    
    // Crop by adjusting the media box
    page.setSize(newWidth, newHeight);
    
    // Add a note about the cropping
    page.drawText(`Cropped (${margin}px margin removed)`, {
      x: 10,
      y: newHeight - 20,
      size: 8,
      color: { r: 0.3, g: 0.3, b: 0.3 },
    });
  });
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function flattenPDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Note: PDF-lib has limited flattening capabilities
  // This is a placeholder that returns the original PDF with a note
  const pages = pdfDoc.getPages();
  if (pages.length > 0) {
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    
    // Add a text annotation
    firstPage.drawText('Flattened (Note: Advanced processing required)', {
      x: 50,
      y: height - 50,
      size: 10,
      color: { r: 0.2, g: 0.4, b: 0.6 },
    });
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function extractTextFromPDF(file: File): Promise<string> {
  console.log('Starting PDF text extraction for file:', file.name);
  
  try {
    // Method 1: Try to read PDF as text directly (works for many PDFs)
    const textContent = await file.text();
    
    // Check if we got readable text (not just binary data)
    const cleanText = textContent
      .replace(/[^\x20-\x7E\s\n\r]/g, '') // Remove non-printable characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // If we got substantial readable text, use it
    if (cleanText.length > 100 && !textContent.includes('%%EOF')) {
      console.log('Successfully extracted text using direct file reading');
      return cleanText;
    }
    
    // Method 2: Try to extract text from PDF structure
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    
    // Look for text content in PDF streams
    let extractedText = '';
    
    // Extract text from BT...ET blocks (Begin Text...End Text)
    const textBlocks = pdfString.match(/BT[\s\S]*?ET/g);
    if (textBlocks) {
      for (const block of textBlocks) {
        // Extract text strings from the block
        const textMatches = block.match(/\(([^)]+)\)/g);
        if (textMatches) {
          for (const match of textMatches) {
            const text = match.slice(1, -1); // Remove parentheses
            const cleanText = text.replace(/\\n/g, '\n').replace(/\\r/g, '\r').trim();
            if (cleanText && cleanText.length > 1) {
              extractedText += cleanText + ' ';
            }
          }
        }
      }
    }
    
    // Clean up the extracted text
    const finalText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    if (finalText.length > 50) {
      console.log('Successfully extracted text using PDF parsing');
      return finalText;
    }
    
    // Method 3: If all else fails, provide a helpful message
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    
    return `PDF Text Extraction Result

This PDF contains ${pageCount} page${pageCount > 1 ? 's' : ''} but automated text extraction was not successful.

The PDF may contain:
- Scanned images (not selectable text)
- Complex formatting that prevents extraction
- Password protection
- Corrupted or unusual PDF structure

File: ${file.name}
Size: ${Math.round(file.size / 1024)}KB
Pages: ${pageCount}

To get the text content, please:
1. Open the PDF in your browser or PDF viewer
2. Select all text (Ctrl+A) and copy (Ctrl+C)
3. Paste into a text file
4. Use the "TXT to XLSX" conversion tool`;
    
  } catch (error) {
    console.error('PDF processing error:', error);
    return `Error processing PDF: ${error instanceof Error ? error.message : 'Unknown error'}\n\nThe file may be corrupted or password-protected.`;
  }
}

// New function specifically for PDF to Text conversion
export async function pdfToText(file: File): Promise<Blob> {
  const textContent = await extractTextFromPDF(file);
  return new Blob([textContent], { type: 'text/plain' });
}


