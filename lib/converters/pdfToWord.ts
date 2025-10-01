import { Document, Paragraph, TextRun, AlignmentType, Packer, convertInchesToTwip } from 'docx';

interface ExtractedText {
  text: string;
  y: number;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
}


export async function pdfToWord(file: File): Promise<Blob> {
  // Ensure we're on the client side
  if (typeof window === 'undefined') {
    throw new Error('PDF to Word conversion can only run in the browser');
  }

  try {
    // Try advanced PDF.js conversion first
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      disableFontFace: true,
      disableCreateObjectURL: true
    });
    const pdf = await loadingTask.promise;
    
    const allParagraphs: Paragraph[] = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
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
    console.error('PDF to Word advanced conversion failed, using fallback:', error);
    
    // Fallback to simple text extraction
    return await createSimpleWordDocument(file);
  }
}

async function createSimpleWordDocument(file: File): Promise<Blob> {
  try {
    // Use the existing extractTextFromPDF function from pdfConverter
    const { extractTextFromPDF } = await import('./pdfConverter');
    const textContent = await extractTextFromPDF(file);
    
    const cleanText = textContent
      .replace(/\bo\s+/g, '• ')  // Convert "o" to proper bullets
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
      let indent = undefined;
      
      // Detect bullet points
      const isBullet = text.startsWith('•') || text.startsWith('-') || text.startsWith('*');
      
      // Make headers bold
      if (text.match(/^[A-Z][A-Z\s]+$/) || 
          text.match(/^[A-Z][a-z]+:$/) ||
          text.match(/^\d+\.\s/) ||
          text.includes('Small Group Discussion:')) {
        isBold = true;
        fontSize = 24;
      }
      
      // Set indentation for bullets
      if (isBullet) {
        indent = {
          left: convertInchesToTwip(0.5),
          hanging: convertInchesToTwip(0.25),
        };
      }
      
      return new Paragraph({
        children: [new TextRun({
          text: text,
          bold: isBold,
          size: fontSize,
          font: 'Calibri',
        })],
        spacing: { after: 200 },
        indent: indent,
      });
    });

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
        children: paragraphs
      }]
    });

    return await Packer.toBlob(doc);
  } catch (fallbackError) {
    console.error('Fallback conversion also failed:', fallbackError);
    throw new Error('PDF to Word conversion failed. Please try a simpler PDF or use a different conversion method.');
  }
}

