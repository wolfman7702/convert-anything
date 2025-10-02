import { ConversionType } from './types';

export const conversions: ConversionType[] = [
  // IMAGE CONVERSIONS (20+)
  { id: 'png-to-jpg', name: 'PNG to JPG', from: 'png', to: 'jpg', category: 'image', description: 'Convert PNG images to JPG format', popular: true },
  { id: 'jpg-to-png', name: 'JPG to PNG', from: 'jpg', to: 'png', category: 'image', description: 'Convert JPG images to PNG format', popular: true },
  { id: 'png-to-webp', name: 'PNG to WEBP', from: 'png', to: 'webp', category: 'image', description: 'Convert PNG to WEBP format' },
  { id: 'jpg-to-webp', name: 'JPG to WEBP', from: 'jpg', to: 'webp', category: 'image', description: 'Convert JPG to WEBP format' },
  { id: 'webp-to-png', name: 'WEBP to PNG', from: 'webp', to: 'png', category: 'image', description: 'Convert WEBP to PNG format' },
  { id: 'webp-to-jpg', name: 'WEBP to JPG', from: 'webp', to: 'jpg', category: 'image', description: 'Convert WEBP to JPG format' },
  { id: 'png-to-bmp', name: 'PNG to BMP', from: 'png', to: 'bmp', category: 'image', description: 'Convert PNG to BMP format' },
  { id: 'jpg-to-bmp', name: 'JPG to BMP', from: 'jpg', to: 'bmp', category: 'image', description: 'Convert JPG to BMP format' },
  { id: 'bmp-to-png', name: 'BMP to PNG', from: 'bmp', to: 'png', category: 'image', description: 'Convert BMP to PNG format' },
  { id: 'bmp-to-jpg', name: 'BMP to JPG', from: 'bmp', to: 'jpg', category: 'image', description: 'Convert BMP to JPG format' },
  { id: 'heic-to-jpg', name: 'HEIC to JPG', from: 'heic', to: 'jpg', category: 'image', description: 'Convert HEIC to JPG format' },
  { id: 'heic-to-png', name: 'HEIC to PNG', from: 'heic', to: 'png', category: 'image', description: 'Convert HEIC to PNG format' },
  { id: 'compress-image', name: 'Compress Image', from: 'image', to: 'image', category: 'image', description: 'Compress images to reduce file size', popular: true },
  { id: 'resize-image', name: 'Resize Image', from: 'image', to: 'image', category: 'image', description: 'Resize images to specific dimensions' },
  { id: 'create-ico', name: 'Create ICO', from: 'image', to: 'ico', category: 'image', description: 'Create ICO icon from image' },
  { id: 'tiff-to-jpg', name: 'TIFF to JPG', from: 'tiff', to: 'jpg', category: 'image', description: 'Convert TIFF to JPG format' },
  { id: 'tiff-to-png', name: 'TIFF to PNG', from: 'tiff', to: 'png', category: 'image', description: 'Convert TIFF to PNG format' },
  { id: 'rotate-image', name: 'Rotate Image', from: 'image', to: 'image', category: 'image', description: 'Rotate images by 90, 180, or 270 degrees' },
  { id: 'flip-image', name: 'Flip Image', from: 'image', to: 'image', category: 'image', description: 'Flip images horizontally or vertically' },

  // PDF CONVERSIONS (25+)
  { id: 'pdf-to-jpg', name: 'PDF to JPG', from: 'pdf', to: 'jpg', category: 'pdf', description: 'Convert PDF pages to JPG images', popular: true },
  { id: 'pdf-to-png', name: 'PDF to PNG', from: 'pdf', to: 'png', category: 'pdf', description: 'Convert PDF pages to PNG images' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', from: 'jpg', to: 'pdf', category: 'pdf', description: 'Convert JPG images to PDF', popular: true },
  { id: 'png-to-pdf', name: 'PNG to PDF', from: 'png', to: 'pdf', category: 'pdf', description: 'Convert PNG images to PDF' },
  { id: 'merge-pdf', name: 'Merge PDF', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Combine multiple PDFs into one', popular: true },
  { id: 'split-pdf', name: 'Split PDF', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Split PDF into separate pages', popular: true },
  { id: 'compress-pdf', name: 'Compress PDF', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Reduce PDF file size', popular: true },
  { id: 'pdf-to-text', name: 'PDF to Text', from: 'pdf', to: 'txt', category: 'pdf', description: 'Extract text from PDF' },
  { id: 'html-to-pdf', name: 'HTML to PDF', from: 'html', to: 'pdf', category: 'pdf', description: 'Convert HTML to PDF' },
  { id: 'rotate-pdf', name: 'Rotate PDF', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Rotate PDF pages' },
  { id: 'delete-pdf-pages', name: 'Delete PDF Pages', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Remove specific pages from PDF' },
  { id: 'word-to-pdf', name: 'Word to PDF', from: 'docx', to: 'pdf', category: 'pdf', description: 'Convert Word document to PDF', popular: true },
  { id: 'excel-to-pdf', name: 'Excel to PDF', from: 'xlsx', to: 'pdf', category: 'pdf', description: 'Convert Excel to PDF' },
  { id: 'powerpoint-to-pdf', name: 'PowerPoint to PDF', from: 'pptx', to: 'pdf', category: 'pdf', description: 'Convert PowerPoint to PDF' },

  // DOCUMENT CONVERSIONS (15+)
  { id: 'docx-to-pdf', name: 'DOCX to PDF', from: 'docx', to: 'pdf', category: 'document', description: 'Convert Word documents to PDF', popular: true },
  { id: 'docx-to-html', name: 'DOCX to HTML', from: 'docx', to: 'html', category: 'document', description: 'Convert Word to HTML' },
  { id: 'docx-to-txt', name: 'DOCX to TXT', from: 'docx', to: 'txt', category: 'document', description: 'Convert Word to plain text' },
  { id: 'html-to-docx', name: 'HTML to DOCX', from: 'html', to: 'docx', category: 'document', description: 'Convert HTML to Word (formatting may be simplified)' },
  { id: 'txt-to-pdf', name: 'TXT to PDF', from: 'txt', to: 'pdf', category: 'document', description: 'Convert text files to PDF' },
  { id: 'markdown-to-pdf', name: 'Markdown to PDF', from: 'md', to: 'pdf', category: 'document', description: 'Convert Markdown to PDF' },
  { id: 'markdown-to-html', name: 'Markdown to HTML', from: 'md', to: 'html', category: 'document', description: 'Convert Markdown to HTML' },
  { id: 'rtf-to-pdf', name: 'RTF to PDF', from: 'rtf', to: 'pdf', category: 'document', description: 'Convert RTF to PDF' },
  { id: 'odt-to-pdf', name: 'ODT to PDF', from: 'odt', to: 'pdf', category: 'document', description: 'Convert OpenDocument Text to PDF' },
  { id: 'epub-to-pdf', name: 'EPUB to PDF', from: 'epub', to: 'pdf', category: 'document', description: 'Convert EPUB ebook to PDF' },
  { id: 'mobi-to-pdf', name: 'MOBI to PDF', from: 'mobi', to: 'pdf', category: 'document', description: 'Convert MOBI ebook to PDF' },
  { id: 'azw3-to-pdf', name: 'AZW3 to PDF', from: 'azw3', to: 'pdf', category: 'document', description: 'Convert AZW3 ebook to PDF' },
  { id: 'fb2-to-pdf', name: 'FB2 to PDF', from: 'fb2', to: 'pdf', category: 'document', description: 'Convert FB2 ebook to PDF' },
  { id: 'doc-to-docx', name: 'DOC to DOCX', from: 'doc', to: 'docx', category: 'document', description: 'Convert old Word format to new format' },
  { id: 'docx-to-doc', name: 'DOCX to DOC', from: 'docx', to: 'doc', category: 'document', description: 'Convert new Word format to old format' },

  // DATA CONVERSIONS (20+)
  { id: 'csv-to-json', name: 'CSV to JSON', from: 'csv', to: 'json', category: 'data', description: 'Convert CSV to JSON format' },
  { id: 'json-to-csv', name: 'JSON to CSV', from: 'json', to: 'csv', category: 'data', description: 'Convert JSON to CSV format' },
  { id: 'csv-to-xml', name: 'CSV to XML', from: 'csv', to: 'xml', category: 'data', description: 'Convert CSV to XML format' },
  { id: 'xml-to-csv', name: 'XML to CSV', from: 'xml', to: 'csv', category: 'data', description: 'Convert XML to CSV format' },
  { id: 'xlsx-to-csv', name: 'XLSX to CSV', from: 'xlsx', to: 'csv', category: 'data', description: 'Convert Excel to CSV', popular: true },
  { id: 'csv-to-xlsx', name: 'CSV to XLSX', from: 'csv', to: 'xlsx', category: 'data', description: 'Convert CSV to Excel' },
  { id: 'xlsx-to-json', name: 'XLSX to JSON', from: 'xlsx', to: 'json', category: 'data', description: 'Convert Excel to JSON' },
  { id: 'json-to-xlsx', name: 'JSON to XLSX', from: 'json', to: 'xlsx', category: 'data', description: 'Convert JSON to Excel' },
  { id: 'base64-encode', name: 'Base64 Encode', from: 'text', to: 'base64', category: 'data', description: 'Encode text to Base64' },
  { id: 'base64-decode', name: 'Base64 Decode', from: 'base64', to: 'text', category: 'data', description: 'Decode Base64 to text' },
  { id: 'url-encode', name: 'URL Encode', from: 'text', to: 'url', category: 'data', description: 'URL encode text' },
  { id: 'url-decode', name: 'URL Decode', from: 'url', to: 'text', category: 'data', description: 'URL decode text' },
  { id: 'json-to-xml', name: 'JSON to XML', from: 'json', to: 'xml', category: 'data', description: 'Convert JSON to XML format' },
  { id: 'xml-to-json', name: 'XML to JSON', from: 'xml', to: 'json', category: 'data', description: 'Convert XML to JSON format' },
  { id: 'yaml-to-json', name: 'YAML to JSON', from: 'yaml', to: 'json', category: 'data', description: 'Convert YAML to JSON format' },
  { id: 'json-to-yaml', name: 'JSON to YAML', from: 'json', to: 'yaml', category: 'data', description: 'Convert JSON to YAML format' },
  { id: 'toml-to-json', name: 'TOML to JSON', from: 'toml', to: 'json', category: 'data', description: 'Convert TOML to JSON format' },
  { id: 'json-to-toml', name: 'JSON to TOML', from: 'json', to: 'toml', category: 'data', description: 'Convert JSON to TOML format' },
  { id: 'ini-to-json', name: 'INI to JSON', from: 'ini', to: 'json', category: 'data', description: 'Convert INI to JSON format' },
  { id: 'json-to-ini', name: 'JSON to INI', from: 'json', to: 'ini', category: 'data', description: 'Convert JSON to INI format' },

  // ARCHIVE CONVERSIONS (8+)
  { id: 'create-zip', name: 'Create ZIP', from: 'files', to: 'zip', category: 'archive', description: 'Create ZIP archive from files' },
  { id: 'extract-zip', name: 'Extract ZIP', from: 'zip', to: 'files', category: 'archive', description: 'Extract files from ZIP' },
  { id: 'gzip-compress', name: 'GZIP Compress', from: 'file', to: 'gz', category: 'archive', description: 'Compress file with GZIP' },
  { id: 'gzip-decompress', name: 'GZIP Decompress', from: 'gz', to: 'file', category: 'archive', description: 'Decompress GZIP file' },
  { id: 'create-tar', name: 'Create TAR', from: 'files', to: 'tar', category: 'archive', description: 'Create TAR archive from files' },
  { id: 'extract-tar', name: 'Extract TAR', from: 'tar', to: 'files', category: 'archive', description: 'Extract files from TAR' },
  { id: 'create-7z', name: 'Create 7Z', from: 'files', to: '7z', category: 'archive', description: 'Create 7Z archive from files' },
  { id: 'extract-7z', name: 'Extract 7Z', from: '7z', to: 'files', category: 'archive', description: 'Extract files from 7Z' },

  // UTILITY CONVERSIONS (10+)
  { id: 'html-to-markdown', name: 'HTML to Markdown', from: 'html', to: 'md', category: 'utility', description: 'Convert HTML to Markdown' },
  { id: 'generate-qr', name: 'Generate QR Code', from: 'text', to: 'qr', category: 'utility', description: 'Generate QR code from text' },
  { id: 'generate-barcode', name: 'Generate Barcode', from: 'text', to: 'barcode', category: 'utility', description: 'Generate barcode from text' },
  { id: 'svg-to-png', name: 'SVG to PNG', from: 'svg', to: 'png', category: 'utility', description: 'Convert SVG to PNG' },
  { id: 'svg-to-jpg', name: 'SVG to JPG', from: 'svg', to: 'jpg', category: 'utility', description: 'Convert SVG to JPG' },
  { id: 'svg-to-pdf', name: 'SVG to PDF', from: 'svg', to: 'pdf', category: 'utility', description: 'Convert SVG to PDF' },
  { id: 'color-picker', name: 'Color Picker', from: 'image', to: 'color', category: 'utility', description: 'Extract colors from images' },
  { id: 'color-palette', name: 'Color Palette', from: 'image', to: 'color', category: 'utility', description: 'Extract color palette from images' },
  { id: 'image-to-ascii', name: 'Image to ASCII', from: 'image', to: 'text', category: 'utility', description: 'Convert images to ASCII art' },

  // TEXT UTILITIES (10 new)
  { id: 'word-counter', name: 'Word Counter', from: 'text', to: 'analysis', category: 'utility', description: 'Count words, characters, sentences, and paragraphs' },
  { id: 'case-converter-upper', name: 'Convert to UPPERCASE', from: 'text', to: 'text', category: 'utility', description: 'Convert text to uppercase' },
  { id: 'case-converter-lower', name: 'Convert to lowercase', from: 'text', to: 'text', category: 'utility', description: 'Convert text to lowercase' },
  { id: 'case-converter-title', name: 'Convert to Title Case', from: 'text', to: 'text', category: 'utility', description: 'Convert text to title case' },
  { id: 'remove-duplicates', name: 'Remove Duplicate Lines', from: 'text', to: 'text', category: 'utility', description: 'Remove duplicate lines from text' },
  { id: 'sort-lines', name: 'Sort Lines Alphabetically', from: 'text', to: 'text', category: 'utility', description: 'Sort text lines A-Z' },
  { id: 'reverse-text', name: 'Reverse Text', from: 'text', to: 'text', category: 'utility', description: 'Reverse text content' },
  { id: 'find-replace', name: 'Find & Replace', from: 'text', to: 'text', category: 'utility', description: 'Find and replace text' },
  { id: 'json-formatter', name: 'Format JSON', from: 'json', to: 'json', category: 'data', description: 'Format and validate JSON', popular: true },
  { id: 'json-minify', name: 'Minify JSON', from: 'json', to: 'json', category: 'data', description: 'Minify JSON (remove whitespace)' },

  // IMAGE UTILITIES (8 new)
  { id: 'image-rotate-90', name: 'Rotate Image 90°', from: 'image', to: 'image', category: 'image', description: 'Rotate image 90 degrees clockwise' },
  { id: 'image-rotate-180', name: 'Rotate Image 180°', from: 'image', to: 'image', category: 'image', description: 'Rotate image 180 degrees' },
  { id: 'image-rotate-270', name: 'Rotate Image 270°', from: 'image', to: 'image', category: 'image', description: 'Rotate image 270 degrees' },
  { id: 'image-flip-horizontal', name: 'Flip Horizontal', from: 'image', to: 'image', category: 'image', description: 'Flip image horizontally' },
  { id: 'image-flip-vertical', name: 'Flip Vertical', from: 'image', to: 'image', category: 'image', description: 'Flip image vertically' },
  { id: 'image-grayscale', name: 'Convert to Grayscale', from: 'image', to: 'image', category: 'image', description: 'Make image black and white' },
  { id: 'image-invert', name: 'Invert Colors', from: 'image', to: 'image', category: 'image', description: 'Invert image colors' },
  { id: 'image-brightness', name: 'Adjust Brightness', from: 'image', to: 'image', category: 'image', description: 'Make image brighter or darker' },

  // PDF UTILITIES (5 new)
  { id: 'pdf-remove-pages', name: 'Remove Specific Pages', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Remove specific pages from PDF' },
  { id: 'images-to-pdf-merge', name: 'Images to Single PDF', from: 'images', to: 'pdf', category: 'pdf', description: 'Combine multiple images into one PDF' },

  // COLOR UTILITIES (5 new)
  { id: 'hex-to-rgb', name: 'HEX to RGB', from: 'color', to: 'color', category: 'utility', description: 'Convert HEX color to RGB' },
  { id: 'rgb-to-hex', name: 'RGB to HEX', from: 'color', to: 'color', category: 'utility', description: 'Convert RGB color to HEX' },
  { id: 'hex-to-hsl', name: 'HEX to HSL', from: 'color', to: 'color', category: 'utility', description: 'Convert HEX color to HSL' },
  { id: 'random-color-generator', name: 'Random Color Generator', from: 'none', to: 'color', category: 'utility', description: 'Generate random colors' },

  // DATA FORMAT CONVERTERS (7 new)
  { id: 'tsv-to-csv', name: 'TSV to CSV', from: 'tsv', to: 'csv', category: 'data', description: 'Convert tab-separated to comma-separated' },
  { id: 'csv-to-tsv', name: 'CSV to TSV', from: 'csv', to: 'tsv', category: 'data', description: 'Convert comma-separated to tab-separated' },
  { id: 'html-table-to-csv', name: 'HTML Table to CSV', from: 'html', to: 'csv', category: 'data', description: 'Extract HTML table to CSV' },

  // IMAGE ENHANCEMENTS (8 new)
  { id: 'remove-background', name: 'Remove Background', from: 'image', to: 'png', category: 'image', description: 'Remove image background automatically', popular: true },
  { id: 'image-blur', name: 'Blur Image', from: 'image', to: 'image', category: 'image', description: 'Apply blur effect to image' },
  { id: 'image-sharpen', name: 'Sharpen Image', from: 'image', to: 'image', category: 'image', description: 'Sharpen image details' },
  { id: 'image-contrast', name: 'Adjust Contrast', from: 'image', to: 'image', category: 'image', description: 'Adjust image contrast' },
  { id: 'image-saturation', name: 'Adjust Saturation', from: 'image', to: 'image', category: 'image', description: 'Adjust color saturation' },
  { id: 'image-sepia', name: 'Sepia Filter', from: 'image', to: 'image', category: 'image', description: 'Apply sepia tone effect' },
  { id: 'add-image-border', name: 'Add Border', from: 'image', to: 'image', category: 'image', description: 'Add border to image' },
  { id: 'image-pixelate', name: 'Pixelate Image', from: 'image', to: 'image', category: 'image', description: 'Apply pixelation effect' },

  // PDF ENHANCEMENTS (4 new)
  { id: 'pdf-add-watermark', name: 'Add Watermark to PDF', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Add text watermark to PDF pages' },

  // TEXT & CODE (4 new)
  { id: 'minify-css', name: 'Minify CSS', from: 'css', to: 'css', category: 'utility', description: 'Minify CSS code' },
  { id: 'minify-js', name: 'Minify JavaScript', from: 'js', to: 'js', category: 'utility', description: 'Minify JavaScript code' },
  { id: 'beautify-css', name: 'Beautify CSS', from: 'css', to: 'css', category: 'utility', description: 'Format CSS code' },
  { id: 'beautify-js', name: 'Beautify JavaScript', from: 'js', to: 'js', category: 'utility', description: 'Format JavaScript code' },

  // ADDITIONAL IMAGE FORMATS (13 new)
  { id: 'jpg-to-tiff', name: 'JPG to TIFF', from: 'jpg', to: 'tiff', category: 'image', description: 'Convert JPG to TIFF format' },
  { id: 'png-to-tiff', name: 'PNG to TIFF', from: 'png', to: 'tiff', category: 'image', description: 'Convert PNG to TIFF format' },
  { id: 'gif-to-jpg', name: 'GIF to JPG', from: 'gif', to: 'jpg', category: 'image', description: 'Convert GIF to JPG format' },
  { id: 'gif-to-png', name: 'GIF to PNG', from: 'gif', to: 'png', category: 'image', description: 'Convert GIF to PNG format' },
  { id: 'jpg-to-gif', name: 'JPG to GIF', from: 'jpg', to: 'gif', category: 'image', description: 'Convert JPG to GIF format' },
  { id: 'png-to-gif', name: 'PNG to GIF', from: 'png', to: 'gif', category: 'image', description: 'Convert PNG to GIF format' },
  { id: 'bmp-to-webp', name: 'BMP to WEBP', from: 'bmp', to: 'webp', category: 'image', description: 'Convert BMP to WEBP format' },
  { id: 'webp-to-bmp', name: 'WEBP to BMP', from: 'webp', to: 'bmp', category: 'image', description: 'Convert WEBP to BMP format' },
  { id: 'gif-to-webp', name: 'GIF to WEBP', from: 'gif', to: 'webp', category: 'image', description: 'Convert GIF to WEBP format' },
  { id: 'webp-to-gif', name: 'WEBP to GIF', from: 'webp', to: 'gif', category: 'image', description: 'Convert WEBP to GIF format' },
  { id: 'tiff-to-webp', name: 'TIFF to WEBP', from: 'tiff', to: 'webp', category: 'image', description: 'Convert TIFF to WEBP format' },
  { id: 'webp-to-tiff', name: 'WEBP to TIFF', from: 'webp', to: 'tiff', category: 'image', description: 'Convert WEBP to TIFF format' },
  { id: 'tiff-to-bmp', name: 'TIFF to BMP', from: 'tiff', to: 'bmp', category: 'image', description: 'Convert TIFF to BMP format' },

  // DOCUMENT FORMAT EXPANSIONS (10 new)
  { id: 'odt-to-pdf', name: 'ODT to PDF', from: 'odt', to: 'pdf', category: 'document', description: 'Convert OpenDocument to PDF' },
  { id: 'odt-to-docx', name: 'ODT to DOCX', from: 'odt', to: 'docx', category: 'document', description: 'Convert OpenDocument to Word (formatting may be lost)' },
  { id: 'docx-to-odt', name: 'DOCX to ODT', from: 'docx', to: 'odt', category: 'document', description: 'Convert Word to OpenDocument (simplified)' },
  { id: 'rtf-to-pdf', name: 'RTF to PDF', from: 'rtf', to: 'pdf', category: 'document', description: 'Convert RTF to PDF format' },
  { id: 'rtf-to-docx', name: 'RTF to DOCX', from: 'rtf', to: 'docx', category: 'document', description: 'Convert RTF to Word (basic conversion)' },
  { id: 'docx-to-rtf', name: 'DOCX to RTF', from: 'docx', to: 'rtf', category: 'document', description: 'Convert Word to RTF (basic formatting preserved)' },
  { id: 'txt-to-docx', name: 'TXT to DOCX', from: 'txt', to: 'docx', category: 'document', description: 'Convert text to Word document (basic formatting)' },
  { id: 'txt-to-html', name: 'TXT to HTML', from: 'txt', to: 'html', category: 'document', description: 'Convert plain text to HTML' },
  { id: 'html-to-txt', name: 'HTML to TXT', from: 'html', to: 'txt', category: 'document', description: 'Convert HTML to plain text' },

  // SPREADSHEET EXPANSIONS (10 new)
  { id: 'ods-to-xlsx', name: 'ODS to XLSX', from: 'ods', to: 'xlsx', category: 'data', description: 'Convert OpenDocument Spreadsheet to Excel' },
  { id: 'xlsx-to-ods', name: 'XLSX to ODS', from: 'xlsx', to: 'ods', category: 'data', description: 'Convert Excel to OpenDocument Spreadsheet' },
  { id: 'ods-to-csv', name: 'ODS to CSV', from: 'ods', to: 'csv', category: 'data', description: 'Convert ODS to CSV format' },
  { id: 'csv-to-ods', name: 'CSV to ODS', from: 'csv', to: 'ods', category: 'data', description: 'Convert CSV to ODS format' },
  { id: 'xlsx-to-html', name: 'XLSX to HTML', from: 'xlsx', to: 'html', category: 'data', description: 'Convert Excel to HTML table' },
  { id: 'csv-to-html', name: 'CSV to HTML', from: 'csv', to: 'html', category: 'data', description: 'Convert CSV to HTML table' },
  { id: 'xls-to-xlsx', name: 'XLS to XLSX', from: 'xls', to: 'xlsx', category: 'data', description: 'Convert old Excel to new Excel format' },
  { id: 'xlsx-to-xls', name: 'XLSX to XLS', from: 'xlsx', to: 'xls', category: 'data', description: 'Convert new Excel to old Excel format' },
  { id: 'xls-to-csv', name: 'XLS to CSV', from: 'xls', to: 'csv', category: 'data', description: 'Convert old Excel to CSV' },
  { id: 'csv-to-xls', name: 'CSV to XLS', from: 'csv', to: 'xls', category: 'data', description: 'Convert CSV to old Excel format' },

  // ADDITIONAL PDF TOOLS (15 new)
  { id: 'pdf-grayscale', name: 'Convert PDF to Grayscale', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Remove colors from PDF' },
  { id: 'pdf-crop', name: 'Crop PDF Pages', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Crop margins from PDF pages' },
  { id: 'pdf-resize', name: 'Resize PDF Pages', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Change PDF page dimensions' },
  { id: 'pdf-flatten', name: 'Flatten PDF', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Flatten PDF forms and annotations' },
  { id: 'pdf-a4-to-letter', name: 'PDF A4 to Letter', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Convert PDF from A4 to Letter size' },
  { id: 'pdf-letter-to-a4', name: 'PDF Letter to A4', from: 'pdf', to: 'pdf', category: 'pdf', description: 'Convert PDF from Letter to A4 size' },
  { id: 'webp-to-pdf', name: 'WEBP to PDF', from: 'webp', to: 'pdf', category: 'pdf', description: 'Convert WEBP images to PDF' },
  { id: 'tiff-to-pdf', name: 'TIFF to PDF', from: 'tiff', to: 'pdf', category: 'pdf', description: 'Convert TIFF images to PDF' },
  { id: 'bmp-to-pdf', name: 'BMP to PDF', from: 'bmp', to: 'pdf', category: 'pdf', description: 'Convert BMP images to PDF' },
  { id: 'gif-to-pdf', name: 'GIF to PDF', from: 'gif', to: 'pdf', category: 'pdf', description: 'Convert GIF images to PDF' },
  { id: 'svg-to-pdf-direct', name: 'SVG to PDF', from: 'svg', to: 'pdf', category: 'pdf', description: 'Convert SVG graphics to PDF' },

  // ADDITIONAL TEXT/CODE UTILITIES (15 new)
  { id: 'character-counter', name: 'Character Counter', from: 'text', to: 'analysis', category: 'utility', description: 'Count characters with/without spaces' },
  { id: 'line-counter', name: 'Line Counter', from: 'text', to: 'analysis', category: 'utility', description: 'Count lines in text' },
  { id: 'remove-line-breaks', name: 'Remove Line Breaks', from: 'text', to: 'text', category: 'utility', description: 'Remove all line breaks from text' },
  { id: 'add-line-numbers', name: 'Add Line Numbers', from: 'text', to: 'text', category: 'utility', description: 'Number each line of text' },
  { id: 'text-to-binary', name: 'Text to Binary', from: 'text', to: 'binary', category: 'utility', description: 'Convert text to binary code' },
  { id: 'binary-to-text', name: 'Binary to Text', from: 'binary', to: 'text', category: 'utility', description: 'Convert binary code to text' },
  { id: 'text-to-hex', name: 'Text to Hex', from: 'text', to: 'hex', category: 'utility', description: 'Convert text to hexadecimal' },
  { id: 'hex-to-text', name: 'Hex to Text', from: 'hex', to: 'text', category: 'utility', description: 'Convert hexadecimal to text' },
  { id: 'html-encode', name: 'HTML Encode', from: 'text', to: 'html', category: 'utility', description: 'Encode special HTML characters' },
  { id: 'html-decode', name: 'HTML Decode', from: 'html', to: 'text', category: 'utility', description: 'Decode HTML entities' },
  { id: 'remove-html-tags', name: 'Remove HTML Tags', from: 'html', to: 'text', category: 'utility', description: 'Strip all HTML tags from text' },
  { id: 'extract-emails', name: 'Extract Email Addresses', from: 'text', to: 'list', category: 'utility', description: 'Extract all email addresses from text' },
  { id: 'extract-urls', name: 'Extract URLs', from: 'text', to: 'list', category: 'utility', description: 'Extract all URLs from text' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', from: 'none', to: 'text', category: 'utility', description: 'Generate placeholder text' },

  // CERTIFICATE CONVERSIONS (16)
  { id: 'pem-to-der', name: 'PEM to DER', from: 'pem', to: 'der', category: 'certificate', description: 'Convert PEM certificate to DER format' },
  { id: 'der-to-pem', name: 'DER to PEM', from: 'der', to: 'pem', category: 'certificate', description: 'Convert DER certificate to PEM format' },
  { id: 'pem-to-crt', name: 'PEM to CRT', from: 'pem', to: 'crt', category: 'certificate', description: 'Convert PEM to CRT format' },
  { id: 'crt-to-pem', name: 'CRT to PEM', from: 'crt', to: 'pem', category: 'certificate', description: 'Convert CRT to PEM format' },
  { id: 'cer-to-pem', name: 'CER to PEM', from: 'cer', to: 'pem', category: 'certificate', description: 'Convert CER certificate to PEM format' },
  { id: 'pem-to-cer', name: 'PEM to CER', from: 'pem', to: 'cer', category: 'certificate', description: 'Convert PEM certificate to CER format' },
  { id: 'pfx-to-pem', name: 'PFX to PEM', from: 'pfx', to: 'pem', category: 'certificate', description: 'Convert PFX/P12 to PEM (extracts cert and key)', popular: true },
  { id: 'p12-to-pem', name: 'P12 to PEM', from: 'p12', to: 'pem', category: 'certificate', description: 'Convert P12 to PEM format' },
  { id: 'pem-to-pfx', name: 'PEM to PFX', from: 'pem', to: 'pfx', category: 'certificate', description: 'Convert PEM to PFX/P12 format' },
  { id: 'pem-to-p12', name: 'PEM to P12', from: 'pem', to: 'p12', category: 'certificate', description: 'Convert PEM to P12 format' },
  { id: 'p7b-to-pem', name: 'P7B to PEM', from: 'p7b', to: 'pem', category: 'certificate', description: 'Convert PKCS#7 to PEM format' },
  { id: 'pem-to-p7b', name: 'PEM to P7B', from: 'pem', to: 'p7b', category: 'certificate', description: 'Convert PEM to PKCS#7 format' },
  { id: 'der-to-crt', name: 'DER to CRT', from: 'der', to: 'crt', category: 'certificate', description: 'Convert DER to CRT format' },
  { id: 'crt-to-der', name: 'CRT to DER', from: 'crt', to: 'der', category: 'certificate', description: 'Convert CRT to DER format' },
  { id: 'extract-public-key', name: 'Extract Public Key', from: 'pem', to: 'key', category: 'certificate', description: 'Extract public key from certificate' },
  { id: 'view-certificate', name: 'View Certificate Info', from: 'pem', to: 'json', category: 'certificate', description: 'View certificate details as JSON' },
];

export const categories = [
  { id: 'image', name: 'Image Tools', icon: '🖼️', description: 'Convert and optimize images' },
  { id: 'pdf', name: 'PDF Tools', icon: '📄', description: 'PDF conversion and manipulation' },
  { id: 'document', name: 'Document Tools', icon: '📝', description: 'Document conversions' },
  { id: 'data', name: 'Data Tools', icon: '📊', description: 'Data format conversions' },
  { id: 'certificate', name: 'Certificate Tools', icon: '🔐', description: 'SSL/TLS certificate conversions' },
  { id: 'archive', name: 'Archive Tools', icon: '📦', description: 'Compression and archives' },
  { id: 'utility', name: 'Utilities', icon: '🔧', description: 'Other useful tools' },
];

export function getConversionById(id: string): ConversionType | undefined {
  return conversions.find(c => c.id === id);
}

export function getPopularConversions(): ConversionType[] {
  return conversions.filter(c => c.popular);
}

export function getConversionsByCategory(category: string): ConversionType[] {
  return conversions.filter(c => c.category === category);
}