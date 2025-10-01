import { Document, Paragraph, TextRun, AlignmentType, Packer, convertInchesToTwip } from 'docx';
import { setupPDFJS } from '@/lib/pdfSetup';

export async function pdfToWord(file: File): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('This conversion only works in the browser');
  }

  const pdfjsLib = await setupPDFJS();

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  const allParagraphs: Paragraph[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const textItems: any[] = [];
    
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
    
    textItems.sort((a, b) => b.y - a.y);
    
    const lines: any[][] = [];
    let currentLine: any[] = [];
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
    
    for (const line of lines) {
      const lineText = line.map((item: any) => item.text).join('').trim();
      if (!lineText) continue;
      
      const isBullet = /^[•●○◦▪▫⦿⦾oO-]\s/.test(lineText) || 
                      (line[0] && line[0].text.trim() === 'o' && line.length > 1);
      
      let processedText = lineText;
      if (isBullet) {
        processedText = lineText.replace(/^[•●○◦▪▫⦿⦾oO-]\s*/, '').trim();
      }
      
      const avgFontSize = line.reduce((sum: number, item: any) => sum + item.fontSize, 0) / line.length;
      const isHeading = avgFontSize > 18;
      const isBold = line.some((item: any) => item.isBold);
      const isItalic = line.some((item: any) => item.isItalic);
      
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
}