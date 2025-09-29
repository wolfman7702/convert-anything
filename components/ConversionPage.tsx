'use client';

import { useState } from 'react';
import FileUploader from './FileUploader';
import ConversionProgress from './ConversionProgress';
import DownloadButton from './DownloadButton';
import FileTypeIcon from './FileTypeIcon';
import { ArrowRight } from 'lucide-react';
import { ConversionType, ConversionOptions } from '@/lib/types';
import { convertImage, compressImage, resizeImage, rotateImage, flipImage } from '@/lib/converters/imageConverter';
import { imagesToPDF, mergePDFs, splitPDF, compressPDF, textToPDF, htmlToPDF, rotatePDF, deletePDFPages } from '@/lib/converters/pdfConverter';
import { convertVideo, convertAudio, videoToAudio, videoToGIF, trimVideo, compressVideo, videoToFrames, trimAudio } from '@/lib/converters/videoConverter';
import { docxToHTML, docxToText, docxToPDF, htmlToText, markdownToHTML, markdownToPDF, htmlToMarkdown } from '@/lib/converters/documentConverter';
import { csvToJSON, jsonToCSV, xlsxToCSV, csvToXLSX, xlsxToJSON, jsonToXLSX, base64Encode, base64Decode, urlEncode, urlDecode, csvToXML, jsonToXML, xmlToJSON, yamlToJSON, jsonToYAML } from '@/lib/converters/dataConverter';
import { createZip, extractZip, gzipCompress, gzipDecompress } from '@/lib/converters/archiveConverter';
import { generateQRCode, generateBarcode, svgToPNG, svgToJPG, svgToPDF, extractColorsFromImage, imageToASCII } from '@/lib/converters/utilityConverter';

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
      
      // Video conversions
      case 'video-to-gif':
        return `animation.gif`;
      case 'video-to-frames':
        return `frame${indexSuffix}.png`;
      case 'trim-video':
        return `trimmed${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.mp4' : '.mp4'}`;
      case 'compress-video':
        return `compressed${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.mp4' : '.mp4'}`;
      case 'trim-audio':
        return `trimmed${originalFile ? originalFile.name.match(/\.[^/.]+$/)?.[0] || '.mp3' : '.mp3'}`;
      
      // Document conversions
      case 'docx-to-pdf':
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
          if (options.degrees) {
            outputBlob = await rotateImage(files[0], options.degrees);
          }
          break;
        case 'flip-image':
          outputBlob = await flipImage(files[0], options.horizontal);
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
          outputBlob = await compressPDF(files[0]);
          break;
        case 'html-to-pdf':
          outputBlob = await htmlToPDF(textInput);
          break;
        case 'txt-to-pdf':
          outputBlob = await textToPDF(textInput);
          break;
        case 'rotate-pdf':
          if (options.degrees) {
            outputBlob = await rotatePDF(files[0], options.degrees);
          }
          break;
        case 'delete-pdf-pages':
          if (options.pages) {
            outputBlob = await deletePDFPages(files[0], options.pages);
          }
          break;

        // Video conversions
        case 'mp4-to-webm':
        case 'webm-to-mp4':
        case 'mp4-to-avi':
        case 'avi-to-mp4':
        case 'mov-to-mp4':
        case 'mp4-to-mov':
        case 'mkv-to-mp4':
        case 'mp4-to-mkv':
        case 'flv-to-mp4':
        case 'wmv-to-mp4':
        case 'video-to-mp4':
          outputBlob = await convertVideo(files[0], conversion.to, options);
          break;
        case 'mp3-to-wav':
        case 'wav-to-mp3':
        case 'mp3-to-ogg':
        case 'ogg-to-mp3':
        case 'mp3-to-m4a':
        case 'm4a-to-mp3':
        case 'flac-to-mp3':
        case 'mp3-to-flac':
        case 'aac-to-mp3':
        case 'mp3-to-aac':
        case 'wma-to-mp3':
        case 'mp3-to-wma':
        case 'audio-to-mp3':
          outputBlob = await convertAudio(files[0], conversion.to, options);
          break;
        case 'video-to-mp3':
          outputBlob = await videoToAudio(files[0], 'mp3');
          break;
        case 'video-to-gif':
          outputBlob = await videoToGIF(files[0]);
          break;
        case 'trim-video':
          if (options.startTime !== undefined && options.endTime !== undefined) {
            outputBlob = await trimVideo(files[0], options.startTime, options.endTime);
          }
          break;
        case 'compress-video':
          outputBlob = await compressVideo(files[0], options.quality);
          break;
        case 'video-to-frames':
          outputBlobs = await videoToFrames(files[0], options.fps);
          break;
        case 'trim-audio':
          if (options.startTime !== undefined && options.endTime !== undefined) {
            outputBlob = await trimAudio(files[0], options.startTime, options.endTime);
          }
          break;

        // Document conversions
        case 'docx-to-pdf':
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
        case 'html-to-docx':
          // This would require a more complex implementation
          throw new Error('HTML to DOCX conversion not yet implemented');
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
          const csvText = await files[0].text();
          const xml = csvToXML(csvText);
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
          outputBlob = await generateQRCode(textInput);
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
        case 'color-picker':
          const colors = await extractColorsFromImage(files[0]);
          outputBlob = new Blob([colors.join('\n')], { type: 'text/plain' });
          break;
        case 'image-to-ascii':
          const ascii = await imageToASCII(files[0]);
          outputBlob = new Blob([ascii], { type: 'text/plain' });
          break;

        default:
          throw new Error('Conversion not yet implemented');
      }

      setProgress(100);
      if (outputBlob) {
        setResult(outputBlob);
      } else if (outputBlobs.length > 0) {
        setResults(outputBlobs);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Conversion failed. Please try again.');
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

  const needsTextInput = ['html-to-pdf', 'txt-to-pdf', 'markdown-to-pdf', 'markdown-to-html', 'json-to-csv', 'json-to-xlsx', 'json-to-xml', 'json-to-yaml', 'base64-encode', 'base64-decode', 'url-encode', 'url-decode', 'generate-qr', 'generate-barcode', 'html-to-markdown'].includes(conversion.id);

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

            <FileUploader
              onFilesSelected={setFiles}
              accept={conversion.from === 'image' ? 'image/*' : undefined}
              multiple={['merge-pdf', 'create-zip', 'jpg-to-pdf', 'png-to-pdf'].includes(conversion.id)}
            />

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

            {(files.length > 0 || (needsTextInput && textInput.trim())) && !converting && (
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

