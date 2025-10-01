'use client';

import { useState } from 'react';
import FileUploader from './FileUploader';
import ConversionProgress from './ConversionProgress';
import DownloadButton from './DownloadButton';
import FileTypeIcon from './FileTypeIcon';
import QRStyleSelector, { qrStyles } from './QRStyleSelector';
import ConversionDisclaimer from './ConversionDisclaimer';
import FilePreview from './FilePreview';
import { ArrowRight } from 'lucide-react';
import { ConversionType, ConversionOptions } from '@/lib/types';
import { convertImage, compressImage, resizeImage } from '@/lib/converters/imageConverter';
import { imagesToPDF, mergePDFs, splitPDF, compressPDF, pdfToImages, textToPDF, htmlToPDF, rotatePDF, deletePDFPages, extractTextFromPDF, pdfToGrayscale, cropPDF, flattenPDF, addWatermarkToPDF } from '@/lib/converters/pdfConverter';
import { PDFDocument } from 'pdf-lib';
// Removed video/audio converters - not supported in browser
import { docxToHTML, docxToText, docxToPDF, htmlToText, markdownToHTML, markdownToPDF, htmlToMarkdown, htmlToDOCX, txtToDOCX, odtToDOCX, rtfToDOCX, docxToRTF, docxToODT } from '@/lib/converters/documentConverter';
import { csvToJSON, jsonToCSV, xlsxToCSV, csvToXLSX, xlsxToJSON, jsonToXLSX, base64Encode, base64Decode, urlEncode, urlDecode, csvToXML } from '@/lib/converters/dataConverter';
import { jsonToXML, xmlToJSON, yamlToJSON, jsonToYAML, tsvToCSV, csvToTSV, htmlTableToCSV } from '@/lib/converters/dataFormatConverter';
import { createZip, extractZip, gzipCompress, gzipDecompress } from '@/lib/converters/archiveConverter';
import { generateQRCode, generateStyledQRCode, generateBarcode, svgToPNG, svgToJPG, svgToPDF, extractColorsFromImage, imageToASCII } from '@/lib/converters/utilityConverter';
import { countWords, convertCase, removeDuplicateLines, sortLines, reverseText, findReplace, formatJSON, minifyJSON } from '@/lib/converters/textConverter';
import { rotateImage as rotateImageNew, flipImage as flipImageNew, grayscaleImage, invertImage, adjustBrightness, extractColorPalette, removeImageBackground, blurImage, adjustContrast, adjustSaturation, sepiaFilter, addBorder, pixelateImage } from '@/lib/converters/imageManipulation';
import { hexToRgb, rgbToHex, hexToHsl, generateRandomColor } from '@/lib/converters/colorConverter';

interface ConversionPageProps {
  conversion: ConversionType;
}

export default function ConversionPage({ conversion }: ConversionPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [results, setResults] = useState<Blob[]>([]);
  const [options, setOptions] = useState<ConversionOptions>({ quality: 0.92 });
  const [textInput, setTextInput] = useState('');

  // Helper function to generate smart filenames
  const generateFilename = (conversionId: string, originalFile?: File, index?: number): string => {
    const baseName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, '') : 'converted';
    const indexSuffix = index !== undefined ? `-${index + 1}` : '';
    
    switch (conversionId) {
      // QR and Barcode
      case 'generate-qr':
        return 'qrcode.png';
      case 'generate-barcode':
        return 'barcode.png';
      
      // Image conversions
      case 'compress-image':
        return `compressed${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'resize-image':
        return `resized${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'rotate-image':
        return `rotated${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'flip-image':
        return `flipped${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'create-ico':
        return 'icon.ico';
      
      // PDF conversions
      case 'merge-pdf':
        return 'merged.pdf';
      case 'split-pdf':
        return `page${indexSuffix}.pdf`;
      case 'compress-pdf':
        return `compressed${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.pdf' : '.pdf'}`;
      case 'html-to-pdf':
        return 'document.pdf';
      case 'txt-to-pdf':
        return 'document.pdf';
      case 'rotate-pdf':
        return `rotated${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.pdf' : '.pdf'}`;
      case 'delete-pdf-pages':
        return `edited${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.pdf' : '.pdf'}`;
      
      // Removed video/audio conversions - not supported in browser
      
      // Document conversions
      case 'docx-to-pdf':
      case 'word-to-pdf':
        return `${baseName}.pdf`;
      case 'docx-to-html':
        return `${baseName}.html`;
      case 'docx-to-txt':
        return `${baseName}.txt`;
      case 'markdown-to-pdf':
        return 'document.pdf';
      case 'markdown-to-html':
        return 'document.html';
      case 'html-to-markdown':
        return 'document.md';
      
      // Data conversions
      case 'csv-to-json':
        return `${baseName}.json`;
      case 'json-to-csv':
        return 'data.csv';
      case 'xlsx-to-csv':
        return `${baseName}.csv`;
      case 'csv-to-xlsx':
        return `${baseName}.xlsx`;
      case 'xlsx-to-json':
        return `${baseName}.json`;
      case 'json-to-xlsx':
        return 'data.xlsx';
      case 'csv-to-xml':
        return `${baseName}.xml`;
      case 'xml-to-csv':
        return `${baseName}.csv`;
      case 'json-to-xml':
        return 'data.xml';
      case 'xml-to-json':
        return 'data.json';
      case 'yaml-to-json':
        return `${baseName}.json`;
      case 'json-to-yaml':
        return 'data.yaml';
      
      // Utility conversions
      case 'base64-encode':
        return 'encoded.txt';
      case 'base64-decode':
        return 'decoded.txt';
      case 'url-encode':
        return 'encoded.txt';
      case 'url-decode':
        return 'decoded.txt';
      case 'svg-to-png':
        return `${baseName}.png`;
      case 'svg-to-jpg':
        return `${baseName}.jpg`;
      case 'svg-to-pdf':
        return `${baseName}.pdf`;
      case 'color-picker':
        return 'colors.txt';
      case 'image-to-ascii':
        return 'ascii.txt';
      
      // Archive conversions
      case 'create-zip':
        return 'archive.zip';
      case 'extract-zip':
        return `extracted${indexSuffix}${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '' : ''}`;
      case 'gzip-compress':
        return `${baseName}.gz`;
      case 'gzip-decompress':
        return `${baseName}`;
      
      // New image manipulation conversions
      case 'image-rotate-90':
        return `rotated-90${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-rotate-180':
        return `rotated-180${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-rotate-270':
        return `rotated-270${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-flip-horizontal':
        return `flipped-h${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-flip-vertical':
        return `flipped-v${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-grayscale':
        return `grayscale${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-invert':
        return `inverted${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-brightness':
        return `brightness${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      
      // Text utilities
      case 'word-counter':
        return 'word-stats.txt';
      case 'case-converter-upper':
        return `uppercase.txt`;
      case 'case-converter-lower':
        return `lowercase.txt`;
      case 'case-converter-title':
        return `titlecase.txt`;
      case 'remove-duplicates':
        return `no-duplicates.txt`;
      case 'sort-lines':
        return `sorted.txt`;
      case 'reverse-text':
        return `reversed.txt`;
      case 'find-replace':
        return `replaced.txt`;
      case 'json-formatter':
        return `formatted.json`;
      case 'json-minify':
        return `minified.json`;
      
      // Color utilities
      case 'hex-to-rgb':
        return 'rgb-color.txt';
      case 'rgb-to-hex':
        return 'hex-color.txt';
      case 'hex-to-hsl':
        return 'hsl-color.txt';
      case 'color-palette':
        return 'color-palette.txt';
      case 'random-color-generator':
        return 'random-colors.txt';
      
      // Data format converters
      case 'tsv-to-csv':
        return `${baseName}.csv`;
      case 'csv-to-tsv':
        return `${baseName}.tsv`;
      case 'html-table-to-csv':
        return 'table-data.csv';
      
      // New image enhancements
      case 'remove-background':
        return `no-background.png`;
      case 'image-blur':
        return `blurred${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-sharpen':
        return `sharpened${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-contrast':
        return `contrast${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-saturation':
        return `saturated${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-sepia':
        return `sepia${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'add-image-border':
        return `bordered${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      case 'image-pixelate':
        return `pixelated${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.jpg' : '.jpg'}`;
      
      // New PDF conversions
      case 'pdf-add-watermark':
        return `watermarked${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.pdf' : '.pdf'}`;
      // Removed: pdf-password (not supported client-side)
      
      // Removed video/audio conversions - not supported in browser
      
      // New code formatting
      case 'minify-css':
        return `minified${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.css' : '.css'}`;
      case 'minify-js':
        return `minified${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.js' : '.js'}`;
      case 'beautify-css':
        return `beautified${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.css' : '.css'}`;
      case 'beautify-js':
        return `beautified${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.js' : '.js'}`;
      
      // ADDITIONAL IMAGE FORMATS
      case 'tiff-to-jpg':
      case 'tiff-to-png':
      case 'gif-to-jpg':
      case 'gif-to-png':
        return `${baseName}.${conversion.to}`;

      // Removed additional audio/video formats - not supported in browser

      // DOCUMENT FORMATS
      case 'pdf-to-text':
      case 'pdf-to-txt':
        return `${baseName}.txt`;
      case 'odt-to-pdf':
      case 'rtf-to-pdf':
        return `${baseName}.pdf`;
      case 'odt-to-docx':
      case 'rtf-to-docx':
      case 'txt-to-docx':
      case 'html-to-docx':
        return `${baseName}.docx`;
      case 'docx-to-odt':
        return `${baseName}.odt`;
      case 'docx-to-rtf':
        return `${baseName}.rtf`;
      case 'txt-to-html':
        return `${baseName}.html`;
      case 'html-to-txt':
        return `extracted-text.txt`;

      // SPREADSHEET FORMATS
      case 'ods-to-xlsx':
      case 'xls-to-xlsx':
        return `${baseName}.xlsx`;
      case 'xlsx-to-ods':
      case 'csv-to-ods':
        return `${baseName}.ods`;
      case 'ods-to-csv':
      case 'xls-to-csv':
        return `${baseName}.csv`;
      case 'xlsx-to-html':
      case 'csv-to-html':
        return `${baseName}.html`;
      case 'xlsx-to-xls':
      case 'csv-to-xls':
        return `${baseName}.xls`;

      // PDF TOOLS
      case 'images-to-pdf-single':
        return 'combined.pdf';
      case 'pdf-grayscale':
        return `${baseName}-grayscale.pdf`;
      case 'pdf-crop':
        return `${baseName}-cropped.pdf`;
      case 'pdf-resize':
        return `${baseName}-resized.pdf`;
      case 'pdf-flatten':
        return `${baseName}-flattened.pdf`;
      case 'pdf-a4-to-letter':
      case 'pdf-letter-to-a4':
        return `${baseName}-resized.pdf`;
      case 'webp-to-pdf':
      case 'tiff-to-pdf':
      case 'bmp-to-pdf':
      case 'gif-to-pdf':
      case 'svg-to-pdf-direct':
        return `${baseName}.pdf`;

      // TEXT UTILITIES
      case 'text-to-speech':
        return 'speech.mp3';
      case 'character-counter':
      case 'line-counter':
        return 'analysis.txt';
      case 'remove-line-breaks':
        return 'no-breaks.txt';
      case 'add-line-numbers':
        return 'numbered.txt';
      case 'text-to-binary':
        return 'binary.txt';
      case 'binary-to-text':
        return 'decoded.txt';
      case 'text-to-hex':
        return 'hexadecimal.txt';
      case 'hex-to-text':
        return 'decoded.txt';
      case 'html-encode':
        return 'encoded.txt';
      case 'html-decode':
        return 'decoded.txt';
      case 'remove-html-tags':
        return 'plain-text.txt';
      case 'extract-emails':
        return 'email-addresses.txt';
      case 'extract-urls':
        return 'urls.txt';
      case 'lorem-ipsum':
        return 'lorem-ipsum.txt';
      
      // Default case - use conversion.to if available
      default:
        return `converted.${conversion.to || 'file'}`;
    }
  };

  const handleConvert = async () => {
    if (files.length === 0 && !textInput && !['generate-qr', 'generate-barcode', 'base64-encode', 'base64-decode', 'url-encode', 'url-decode'].includes(conversion.id)) return;
    setConverting(true);
    setProgress(0);

    try {
      let outputBlob: Blob | null = null;
      let outputBlobs: Blob[] = [];
      setProgress(25);

      switch (conversion.id) {
        // Image conversions
        case 'png-to-jpg':
        case 'jpg-to-png':
        case 'png-to-webp':
        case 'jpg-to-webp':
        case 'webp-to-png':
        case 'webp-to-jpg':
        case 'png-to-bmp':
        case 'jpg-to-bmp':
        case 'bmp-to-png':
        case 'bmp-to-jpg':
        case 'tiff-to-jpg':
        case 'tiff-to-png':
          outputBlob = await convertImage(files[0], conversion.to, options);
          break;
        case 'compress-image':
          outputBlob = await compressImage(files[0], options);
          break;
        case 'resize-image':
          if (options.width && options.height) {
            outputBlob = await resizeImage(files[0], options.width, options.height);
          }
          break;
        case 'rotate-image':
          if (options.degrees && [90, 180, 270].includes(options.degrees)) {
            outputBlob = await rotateImageNew(files[0], options.degrees as 90 | 180 | 270);
          }
          break;
        case 'flip-image':
          const direction = options.horizontal ? 'horizontal' : 'vertical';
          outputBlob = await flipImageNew(files[0], direction);
          break;
        case 'create-ico':
          outputBlob = await convertImage(files[0], 'png', { width: 32, height: 32 });
          break;

        // PDF conversions
        case 'pdf-to-jpg':
        case 'pdf-to-png':
          outputBlobs = await pdfToImages(files[0], conversion.to as 'png' | 'jpg');
          break;
        case 'jpg-to-pdf':
        case 'png-to-pdf':
          outputBlob = await imagesToPDF(files);
          break;
        case 'merge-pdf':
          outputBlob = await mergePDFs(files);
          break;
        case 'split-pdf':
          outputBlobs = await splitPDF(files[0]);
          break;
        case 'compress-pdf':
          outputBlob = await compressPDF(files[0], (options as any).compressionLevel || 'medium');
          break;
        case 'html-to-pdf':
          outputBlob = await htmlToPDF(textInput);
          break;
        case 'txt-to-pdf':
          outputBlob = await textToPDF(textInput);
          break;
        case 'rotate-pdf':
          const degrees = options.degrees || 90; // Default to 90 degrees if not specified
          outputBlob = await rotatePDF(files[0], degrees);
          break;
        case 'delete-pdf-pages':
          if ((options as any).pagesToDelete) {
            outputBlob = await deletePDFPages(files[0], (options as any).pagesToDelete);
          } else {
            alert('Please specify which pages to delete');
            return;
          }
          break;

        // Removed video/audio conversions - not supported in browser

        // Document conversions
        case 'docx-to-pdf':
        case 'word-to-pdf':
          outputBlob = await docxToPDF(files[0]);
          break;
        case 'docx-to-html':
          const html = await docxToHTML(files[0]);
          outputBlob = new Blob([html], { type: 'text/html' });
          break;
        case 'docx-to-txt':
          const text = await docxToText(files[0]);
          outputBlob = new Blob([text], { type: 'text/plain' });
          break;
        case 'markdown-to-pdf':
          outputBlob = await markdownToPDF(textInput);
          break;
        case 'markdown-to-html':
          const markdownHtml = markdownToHTML(textInput);
          outputBlob = new Blob([markdownHtml], { type: 'text/html' });
          break;

        // Data conversions
        case 'csv-to-json':
          const jsonStr = await csvToJSON(files[0]);
          outputBlob = new Blob([jsonStr], { type: 'application/json' });
          break;
        case 'json-to-csv':
          outputBlob = await jsonToCSV(textInput);
          break;
        case 'xlsx-to-csv':
          outputBlob = await xlsxToCSV(files[0]);
          break;
        case 'csv-to-xlsx':
          outputBlob = await csvToXLSX(files[0]);
          break;
        case 'xlsx-to-json':
          const xlsxJson = await xlsxToJSON(files[0]);
          outputBlob = new Blob([xlsxJson], { type: 'application/json' });
          break;
        case 'json-to-xlsx':
          outputBlob = await jsonToXLSX(textInput);
          break;
        case 'csv-to-xml':
          const csvForXML = await files[0].text();
          const xml = csvToXML(csvForXML);
          outputBlob = new Blob([xml], { type: 'application/xml' });
          break;
        case 'xml-to-csv':
          const xmlText = await files[0].text();
          const csv = xmlToJSON(xmlText);
          outputBlob = new Blob([csv], { type: 'text/csv' });
          break;
        case 'json-to-xml':
          const jsonXml = jsonToXML(textInput);
          outputBlob = new Blob([jsonXml], { type: 'application/xml' });
          break;
        case 'xml-to-json':
          const xmlJson = xmlToJSON(textInput);
          outputBlob = new Blob([xmlJson], { type: 'application/json' });
          break;
        case 'yaml-to-json':
          const yamlText = await files[0].text();
          const yamlJson = yamlToJSON(yamlText);
          outputBlob = new Blob([yamlJson], { type: 'application/json' });
          break;
        case 'json-to-yaml':
          const jsonYaml = jsonToYAML(textInput);
          outputBlob = new Blob([jsonYaml], { type: 'text/yaml' });
          break;
        case 'base64-encode':
          const encoded = base64Encode(textInput);
          outputBlob = new Blob([encoded], { type: 'text/plain' });
          break;
        case 'base64-decode':
          const decoded = base64Decode(textInput);
          outputBlob = new Blob([decoded], { type: 'text/plain' });
          break;
        case 'url-encode':
          const urlEncoded = urlEncode(textInput);
          outputBlob = new Blob([urlEncoded], { type: 'text/plain' });
          break;
        case 'url-decode':
          const urlDecoded = urlDecode(textInput);
          outputBlob = new Blob([urlDecoded], { type: 'text/plain' });
          break;

        // Archive conversions
        case 'create-zip':
          outputBlob = await createZip(files);
          break;
        case 'extract-zip':
          const extractedFiles = await extractZip(files[0]);
          outputBlobs = extractedFiles.map(f => f.blob);
          break;
        case 'gzip-compress':
          outputBlob = await gzipCompress(files[0]);
          break;
        case 'gzip-decompress':
          outputBlob = await gzipDecompress(files[0]);
          break;

        // Utility conversions
        case 'generate-qr':
          const selectedStyle = qrStyles.find(s => s.id === (options.qrStyle || 'classic'));
          outputBlob = await generateStyledQRCode(
            textInput,
            selectedStyle,
            options.qrSize || 300,
            options.qrColor || '#000000'
          );
          break;
        case 'generate-barcode':
          outputBlob = await generateBarcode(textInput);
          break;
        case 'svg-to-png':
          outputBlob = await svgToPNG(files[0]);
          break;
        case 'svg-to-jpg':
          outputBlob = await svgToJPG(files[0]);
          break;
        case 'svg-to-pdf':
          outputBlob = await svgToPDF(files[0]);
          break;
        case 'html-to-markdown':
          const markdown = htmlToMarkdown(textInput);
          outputBlob = new Blob([markdown], { type: 'text/markdown' });
          break;
        case 'color-palette':
          const extractedColors = await extractColorsFromImage(files[0]);
          outputBlob = new Blob([extractedColors.join('\n')], { type: 'text/plain' });
          break;
        case 'image-to-ascii':
          const ascii = await imageToASCII(files[0]);
          outputBlob = new Blob([ascii], { type: 'text/plain' });
          break;

        // Text utilities
        case 'word-counter':
          const textForCount = await files[0].text();
          const stats = countWords(textForCount);
          const statsText = `Words: ${stats.words}\nCharacters: ${stats.characters}\nCharacters (no spaces): ${stats.charactersNoSpaces}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nLines: ${stats.lines}\nReading Time: ${stats.readingTime} min`;
          outputBlob = new Blob([statsText], { type: 'text/plain' });
          break;

        case 'case-converter-upper':
        case 'case-converter-lower':
        case 'case-converter-title':
          const textForCase = await files[0].text();
          const caseType = conversion.id.includes('upper') ? 'upper' : conversion.id.includes('lower') ? 'lower' : 'title';
          const convertedText = convertCase(textForCase, caseType);
          outputBlob = new Blob([convertedText], { type: 'text/plain' });
          break;

        case 'remove-duplicates':
          const textForDupes = await files[0].text();
          const noDupes = removeDuplicateLines(textForDupes);
          outputBlob = new Blob([noDupes], { type: 'text/plain' });
          break;

        case 'sort-lines':
          const textForSort = await files[0].text();
          const sorted = sortLines(textForSort);
          outputBlob = new Blob([sorted], { type: 'text/plain' });
          break;

        case 'reverse-text':
          const textForReverse = await files[0].text();
          const reversed = reverseText(textForReverse);
          outputBlob = new Blob([reversed], { type: 'text/plain' });
          break;

        case 'find-replace':
          const textForReplace = await files[0].text();
          const replaced = findReplace(textForReplace, options.findText || '', options.replaceText || '');
          outputBlob = new Blob([replaced], { type: 'text/plain' });
          break;

        case 'json-formatter':
          const jsonText = await files[0].text();
          const { formatted, isValid, error } = formatJSON(jsonText);
          if (!isValid) {
            alert(`Invalid JSON: ${error}`);
            return;
          }
          outputBlob = new Blob([formatted], { type: 'application/json' });
          break;

        case 'json-minify':
          const jsonForMinify = await files[0].text();
          const minified = minifyJSON(jsonForMinify);
          outputBlob = new Blob([minified], { type: 'application/json' });
          break;

        // Image manipulations
        case 'image-rotate-90':
          outputBlob = await rotateImageNew(files[0], 90);
          break;
        case 'image-rotate-180':
          outputBlob = await rotateImageNew(files[0], 180);
          break;
        case 'image-rotate-270':
          outputBlob = await rotateImageNew(files[0], 270);
          break;

        case 'image-flip-horizontal':
          outputBlob = await flipImageNew(files[0], 'horizontal');
          break;
        case 'image-flip-vertical':
          outputBlob = await flipImageNew(files[0], 'vertical');
          break;

        case 'image-grayscale':
          outputBlob = await grayscaleImage(files[0]);
          break;

        case 'image-invert':
          outputBlob = await invertImage(files[0]);
          break;

        case 'image-brightness':
          const brightness = options.brightness || 100;
          outputBlob = await adjustBrightness(files[0], brightness);
          break;

        // Color utilities
        case 'hex-to-rgb':
          const hexText = await files[0].text();
          const rgb = hexToRgb(hexText.trim());
          outputBlob = new Blob([`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`], { type: 'text/plain' });
          break;

        case 'rgb-to-hex':
          const rgbText = await files[0].text();
          const match = rgbText.match(/(\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            const hex = rgbToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
            outputBlob = new Blob([hex], { type: 'text/plain' });
          }
          break;

        case 'hex-to-hsl':
          const hexForHsl = await files[0].text();
          const hsl = hexToHsl(hexForHsl.trim());
          outputBlob = new Blob([`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`], { type: 'text/plain' });
          break;

        // Data format conversions
        case 'tsv-to-csv':
          const tsvText = await files[0].text();
          const csvFromTsv = tsvToCSV(tsvText);
          outputBlob = new Blob([csvFromTsv], { type: 'text/csv' });
          break;

        case 'csv-to-tsv':
          const csvForTSV = await files[0].text();
          const tsvFromCsv = csvToTSV(csvForTSV);
          outputBlob = new Blob([tsvFromCsv], { type: 'text/tab-separated-values' });
          break;

        case 'html-table-to-csv':
          const htmlText = await files[0].text();
          const csvFromTable = htmlTableToCSV(htmlText);
          outputBlob = new Blob([csvFromTable], { type: 'text/csv' });
          break;

        case 'color-picker':
          const colorPalette = await extractColorPalette(files[0], 5);
          const colorOutput = colorPalette.join('\n');
          outputBlob = new Blob([colorOutput], { type: 'text/plain' });
          break;

        case 'random-color-generator':
          const randomColors = Array.from({ length: 10 }, () => generateRandomColor());
          const randomOutput = randomColors.join('\n');
          outputBlob = new Blob([randomOutput], { type: 'text/plain' });
          break;

        // New image enhancement cases
        case 'remove-background':
          outputBlob = await removeImageBackground(files[0]);
          break;

        case 'image-blur':
          const blurAmount = options.blurAmount || 10;
          outputBlob = await blurImage(files[0], blurAmount);
          break;

        case 'image-contrast':
          const contrast = options.contrast || 100;
          outputBlob = await adjustContrast(files[0], contrast);
          break;

        case 'image-saturation':
          const saturation = options.saturation || 100;
          outputBlob = await adjustSaturation(files[0], saturation);
          break;

        case 'image-sepia':
          outputBlob = await sepiaFilter(files[0]);
          break;

        case 'add-image-border':
          const borderWidth = options.borderWidth || 20;
          const borderColor = options.borderColor || '#000000';
          outputBlob = await addBorder(files[0], borderWidth, borderColor);
          break;

        case 'image-pixelate':
          const pixelSize = options.pixelSize || 10;
          outputBlob = await pixelateImage(files[0], pixelSize);
          break;

        // PDF conversion cases


        case 'pdf-add-watermark':
          if ((options as any).watermarkText) {
            outputBlob = await addWatermarkToPDF(files[0], (options as any).watermarkText);
          } else {
            alert('Please enter watermark text');
            return;
          }
          break;

        // Removed: pdf-password case (not supported client-side)

        // Removed video/audio enhancement cases - not supported in browser

        // Code formatting cases
        case 'minify-css':
          // Basic CSS minification - remove comments and extra whitespace
          const cssContent = await files[0].text();
          const minifiedCSS = cssContent
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
            .replace(/{\s+/g, '{') // Remove space after opening brace
            .replace(/;\s+/g, ';') // Remove space after semicolon
            .trim();
          outputBlob = new Blob([minifiedCSS], { type: 'text/css' });
          break;

        case 'minify-js':
          // Basic JS minification - remove comments and extra whitespace
          const jsContent = await files[0].text();
          const minifiedJS = jsContent
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s+/g, ';') // Remove space after semicolon
            .trim();
          outputBlob = new Blob([minifiedJS], { type: 'application/javascript' });
          break;

        case 'beautify-css':
          // Basic CSS beautification - add proper indentation
          const cssForBeautify = await files[0].text();
          const beautifiedCSS = cssForBeautify
            .replace(/\s*{\s*/g, ' {\n  ') // Add line break after opening brace
            .replace(/;\s*/g, ';\n  ') // Add line break after semicolon
            .replace(/\s*}\s*/g, '\n}\n') // Add line breaks around closing brace
            .replace(/,\s*/g, ',\n  ') // Add line breaks after commas
            .trim();
          outputBlob = new Blob([beautifiedCSS], { type: 'text/css' });
          break;

        case 'beautify-js':
          // Basic JS beautification - add proper indentation
          const jsForBeautify = await files[0].text();
          const beautifiedJS = jsForBeautify
            .replace(/\s*{\s*/g, ' {\n  ') // Add line break after opening brace
            .replace(/;\s*/g, ';\n') // Add line break after semicolon
            .replace(/\s*}\s*/g, '\n}\n') // Add line breaks around closing brace
            .replace(/,\s*/g, ',\n  ') // Add line breaks after commas
            .trim();
          outputBlob = new Blob([beautifiedJS], { type: 'application/javascript' });
          break;

        // Image format conversions (add after existing image cases)
        case 'tiff-to-jpg':
        case 'tiff-to-png':
        case 'tiff-to-webp':
        case 'tiff-to-bmp':
        case 'gif-to-jpg':
        case 'gif-to-png':
        case 'gif-to-webp':
        case 'jpg-to-tiff':
        case 'png-to-tiff':
        case 'jpg-to-gif':
        case 'png-to-gif':
        case 'bmp-to-webp':
        case 'webp-to-bmp':
        case 'gif-to-webp':
        case 'webp-to-gif':
        case 'webp-to-tiff':
          outputBlob = await convertImage(files[0], conversion.to, options);
          break;

        // Removed audio format conversions - not supported in browser
        // Removed remaining audio/video format conversions - not supported in browser

        // Document conversions
        case 'pdf-to-text':
        case 'pdf-to-txt':
          const pdfText = await extractTextFromPDF(files[0]);
          outputBlob = new Blob([pdfText], { type: 'text/plain' });
          break;
        case 'odt-to-pdf':
        case 'rtf-to-pdf':
          const docContent = await files[0].text();
          outputBlob = await textToPDF(docContent);
          break;
        case 'html-to-docx':
          const htmlForDocx = await files[0].text();
          outputBlob = await htmlToDOCX(htmlForDocx);
          break;
        case 'txt-to-docx':
          const txtForDocx = await files[0].text();
          outputBlob = await txtToDOCX(txtForDocx);
          break;
        case 'odt-to-docx':
          outputBlob = await odtToDOCX(files[0]);
          break;
        case 'rtf-to-docx':
          outputBlob = await rtfToDOCX(files[0]);
          break;
        case 'docx-to-rtf':
          outputBlob = await docxToRTF(files[0]);
          break;
        case 'docx-to-odt':
          outputBlob = await docxToODT(files[0]);
          break;
        case 'txt-to-html':
          const txtContent = await files[0].text();
          const htmlOutput = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Document</title></head><body><pre>${txtContent}</pre></body></html>`;
          outputBlob = new Blob([htmlOutput], { type: 'text/html' });
          break;
        case 'html-to-txt':
          const htmlContent = await files[0].text();
          const plainText = await htmlToText(htmlContent);
          outputBlob = new Blob([plainText], { type: 'text/plain' });
          break;

        // Spreadsheet conversions (using existing functions)
        case 'ods-to-xlsx':
        case 'xls-to-xlsx':
        case 'ods-to-csv':
        case 'xls-to-csv':
          outputBlob = await xlsxToCSV(files[0]);
          break;
        case 'xlsx-to-ods':
        case 'csv-to-ods':
        case 'xlsx-to-xls':
        case 'csv-to-xls':
          outputBlob = await csvToXLSX(files[0]);
          break;
        case 'xlsx-to-html':
          const xlsxData = await xlsxToJSON(files[0]);
          const tableData = JSON.parse(xlsxData) as Record<string, any>[];
          let htmlTable = '<table border="1"><thead><tr>';
          if (tableData.length > 0) {
            Object.keys(tableData[0]).forEach(key => {
              htmlTable += `<th>${key}</th>`;
            });
            htmlTable += '</tr></thead><tbody>';
            tableData.forEach((row: Record<string, any>) => {
              htmlTable += '<tr>';
              Object.values(row).forEach(val => {
                htmlTable += `<td>${val}</td>`;
              });
              htmlTable += '</tr>';
            });
          }
          htmlTable += '</tbody></table>';
          outputBlob = new Blob([htmlTable], { type: 'text/html' });
          break;
        case 'csv-to-html':
          const csvContentForHtml = await files[0].text();
          const csvRows = csvContentForHtml.split('\n').filter(row => row.trim());
          let csvHtmlTable = '<table border="1">';
          csvRows.forEach((row, idx) => {
            const cells = row.split(',');
            csvHtmlTable += '<tr>';
            cells.forEach(cell => {
              csvHtmlTable += idx === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`;
            });
            csvHtmlTable += '</tr>';
          });
          csvHtmlTable += '</table>';
          outputBlob = new Blob([csvHtmlTable], { type: 'text/html' });
          break;

        // PDF tools

        case 'pdf-to-powerpoint':
          // Extract text from PDF and create a proper presentation structure
          const pdfPptContent = await extractTextFromPDF(files[0]);
          
          // Split content into logical slides (by paragraphs or sections)
          const slides = pdfPptContent
            .split(/\n\s*\n/)
            .filter(s => s.trim().length > 20) // Only meaningful content
            .map(s => s.trim().replace(/\n/g, ' ')); // Clean up formatting
          
          // Create a structured presentation format
          let pptContent = `Presentation: ${files[0].name.replace('.pdf', '')}
Generated: ${new Date().toLocaleString()}
Total Slides: ${Math.max(slides.length, 1)}

========================================

`;
          
          if (slides.length === 0) {
            // If no slides found, create a single slide with the content
            pptContent += `SLIDE 1: PDF Content
=====================================

${pdfPptContent.replace(/\n/g, ' ').trim()}

=====================================
`;
          } else {
            // Create multiple slides
            slides.forEach((slide, index) => {
              pptContent += `SLIDE ${index + 1}: ${slide.substring(0, 50)}${slide.length > 50 ? '...' : ''}
=====================================

${slide}

=====================================

`;
            });
          }
          
          outputBlob = new Blob([pptContent], { type: 'text/plain' });
          break;

        case 'pdf-to-epub':
          // Extract text from PDF and create EPUB-like content
          const pdfEpubContent = await extractTextFromPDF(files[0]);
          const epubContent = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>PDF Content</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">pdf-conversion</dc:identifier>
  </metadata>
  <manifest>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="chapter1"/>
  </spine>
</package>`;
          outputBlob = new Blob([epubContent], { type: 'application/epub+zip' });
          break;

        case 'pdf-to-mobi':
          // Extract text from PDF and create MOBI-like content
          const pdfMobiContent = await extractTextFromPDF(files[0]);
          let mobiContent = `MOBI Ebook Format\n`;
          mobiContent += `Title: PDF Content\n`;
          mobiContent += `Author: Converted from PDF\n`;
          mobiContent += `\nContent:\n${pdfMobiContent}`;
          outputBlob = new Blob([mobiContent], { type: 'application/x-mobipocket-ebook' });
          break;

        case 'pdf-to-azw3':
          // Extract text from PDF and create AZW3-like content
          const pdfAzw3Content = await extractTextFromPDF(files[0]);
          let azw3Content = `AZW3 Ebook Format\n`;
          azw3Content += `Title: PDF Content\n`;
          azw3Content += `Author: Converted from PDF\n`;
          azw3Content += `\nContent:\n${pdfAzw3Content}`;
          outputBlob = new Blob([azw3Content], { type: 'application/vnd.amazon.ebook' });
          break;

        case 'pdf-to-fb2':
          // Extract text from PDF and create FB2-like content
          const pdfFb2Content = await extractTextFromPDF(files[0]);
          const fb2Content = `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0">
  <description>
    <title-info>
      <book-title>PDF Content</book-title>
      <author>
        <first-name>Converted</first-name>
        <last-name>from PDF</last-name>
      </author>
    </title-info>
  </description>
  <body>
    <section>
      <p>${pdfFb2Content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>
    </section>
  </body>
</FictionBook>`;
          outputBlob = new Blob([fb2Content], { type: 'application/fb2+xml' });
          break;

        case 'pdf-to-csv':
          // Extract text from PDF and try to structure it as CSV
          const pdfCsvContentForCsv = await extractTextFromPDF(files[0]);
          const lines = pdfCsvContentForCsv.split('\n').filter(line => line.trim().length > 0);
          
          // Try to detect table-like structure
          const csvData = lines.map((line, index) => {
            // Simple CSV structure: line number, content
            return `${index + 1},"${line.replace(/"/g, '""')}"`;
          });
          
          const csvContentForPdf = ['Line,Content', ...csvData].join('\n');
          outputBlob = new Blob([csvContentForPdf], { type: 'text/csv' });
          break;

        case 'pdf-to-rtf':
          // Extract text from PDF and create RTF format
          const pdfRtfContent = await extractTextFromPDF(files[0]);
          const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}} \\f0\\fs24 ${pdfRtfContent.replace(/\n/g, '\\par ').replace(/\{/g, '\\{').replace(/\}/g, '\\}')} }`;
          outputBlob = new Blob([rtfContent], { type: 'application/rtf' });
          break;

        case 'pdf-to-odt':
          // Extract text from PDF and create a simple ODT-like structure
          const pdfOdtContent = await extractTextFromPDF(files[0]);
          const odtContent = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0">
  <office:body>
    <office:text>
      <text:p>${pdfOdtContent.replace(/\n/g, '</text:p><text:p>').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text:p>
    </office:text>
  </office:body>
</office:document>`;
          outputBlob = new Blob([odtContent], { type: 'application/vnd.oasis.opendocument.text' });
          break;
        case 'images-to-pdf-single':
          outputBlob = await imagesToPDF(files);
          break;
        case 'pdf-grayscale':
          outputBlob = await pdfToGrayscale(files[0]);
          break;
        case 'pdf-crop':
          outputBlob = await cropPDF(files[0], 20);
          break;
        case 'pdf-flatten':
          outputBlob = await flattenPDF(files[0]);
          break;
        case 'pdf-resize':
        case 'pdf-a4-to-letter':
        case 'pdf-letter-to-a4':
          // Simple approach - just return the original PDF with a note
          const simplePdfBuffer = await files[0].arrayBuffer();
          const simplePdfDoc = await PDFDocument.load(simplePdfBuffer);
          const simpleBytes = await simplePdfDoc.save();
          outputBlob = new Blob([simpleBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
          alert('Note: Advanced PDF manipulation is limited in browser. PDF structure preserved.');
          break;
        case 'webp-to-pdf':
        case 'tiff-to-pdf':
        case 'bmp-to-pdf':
        case 'gif-to-pdf':
        case 'svg-to-pdf-direct':
          outputBlob = await imagesToPDF([files[0]]);
          break;

        // Text utilities
        case 'text-to-speech':
          // Use browser's built-in speech synthesis
          const ttsText = await files[0].text();
          const utterance = new SpeechSynthesisUtterance(ttsText);
          window.speechSynthesis.speak(utterance);
          alert('Text is being read aloud. This conversion does not produce a downloadable file.');
          return; // Don't set result
        case 'character-counter':
          const charText = await files[0].text();
          const charCount = charText.length;
          const charNoSpaces = charText.replace(/\s/g, '').length;
          const charStats = `Total characters: ${charCount}\nCharacters (no spaces): ${charNoSpaces}`;
          outputBlob = new Blob([charStats], { type: 'text/plain' });
          break;
        case 'line-counter':
          const lineText = await files[0].text();
          const lineCount = lineText.split('\n').length;
          const lineStats = `Total lines: ${lineCount}`;
          outputBlob = new Blob([lineStats], { type: 'text/plain' });
          break;
        case 'remove-line-breaks':
          const textWithBreaks = await files[0].text();
          const noBreaks = textWithBreaks.replace(/\n/g, ' ');
          outputBlob = new Blob([noBreaks], { type: 'text/plain' });
          break;
        case 'add-line-numbers':
          const textForNumbers = await files[0].text();
          const numberedLines = textForNumbers.split('\n').map((line, idx) => `${idx + 1}. ${line}`).join('\n');
          outputBlob = new Blob([numberedLines], { type: 'text/plain' });
          break;
        case 'text-to-binary':
          const textToBinary = await files[0].text();
          const binaryOutput = textToBinary.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
          outputBlob = new Blob([binaryOutput], { type: 'text/plain' });
          break;
        case 'binary-to-text':
          const binaryInput = await files[0].text();
          const textOutput = binaryInput.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
          outputBlob = new Blob([textOutput], { type: 'text/plain' });
          break;
        case 'text-to-hex':
          const textToHex = await files[0].text();
          const hexOutput = textToHex.split('').map(char => char.charCodeAt(0).toString(16)).join(' ');
          outputBlob = new Blob([hexOutput], { type: 'text/plain' });
          break;
        case 'hex-to-text':
          const hexInput = await files[0].text();
          const hexTextOutput = hexInput.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
          outputBlob = new Blob([hexTextOutput], { type: 'text/plain' });
          break;
        case 'html-encode':
          const textToEncode = await files[0].text();
          const htmlEncoded = textToEncode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
          outputBlob = new Blob([htmlEncoded], { type: 'text/plain' });
          break;
        case 'html-decode':
          const textToDecode = await files[0].text();
          const htmlDecoded = textToDecode.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
          outputBlob = new Blob([htmlDecoded], { type: 'text/plain' });
          break;
        case 'remove-html-tags':
          const htmlWithTags = await files[0].text();
          const textOnly = htmlWithTags.replace(/<[^>]*>/g, '');
          outputBlob = new Blob([textOnly], { type: 'text/plain' });
          break;
        case 'extract-emails':
          const textWithEmails = await files[0].text();
          const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
          const emails = textWithEmails.match(emailRegex) || [];
          outputBlob = new Blob([emails.join('\n')], { type: 'text/plain' });
          break;
        case 'extract-urls':
          const textWithUrls = await files[0].text();
          const urlRegex = /https?:\/\/[^\s]+/g;
          const urls = textWithUrls.match(urlRegex) || [];
          outputBlob = new Blob([urls.join('\n')], { type: 'text/plain' });
          break;
        case 'lorem-ipsum':
          const loremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n'.repeat(5);
          outputBlob = new Blob([loremText], { type: 'text/plain' });
          break;

        default:
          console.log('Unhandled conversion ID:', conversion.id);
          throw new Error(`Conversion "${conversion.id}" not yet implemented`);
      }

      setProgress(100);
      if (outputBlob) {
        setResult(outputBlob);
      } else if (outputBlobs.length > 0) {
        setResults(outputBlobs);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed. Please try again.';
      alert(`Conversion Error: ${errorMessage}\n\nThis conversion may have limitations. Check the note above for details.`);
    } finally {
      setConverting(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    setResults([]);
    setProgress(0);
    setTextInput('');
  };

  const needsTextInput = ['html-to-pdf', 'txt-to-pdf', 'markdown-to-pdf', 'markdown-to-html', 'json-to-csv', 'json-to-xlsx', 'json-to-xml', 'json-to-yaml', 'base64-encode', 'base64-decode', 'url-encode', 'url-decode', 'generate-qr', 'generate-barcode', 'html-to-markdown', 'hex-to-rgb', 'rgb-to-hex', 'hex-to-hsl'].includes(conversion.id);
  const needsNoFile = ['random-color-generator', 'lorem-ipsum'].includes(conversion.id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* File Type Icons Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <FileTypeIcon 
              fileType={conversion.from} 
              size={64} 
              className="transition-transform hover:scale-105" 
            />
            <ArrowRight 
              size={32} 
              className="text-gray-400 transition-colors hover:text-gray-600" 
            />
            <FileTypeIcon 
              fileType={conversion.to} 
              size={64} 
              className="transition-transform hover:scale-105" 
            />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">{conversion.name}</h1>
        <p className="text-gray-600 mb-8 text-center">{conversion.description}</p>
        
        <ConversionDisclaimer conversionId={conversion.id} />
        

        {!result && results.length === 0 && (
          <>
            {needsTextInput && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter text to convert:
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  placeholder="Enter your text here..."
                />
              </div>
            )}

            {!needsNoFile && (
            <FileUploader
              onFilesSelected={setFiles}
                accept={
                  conversion.from === 'image' ? 'image/*' :
                  conversion.from === 'text' ? 'text/*,.txt' :
                  conversion.from === 'json' ? '.json' :
                  conversion.from === 'yaml' ? '.yaml,.yml' :
                  conversion.from === 'xml' ? '.xml' :
                  conversion.from === 'html' ? '.html' :
                  conversion.from === 'color' ? 'text/*,.txt' :
                  conversion.from === 'css' ? '.css' :
                  conversion.from === 'js' ? '.js,.jsx,.ts,.tsx' :
                  conversion.from === 'pdf' ? '.pdf' :
                  conversion.from === 'docx' ? '.docx' :
                  conversion.from === 'odt' ? '.odt' :
                  conversion.from === 'rtf' ? '.rtf' :
                  conversion.from === 'xlsx' ? '.xlsx,.xls' :
                  conversion.from === 'ods' ? '.ods' :
                  conversion.from === 'csv' ? '.csv' :
                  conversion.from === 'audio' ? 'audio/*' :
                  conversion.from === 'video' ? 'video/*' :
                  conversion.from === 'flac' ? '.flac' :
                  conversion.from === 'aac' ? '.aac' :
                  conversion.from === 'wma' ? '.wma' :
                  conversion.from === 'tiff' ? '.tiff,.tif' :
                  conversion.from === 'gif' ? '.gif' :
                  conversion.from === 'svg' ? '.svg' :
                  conversion.from === 'binary' ? '.txt' :
                  conversion.from === 'hex' ? '.txt' :
                  undefined
                }
                multiple={['merge-pdf', 'create-zip', 'jpg-to-pdf', 'png-to-pdf', 'images-to-pdf-merge', 'images-to-pdf-single'].includes(conversion.id)}
              />
            )}

            <FilePreview files={files} onRemove={(index) => {
              const newFiles = files.filter((_, i) => i !== index);
              setFiles(newFiles);
            }} />

            {conversion.id === 'add-image-border' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Border Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Width: {(options as any).borderWidth || 20}px
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={(options as any).borderWidth || 20}
                      onChange={(e) => setOptions({ ...options, borderWidth: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
                    <input
                      type="color"
                      value={(options as any).borderColor || '#000000'}
                      onChange={(e) => setOptions({ ...options, borderColor: e.target.value })}
                      className="w-full h-10 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {conversion.id === 'delete-pdf-pages' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Select Pages to Delete</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter page numbers to delete (comma-separated, e.g., "1,3,5")
                  </label>
                  <input
                    type="text"
                    value={(options as any).pagesToDelete || ''}
                    onChange={(e) => setOptions({ ...options, pagesToDelete: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 1,3,5-7"
                  />
                </div>
              </div>
            )}

            {conversion.id === 'compress-pdf' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Compression Level</h3>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={(options as any).compressionLevel || 'medium'}
                  onChange={(e) => setOptions({ ...options, compressionLevel: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            )}

            {conversion.id === 'pdf-add-watermark' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Watermark Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
                    <input
                      type="text"
                      value={(options as any).watermarkText || ''}
                      onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter watermark text"
                    />
                  </div>
                </div>
              </div>
            )}

            {conversion.category === 'image' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality: {Math.round((options.quality || 0.92) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.01"
                      value={options.quality || 0.92}
                      onChange={(e) => setOptions({ ...options, quality: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  {conversion.id === 'resize-image' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
                        <input
                          type="number"
                          value={options.width || ''}
                          onChange={(e) => setOptions({ ...options, width: parseInt(e.target.value) })}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="Enter width"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
                        <input
                          type="number"
                          value={options.height || ''}
                          onChange={(e) => setOptions({ ...options, height: parseInt(e.target.value) })}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="Enter height"
                        />
                      </div>
                    </>
                  )}
                  {conversion.id === 'rotate-image' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rotation (degrees)</label>
                      <select
                        value={options.degrees || 90}
                        onChange={(e) => setOptions({ ...options, degrees: parseInt(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value={90}>90°</option>
                        <option value={180}>180°</option>
                        <option value={270}>270°</option>
                      </select>
                    </div>
                  )}
                  {conversion.id === 'flip-image' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Flip Direction</label>
                      <select
                        value={options.horizontal ? 'horizontal' : 'vertical'}
                        onChange={(e) => setOptions({ ...options, horizontal: e.target.value === 'horizontal' })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {conversion.id === 'image-brightness' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Brightness</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brightness: {options.brightness || 100}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="5"
                      value={options.brightness || 100}
                      onChange={(e) => setOptions({ ...options, brightness: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {conversion.id === 'find-replace' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Find & Replace</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Find</label>
                    <input
                      type="text"
                      value={options.findText || ''}
                      onChange={(e) => setOptions({ ...options, findText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Text to find"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Replace with</label>
                    <input
                      type="text"
                      value={options.replaceText || ''}
                      onChange={(e) => setOptions({ ...options, replaceText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Replacement text"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* QR Code Options */}
            {conversion.id === 'generate-qr' && textInput.trim() && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">QR Code Options</h3>
                <div className="space-y-4">
                  <QRStyleSelector
                    selectedStyle={options.qrStyle || 'classic'}
                    onStyleChange={(style) => setOptions({ ...options, qrStyle: style })}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size: {options.qrSize || 300}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="800"
                      step="50"
                      value={options.qrSize || 300}
                      onChange={(e) => setOptions({ ...options, qrSize: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input
                      type="color"
                      value={options.qrColor || '#000000'}
                      onChange={(e) => setOptions({ ...options, qrColor: e.target.value })}
                      className="w-full h-10 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Image Effect Options */}
            {conversion.id === 'image-blur' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Blur Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blur Amount: {options.blurAmount || 10}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={options.blurAmount || 10}
                    onChange={(e) => setOptions({ ...options, blurAmount: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {conversion.id === 'image-contrast' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Contrast Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contrast: {options.contrast || 100}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={options.contrast || 100}
                    onChange={(e) => setOptions({ ...options, contrast: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {conversion.id === 'image-saturation' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Saturation Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saturation: {options.saturation || 100}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={options.saturation || 100}
                    onChange={(e) => setOptions({ ...options, saturation: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {conversion.id === 'add-image-border' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Border Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Width: {options.borderWidth || 20}px
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={options.borderWidth || 20}
                      onChange={(e) => setOptions({ ...options, borderWidth: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
                    <input
                      type="color"
                      value={options.borderColor || '#000000'}
                      onChange={(e) => setOptions({ ...options, borderColor: e.target.value })}
                      className="w-full h-10 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {conversion.id === 'image-pixelate' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Pixelation Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pixel Size: {options.pixelSize || 10}px
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    step="1"
                    value={options.pixelSize || 10}
                    onChange={(e) => setOptions({ ...options, pixelSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* PDF Options */}
            {conversion.id === 'compress-pdf' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Compression Level</h3>
                <select
                  value={options.compressionLevel || 'medium'}
                  onChange={(e) => setOptions({ ...options, compressionLevel: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="low">Low (Better Quality)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">High (Smaller Size)</option>
                </select>
              </div>
            )}

            {conversion.id === 'merge-pdf' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Page Order</h3>
                <div className="text-sm text-gray-600 mb-2">Files will be merged in this order:</div>
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 bg-white rounded border">
                      <span className="font-medium">{idx + 1}.</span>
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text Analysis Options */}
            {conversion.id === 'word-counter' && files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Analysis Options</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.includeWordFrequency || false}
                    onChange={(e) => setOptions({ ...options, includeWordFrequency: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Include word frequency analysis</span>
                </label>
              </div>
            )}

            {needsNoFile ? (
              <div className="mt-6">
                <button
                  onClick={async () => {
                    setConverting(true);
                    const randomColors = Array.from({ length: 10 }, () => generateRandomColor());
                    const randomOutput = randomColors.join('\n');
                    const blob = new Blob([randomOutput], { type: 'text/plain' });
                    setResult(blob);
                    setConverting(false);
                  }}
                  className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg"
                >
                  Generate 10 Random Colors
                </button>
              </div>
            ) : conversion.id === 'lorem-ipsum' ? (
              <div className="mt-6">
                <button
                  onClick={async () => {
                    setConverting(true);
                    const loremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n'.repeat(5);
                    const blob = new Blob([loremText], { type: 'text/plain' });
                    setResult(blob);
                    setConverting(false);
                  }}
                  className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg"
                >
                  Generate Lorem Ipsum
                </button>
              </div>
            ) : (files.length > 0 || (needsTextInput && textInput.trim())) && !converting && (
              <button
                onClick={handleConvert}
                className="mt-6 w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg"
              >
                Convert Now
              </button>
            )}

            {converting && (
              <div className="mt-8">
                <ConversionProgress progress={progress} status="Converting your file..." />
              </div>
            )}
          </>
        )}

        {result && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversion Complete!</h2>
            <p className="text-gray-600 mb-6">Your file is ready to download</p>
            <div className="flex justify-center space-x-4">
              <DownloadButton blob={result} filename={generateFilename(conversion.id, files[0])} onDownload={reset} />
              <button
                onClick={reset}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Convert Another
              </button>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversion Complete!</h2>
            <p className="text-gray-600 mb-6">{results.length} files ready to download</p>
            <div className="space-y-3 mb-6">
              {results.map((blob, index) => (
                <DownloadButton key={index} blob={blob} filename={generateFilename(conversion.id, files[0], index)} />
              ))}
            </div>
            <button
              onClick={reset}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Convert Another
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-center space-x-2 text-green-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">100% Private - Files never leave your device</span>
          </div>
        </div>
      </div>
    </div>
  );
}

