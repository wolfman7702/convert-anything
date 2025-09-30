import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import TurndownService from 'turndown';

export async function docxToHTML(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}

export async function docxToText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function docxToPDF(file: File): Promise<Blob> {
  // Convert DOCX to text first to avoid HTML formatting issues
  const text = await docxToText(file);
  
  // Clean up the text formatting
  const cleanText = text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n\n') // Clean up paragraph breaks
    .replace(/^\s+|\s+$/gm, '') // Trim whitespace from start/end of lines
    .trim();
  
  // Create PDF with proper text formatting
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(cleanText, 180);
  
  let yPosition = 20;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  for (const line of lines) {
    if (yPosition + lineHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 15, yPosition);
    yPosition += lineHeight;
  }
  
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
}

export async function textToPDF(text: string): Promise<Blob> {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  
  let yPosition = 20;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  for (const line of lines) {
    if (yPosition + lineHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 15, yPosition);
    yPosition += lineHeight;
  }
  
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
}

export async function htmlToText(html: string): Promise<string> {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || '';
}

export async function htmlToPDF(html: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const doc = new jsPDF();
    doc.html(html, { 
      callback: function (doc) {
        const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
        resolve(blob);
      },
      x: 10,
      y: 10,
      width: 180,
      windowWidth: 650
    });
  });
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

export async function markdownToPDF(markdown: string): Promise<Blob> {
  const html = markdownToHTML(markdown);
  return await htmlToPDF(html);
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

export async function htmlToDOCX(htmlContent: string): Promise<Blob> {
  // Convert HTML to plain text with basic formatting preservation
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(htmlContent);
  
  // Create paragraphs from markdown
  const lines = markdown.split('\n').filter(line => line.trim());
  const paragraphs = lines.map(line => 
    new Paragraph({
      children: [new TextRun(line)]
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs
    }]
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

export async function txtToDOCX(textContent: string): Promise<Blob> {
  const lines = textContent.split('\n');
  const paragraphs = lines.map(line => 
    new Paragraph({
      children: [new TextRun(line)]
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs
    }]
  });

  return await Packer.toBlob(doc);
}

export async function odtToDOCX(file: File): Promise<Blob> {
  // ODT is a zipped XML format - extract and convert text
  const text = await file.text();
  // Simplified: treat as text
  return txtToDOCX(text);
}

export async function rtfToDOCX(file: File): Promise<Blob> {
  // RTF to plain text, then to DOCX
  const rtfContent = await file.text();
  // Strip RTF control codes (basic parsing)
  const plainText = rtfContent.replace(/\\[a-z]+\d*\s?/gi, '').replace(/[{}]/g, '');
  return txtToDOCX(plainText);
}

export async function docxToRTF(file: File): Promise<Blob> {
  // Extract text from DOCX and format as basic RTF
  const text = await docxToText(file);
  const rtfContent = `{\\rtf1\\ansi\\deff0\n${text}\n}`;
  return new Blob([rtfContent], { type: 'application/rtf' });
}

export async function docxToODT(file: File): Promise<Blob> {
  // Simplified: extract text and create basic ODT structure
  const text = await docxToText(file);
  // ODT is complex XML - this is a very basic implementation
  const odtContent = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0">
  <office:body>
    <office:text>
      <text:p>${text}</text:p>
    </office:text>
  </office:body>
</office:document-content>`;
  return new Blob([odtContent], { type: 'application/vnd.oasis.opendocument.text' });
}

