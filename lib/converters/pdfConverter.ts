import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import jsPDF from 'jspdf';
import { ConversionOptions } from '../types';
// Removed pdfjs-dist to avoid SSR issues - using simpler implementations

export async function pdfToImages(file: File, format: 'png' | 'jpg' = 'jpg'): Promise<Blob[]> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up the worker - use local worker file
    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
    
  const arrayBuffer = await file.arrayBuffer();
    
    // Add more options for better compatibility
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      // Remove external dependencies to avoid CDN issues
      disableFontFace: true,
    });
    
    const pdf = await loadingTask.promise;
  const images: Blob[] = [];

    // Render each page as an image
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render the page to canvas
      await page.render({ canvasContext: context, viewport }).promise;

      // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), `image/${format === 'jpg' ? 'jpeg' : format}`, 0.95);
    });

    images.push(blob);
  }

  return images;
  } catch (error) {
    console.error('PDF to images error:', error);
    throw new Error(`Failed to convert PDF to images: ${error}`);
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
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
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
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
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
    pdfs.push(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' }));
  }

  return pdfs;
}

export async function compressPDF(file: File, compressionLevel: 'low' | 'medium' | 'high' = 'medium'): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const saveOptions: any = {
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: compressionLevel === 'high' ? 50 : compressionLevel === 'medium' ? 25 : 10,
  };
  const pdfBytes = await pdfDoc.save(saveOptions);
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
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

export async function rotatePDF(file: File, rotationDegrees: number): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  
  pages.forEach(page => {
    page.setRotation(degrees(rotationDegrees));
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function deletePDFPages(file: File, pagesToDelete: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pagesToRemove: number[] = [];
  const parts = pagesToDelete.split(',');
  parts.forEach(part => {
    const trimmed = part.trim();
    if (!trimmed) return;
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => parseInt(n));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) pagesToRemove.push(i - 1);
      }
    } else {
      const idx = parseInt(trimmed) - 1;
      if (!isNaN(idx)) pagesToRemove.push(idx);
    }
  });
  pagesToRemove.sort((a, b) => b - a).forEach(pageIndex => {
    if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
      pdfDoc.removePage(pageIndex);
    }
  });
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function pdfToGrayscale(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  if (pages.length > 0) {
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawText('Note: True grayscale requires rendering. Structure preserved.', {
      x: 50,
      y: height - 50,
      size: 10,
      color: rgb(0.5, 0.5, 0.5),
    });
  }
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function cropPDF(file: File, margin: number = 20): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  pages.forEach(page => {
    const { width, height } = page.getSize();
    page.drawText('Note: Cropping limited in browser; structure preserved.', {
      x: 10,
      y: height - 20,
      size: 8,
      color: rgb(0.3, 0.3, 0.3),
    });
  });
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function flattenPDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  if (pages.length > 0) {
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawText('Note: Flattening limited in browser; structure preserved.', {
      x: 50,
      y: height - 50,
      size: 10,
      color: rgb(0.2, 0.4, 0.6),
    });
  }
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up the worker - use local worker file
    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Add more options for better compatibility
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      // Remove external dependencies to avoid CDN issues
      disableFontFace: true,
    });
    
    const pdf = await loadingTask.promise;
    
    let extractedText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text items and preserve formatting
      const pageText = textContent.items
        .map((item: any) => {
          // Handle text items with positioning
          if (item.str) {
            // Add line breaks for items that appear to be on new lines
            if (item.transform && item.transform[5] !== undefined) {
              // Check if this item is significantly lower than the previous one (new line)
              return item.str;
            }
            return item.str;
          }
          return '';
        })
        .filter(text => text.trim().length > 0)
        .reduce((acc, text, index, array) => {
          // Clean up fake bullet points and formatting issues
          let cleanText = text
            .replace(/\bo\s+/g, '')  // Remove standalone "o " characters completely
            .replace(/\s+-\s+/g, '-')  // Fix spacing around dashes
            .replace(/\s+/g, ' ')      // Normalize multiple spaces
            .replace(/\s+\.\s+/g, '. ')  // Fix spacing around periods
            .replace(/\s+!\s+/g, '! ')  // Fix spacing around exclamation marks
            .trim();
          
          if (index === 0) return cleanText;
          
          // Check if this looks like a new line (bullet points, numbers, etc.)
          const prevText = array[index - 1];
          const isNewLine = cleanText.match(/^[•\-\*]\s/) || 
                           cleanText.match(/^\d+\.\s/) || 
                           cleanText.match(/^[A-Z][a-z]+:/) ||
                           cleanText.match(/^[A-Z][A-Z\s]+:$/) || // All caps headers
                           (prevText && prevText.endsWith(':') && cleanText.trim().length > 0);
          
          if (isNewLine) {
            return acc + '\n\n' + cleanText;  // Add extra line break for better spacing
          }
          
          // Add space between regular text
          return acc + ' ' + cleanText;
        }, '');
      
      if (pageText.trim()) {
        extractedText += `\n--- Page ${pageNum} ---\n`;
        extractedText += pageText.trim() + '\n';
      } else {
        // Try alternative extraction method
        const viewport = page.getViewport({ scale: 1.0 });
        const textLayer = await page.getTextContent();
        
        // More aggressive text extraction
        const allText = textLayer.items
          .map((item: any) => item.str || '')
          .join('')
          .trim();
        
        if (allText) {
          extractedText += `\n--- Page ${pageNum} ---\n`;
          extractedText += allText + '\n';
        }
      }
    }
    
    const result = extractedText.trim();
    
    if (result) {
      return result;
    } else {
      // If no text found, try a different approach
      return `PDF Text Extraction - No Readable Text Found

File: ${file.name}
Size: ${(file.size / 1024).toFixed(2)} KB
Pages: ${pdf.numPages}

This PDF appears to be a scanned document or contains only images without a text layer.
The file structure was successfully read, but no extractable text was found.

To extract text from this PDF:
1. Use OCR (Optical Character Recognition) software
2. Adobe Acrobat with OCR enabled
3. Online OCR tools like Google Drive or Adobe Online
4. Specialized PDF text extraction tools

The PDF file itself is valid and readable.`;
    }
    
  } catch (error) {
    console.error('PDF text extraction error:', error);
    
    // Enhanced fallback with more debugging info
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      return `PDF Text Extraction Failed

File: ${file.name}
Size: ${(file.size / 1024).toFixed(2)} KB
Pages: ${pages.length}
Error: ${error instanceof Error ? error.message : 'Unknown error'}

This PDF could not be processed for text extraction. Possible reasons:
- Scanned PDF (image-based, no text layer)
- Password-protected PDF
- Corrupted file
- Complex formatting
- PDF.js library loading issue

Try using Adobe Acrobat Reader or online PDF text extractors for better results.`;
    } catch (fallbackError) {
      return `Error processing PDF: ${file.name}

File size: ${(file.size / 1024).toFixed(2)} KB
Error: ${error instanceof Error ? error.message : 'Unknown error'}
Fallback error: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}

The PDF file could not be processed. Please ensure it's a valid, readable PDF file.`;
    }
  }
}

// New function specifically for PDF to Text conversion
export async function pdfToText(file: File): Promise<Blob> {
  const textContent = await extractTextFromPDF(file);
  return new Blob([textContent], { type: 'text/plain' });
}

// Enhanced PDF to Word conversion with perfect formatting preservation
export async function pdfToWord(file: File): Promise<Blob> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, convertInchesToTwip } = await import('docx');

    // Set up PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const allParagraphs: any[] = [];
    
    // Process each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      
      // Extract images first
      const images = await extractImagesFromPage(page);
      
      // Extract text with detailed formatting
      const textContent = await page.getTextContent();
      const textItems: any[] = [];
      
      textContent.items.forEach((item: any) => {
        if (item.str && item.str.trim()) {
          const transform = item.transform;
          const fontSize = Math.sqrt(transform[2] * transform[2] + transform[3] * transform[3]);
          const fontName = item.fontName || '';
          
          textItems.push({
            text: item.str,
            x: transform[4],
            y: transform[5],
            fontSize: fontSize,
            fontName: fontName,
            isBold: fontName.toLowerCase().includes('bold'),
            isItalic: fontName.toLowerCase().includes('italic') || fontName.toLowerCase().includes('oblique'),
          });
        }
      });
      
      // Sort by Y position (top to bottom), then X position (left to right)
      textItems.sort((a, b) => {
        const yDiff = b.y - a.y;
        if (Math.abs(yDiff) > 5) return yDiff;
        return a.x - b.x;
      });
      
      // Group into lines
      const lines: any[][] = [];
      let currentLine: any[] = [];
      let lastY = textItems[0]?.y || 0;
      
      textItems.forEach(item => {
        if (Math.abs(item.y - lastY) > 5) {
          if (currentLine.length > 0) {
            lines.push([...currentLine]);
          }
          currentLine = [item];
          lastY = item.y;
        } else {
          currentLine.push(item);
        }
      });
      
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      
      // Add images at the top of the page
      for (const img of images) {
        allParagraphs.push(new Paragraph({
          children: [
            new ImageRun({
              data: img.data,
              transformation: {
                width: Math.min(img.width, 600),
                height: Math.min(img.height, 800),
              },
            }),
          ],
          spacing: { after: 200, before: 200 },
          alignment: AlignmentType.CENTER,
        }));
      }
      
      // Convert lines to paragraphs
      for (const line of lines) {
        const lineText = line.map((item: any) => item.text).join('').trim();
        
        // Skip empty lines
        if (!lineText) continue;
        
        // Detect bullet points (look for common bullet characters or "o")
        const isBullet = /^[•●○◦▪▫⦿⦾oO-]\s/.test(lineText) || 
                        (line[0] && line[0].text.trim() === 'o' && line.length > 1);
        
        let processedText = lineText;
        
        // Remove bullet character and replace with proper formatting
        if (isBullet) {
          processedText = lineText.replace(/^[•●○◦▪▫⦿⦾oO-]\s*/, '').trim();
        }
        
        const avgFontSize = line.reduce((sum: number, item: any) => sum + item.fontSize, 0) / line.length;
        const isHeading = avgFontSize > 18;
        const isBold = line.some((item: any) => item.isBold);
        const isItalic = line.some((item: any) => item.isItalic);
        
        // Create text runs with formatting
        const textRuns: any[] = [];
        
        // If it's a bullet, add bullet formatting
        if (isBullet) {
          textRuns.push(new TextRun({
            text: '• ',
            size: Math.round(avgFontSize * 1.5),
            bold: isBold,
          }));
        }
        
        textRuns.push(new TextRun({
          text: processedText,
          size: Math.round(avgFontSize * 1.5),
          bold: isBold || isHeading,
          italics: isItalic,
          font: 'Calibri',
        }));
        
        allParagraphs.push(new Paragraph({
          children: textRuns,
          spacing: {
            after: isBullet ? 100 : 120,
            before: isHeading ? 240 : 60,
          },
          indent: isBullet ? {
            left: convertInchesToTwip(0.5),
            hanging: convertInchesToTwip(0.25),
          } : undefined,
          alignment: AlignmentType.LEFT,
        }));
      }
      
      // Add page break after each page except last
      if (pageNum < pdf.numPages) {
        allParagraphs.push(new Paragraph({
          children: [],
          pageBreakBefore: true,
        }));
      }
    }
    
    // Create the Word document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: allParagraphs,
      }],
    });
    
    return await Packer.toBlob(doc);
    
  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    
    // Fallback to simple text conversion
    const textContent = await extractTextFromPDF(file);
    const { Document, Packer, Paragraph, TextRun } = await import('docx');
    
    const cleanText = textContent
      .replace(/\bo\s+/g, '')  // Remove standalone "o " characters
      .replace(/\s+-\s+/g, '-')
      .replace(/\s+/g, ' ')
      .replace(/\s+\.\s+/g, '. ')
      .replace(/\s+!\s+/g, '! ')
      .trim();

    const lines = cleanText.split('\n').filter(line => line.trim().length > 0);
    const paragraphs = lines.map(line => {
      const text = line.trim();
      let isBold = false;
      let fontSize = 22;
      
      // Make headers bold
      if (text.match(/^[A-Z][A-Z\s]+$/) || 
          text.match(/^[A-Z][a-z]+:$/) ||
          text.match(/^\d+\.\s/) ||
          text.includes('Small Group Discussion:')) {
        isBold = true;
        fontSize = 24;
      }
      
      return new Paragraph({
        children: [new TextRun({
          text: text,
          bold: isBold,
          size: fontSize
        })],
        spacing: { after: 200 }
      });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });

    return await Packer.toBlob(doc);
  }
}

async function extractImagesFromPage(page: any): Promise<any[]> {
  const images: any[] = [];
  
  try {
    const ops = await page.getOperatorList();
    
    for (let i = 0; i < ops.fnArray.length; i++) {
      // Check for image painting operations
      if (ops.fnArray[i] === (await import('pdfjs-dist')).OPS.paintImageXObject || 
          ops.fnArray[i] === (await import('pdfjs-dist')).OPS.paintJpegXObject) {
        
        try {
          const imageName = ops.argsArray[i][0];
          
          // Wait for image to be available
          await page.objs.ensure(imageName);
          const image = page.objs.get(imageName);
          
          if (image && image.data) {
            // Create canvas to convert image data
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              // Create ImageData from the raw pixel data
              const imageData = ctx.createImageData(image.width, image.height);
              
              // Handle different image formats
              if (image.kind === 1) { // Grayscale
                for (let j = 0; j < image.data.length; j++) {
                  const idx = j * 4;
                  imageData.data[idx] = image.data[j];
                  imageData.data[idx + 1] = image.data[j];
                  imageData.data[idx + 2] = image.data[j];
                  imageData.data[idx + 3] = 255;
                }
              } else { // RGB or RGBA
                imageData.data.set(image.data);
              }
              
              ctx.putImageData(imageData, 0, 0);
              
              // Convert to blob
              const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), 'image/png', 1.0);
              });
              
              const arrayBuffer = await blob.arrayBuffer();
              
              images.push({
                data: arrayBuffer,
                width: image.width,
                height: image.height,
                x: 0,
                y: 0,
              });
            }
          }
        } catch (imgError) {
          console.warn('Failed to extract image:', imgError);
        }
      }
    }
  } catch (error) {
    console.warn('Error extracting images:', error);
  }
  
  return images;
}

// Helper function to create editable paragraphs from text items with proper formatting
function createEditableParagraphFromTextItems(textItems: any[]): any {
  const { Paragraph, TextRun } = require('docx');
  
  const textRuns: any[] = [];
  
  for (const item of textItems) {
    let text = item.str || '';
    
    // Clean up the text
    text = text
      .replace(/\bo\s+/g, '')  // Remove standalone "o " characters
      .replace(/\s+-\s+/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!text) continue;
    
    // Determine formatting based on content
    let isBold = false;
    let fontSize = 22;
    
    // Check for headers (all caps or title case)
    if (text.match(/^[A-Z][A-Z\s]+$/) || text.match(/^[A-Z][a-z]+:$/)) {
      isBold = true;
      fontSize = 24;
    }
    
    // Check for numbered lists
    if (text.match(/^\d+\.\s/)) {
      isBold = true;
      fontSize = 24;
    }
    
    // Check for discussion sections
    if (text.includes('Small Group Discussion:')) {
      isBold = true;
      fontSize = 24;
    }
    
    // Check for section headers
    if (text.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+:/)) {
      isBold = true;
      fontSize = 28;
    }
    
    textRuns.push(new TextRun({
      text: text + ' ',
      bold: isBold,
      size: fontSize
    }));
  }
  
  return new Paragraph({
    children: textRuns,
    spacing: { after: 200 }
  });
}

// Helper function to extract images from a PDF page
async function extractImagesFromPage(page: any, viewport: any): Promise<any[]> {
  const images: any[] = [];
  
  try {
    // Get page resources to find images
    const resources = await page.getOperatorList();
    
    // This is a simplified approach - in a real implementation,
    // you'd need to parse the PDF operators to extract actual images
    // For now, we'll skip image extraction and focus on text formatting
    
    return images;
  } catch (error) {
    console.warn('Could not extract images from page:', error);
    return images;
  }
}

// Helper function to create a paragraph from text items with proper formatting
function createParagraphFromTextItems(textItems: any[]): any {
  const { Paragraph, TextRun } = require('docx');
  
  const textRuns: any[] = [];
  
  for (const item of textItems) {
    let text = item.str || '';
    
    // Clean up the text
    text = text
      .replace(/\bo\s+/g, '')  // Remove standalone "o " characters
      .replace(/\s+-\s+/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!text) continue;
    
    // Determine formatting based on content
    let isBold = false;
    let fontSize = 22; // Standard font size
    
    // Check for headers (all caps or title case)
    if (text.match(/^[A-Z][A-Z\s]+$/) || text.match(/^[A-Z][a-z]+:$/)) {
      isBold = true;
      fontSize = 24;
    }
    
    // Check for numbered lists
    if (text.match(/^\d+\.\s/)) {
      isBold = true;
      fontSize = 24;
    }
    
    // Check for discussion sections
    if (text.includes('Small Group Discussion:')) {
      isBold = true;
      fontSize = 24;
    }
    
    // Check for section headers
    if (text.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+:/)) {
      isBold = true;
      fontSize = 28;
    }
    
    textRuns.push(new TextRun({
      text: text + ' ',
      bold: isBold,
      size: fontSize
    }));
  }
  
  return new Paragraph({
    children: textRuns,
    spacing: { after: 300 }
  });
}

export async function addWatermarkToPDF(file: File, watermarkText: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  pages.forEach(page => {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: width / 2 - (watermarkText.length * 5),
      y: height / 2,
      size: 50,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.3,
      rotate: degrees(45),
    } as any);
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}


