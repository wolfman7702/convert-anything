import { Document, Paragraph, TextRun, ImageRun, AlignmentType, Packer, convertInchesToTwip } from 'docx';

// Import pdfjs dynamically only on client side
let pdfjsLib: any = null;

// Only load PDF.js on the client side
if (typeof window !== 'undefined') {
  import('pdfjs-dist').then((module) => {
    pdfjsLib = module;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  });
}

interface ExtractedText {
  text: string;
  y: number;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
}

interface ExtractedImage {
  data: ArrayBuffer;
  width: number;
  height: number;
}

export async function pdfToWord(file: File): Promise<Blob> {
  // Ensure we're on the client side
  if (typeof window === 'undefined') {
    throw new Error('PDF to Word conversion can only run in the browser');
  }

  // Wait for PDF.js to load
  if (!pdfjsLib) {
    const module = await import('pdfjs-dist');
    pdfjsLib = module;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const allParagraphs: Paragraph[] = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
      // Extract images
      const images = await extractImages(page, pdfjsLib);
      
      // Add images to document
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
      
      // Extract text
      const textContent = await page.getTextContent();
      const textItems: ExtractedText[] = [];
      
      for (const item of textContent.items) {
        const textItem = item as any;
        if (textItem.str && textItem.str.trim()) {
          const transform = textItem.transform;
          const fontSize = Math.sqrt(transform[2] * transform[2] + transform[3] * transform[3]);
          const fontName = textItem.fontName || '';
          
          textItems.push({
            text: textItem.str,
            y: transform[5],
            fontSize: fontSize,
            isBold: fontName.toLowerCase().includes('bold'),
            isItalic: fontName.toLowerCase().includes('italic'),
          });
        }
      }
      
      // Sort by Y position
      textItems.sort((a, b) => b.y - a.y);
      
      // Group into lines
      const lines: ExtractedText[][] = [];
      let currentLine: ExtractedText[] = [];
      let lastY = textItems[0]?.y || 0;
      
      for (const item of textItems) {
        if (Math.abs(item.y - lastY) > 5) {
          if (currentLine.length > 0) {
            lines.push([...currentLine]);
          }
          currentLine = [item];
          lastY = item.y;
        } else {
          currentLine.push(item);
        }
      }
      
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      
      // Convert lines to paragraphs
      for (const line of lines) {
        const lineText = line.map(item => item.text).join('').trim();
        if (!lineText) continue;
        
        // Check if line is a bullet point
        const isBullet = /^[•●○◦▪▫⦿⦾oO-]\s/.test(lineText) || 
                        (line[0] && line[0].text.trim() === 'o' && line.length > 1);
        
        let processedText = lineText;
        if (isBullet) {
          processedText = lineText.replace(/^[•●○◦▪▫⦿⦾oO-]\s*/, '').trim();
        }
        
        const avgFontSize = line.reduce((sum, item) => sum + item.fontSize, 0) / line.length;
        const isHeading = avgFontSize > 18;
        const isBold = line.some(item => item.isBold);
        const isItalic = line.some(item => item.isItalic);
        
        const textRuns: TextRun[] = [];
        
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
      
      // Page break
      if (pageNum < pdf.numPages) {
        allParagraphs.push(new Paragraph({
          children: [],
          pageBreakBefore: true,
        }));
      }
    }
    
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
    console.error('PDF to Word error:', error);
    throw new Error('Failed to convert PDF to Word');
  }
}

async function extractImages(page: any, pdfjs: any): Promise<ExtractedImage[]> {
  const images: ExtractedImage[] = [];
  
  try {
    const ops = await page.getOperatorList();
    
    for (let i = 0; i < ops.fnArray.length; i++) {
      if (ops.fnArray[i] === pdfjs.OPS.paintImageXObject || 
          ops.fnArray[i] === pdfjs.OPS.paintJpegXObject) {
        
        try {
          const imageName = ops.argsArray[i][0];
          await page.objs.ensure(imageName);
          const image = page.objs.get(imageName);
          
          if (image && image.data) {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              const imageData = ctx.createImageData(image.width, image.height);
              
              if (image.kind === 1) {
                for (let j = 0; j < image.data.length; j++) {
                  const idx = j * 4;
                  imageData.data[idx] = image.data[j];
                  imageData.data[idx + 1] = image.data[j];
                  imageData.data[idx + 2] = image.data[j];
                  imageData.data[idx + 3] = 255;
                }
              } else {
                imageData.data.set(image.data);
              }
              
              ctx.putImageData(imageData, 0, 0);
              
              const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), 'image/png', 1.0);
              });
              
              const arrayBuffer = await blob.arrayBuffer();
              
              images.push({
                data: arrayBuffer,
                width: image.width,
                height: image.height,
              });
            }
          }
        } catch (err) {
          console.warn('Failed to extract image:', err);
        }
      }
    }
  } catch (err) {
    console.warn('Error extracting images:', err);
  }
  
  return images;
}
