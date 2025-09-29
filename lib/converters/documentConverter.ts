import mammoth from 'mammoth';
import jsPDF from 'jspdf';

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
  const html = await docxToHTML(file);
  const doc = new jsPDF();
  doc.html(html, { callback: function (doc) {} });
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
}

export async function textToPDF(text: string): Promise<Blob> {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 10);
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
}

export async function htmlToText(html: string): Promise<string> {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || '';
}

export async function htmlToPDF(html: string): Promise<Blob> {
  const doc = new jsPDF();
  doc.html(html, { callback: function (doc) {} });
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
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
  return htmlToPDF(html);
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

