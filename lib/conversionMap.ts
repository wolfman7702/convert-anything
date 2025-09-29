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
  { id: 'gif-to-mp4', name: 'GIF to MP4', from: 'gif', to: 'mp4', category: 'image', description: 'Convert animated GIF to MP4 video' },
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
  { id: 'pdf-to-word', name: 'PDF to Word', from: 'pdf', to: 'docx', category: 'pdf', description: 'Convert PDF to Word document' },
  { id: 'word-to-pdf', name: 'Word to PDF', from: 'docx', to: 'pdf', category: 'pdf', description: 'Convert Word document to PDF', popular: true },
  { id: 'excel-to-pdf', name: 'Excel to PDF', from: 'xlsx', to: 'pdf', category: 'pdf', description: 'Convert Excel to PDF' },
  { id: 'powerpoint-to-pdf', name: 'PowerPoint to PDF', from: 'pptx', to: 'pdf', category: 'pdf', description: 'Convert PowerPoint to PDF' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', from: 'pdf', to: 'xlsx', category: 'pdf', description: 'Convert PDF tables to Excel' },
  { id: 'pdf-to-powerpoint', name: 'PDF to PowerPoint', from: 'pdf', to: 'pptx', category: 'pdf', description: 'Convert PDF to PowerPoint' },
  { id: 'pdf-to-csv', name: 'PDF to CSV', from: 'pdf', to: 'csv', category: 'pdf', description: 'Extract tables from PDF to CSV' },
  { id: 'pdf-to-html', name: 'PDF to HTML', from: 'pdf', to: 'html', category: 'pdf', description: 'Convert PDF to HTML' },
  { id: 'pdf-to-epub', name: 'PDF to EPUB', from: 'pdf', to: 'epub', category: 'pdf', description: 'Convert PDF to EPUB ebook' },
  { id: 'pdf-to-mobi', name: 'PDF to MOBI', from: 'pdf', to: 'mobi', category: 'pdf', description: 'Convert PDF to MOBI ebook' },
  { id: 'pdf-to-azw3', name: 'PDF to AZW3', from: 'pdf', to: 'azw3', category: 'pdf', description: 'Convert PDF to AZW3 ebook' },
  { id: 'pdf-to-fb2', name: 'PDF to FB2', from: 'pdf', to: 'fb2', category: 'pdf', description: 'Convert PDF to FB2 ebook' },
  { id: 'pdf-to-rtf', name: 'PDF to RTF', from: 'pdf', to: 'rtf', category: 'pdf', description: 'Convert PDF to RTF document' },
  { id: 'pdf-to-odt', name: 'PDF to ODT', from: 'pdf', to: 'odt', category: 'pdf', description: 'Convert PDF to OpenDocument Text' },

  // DOCUMENT CONVERSIONS (15+)
  { id: 'docx-to-pdf', name: 'DOCX to PDF', from: 'docx', to: 'pdf', category: 'document', description: 'Convert Word documents to PDF', popular: true },
  { id: 'docx-to-html', name: 'DOCX to HTML', from: 'docx', to: 'html', category: 'document', description: 'Convert Word to HTML' },
  { id: 'docx-to-txt', name: 'DOCX to TXT', from: 'docx', to: 'txt', category: 'document', description: 'Convert Word to plain text' },
  { id: 'html-to-docx', name: 'HTML to DOCX', from: 'html', to: 'docx', category: 'document', description: 'Convert HTML to Word' },
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

  // AUDIO CONVERSIONS (15+)
  { id: 'mp3-to-wav', name: 'MP3 to WAV', from: 'mp3', to: 'wav', category: 'audio', description: 'Convert MP3 to WAV format' },
  { id: 'wav-to-mp3', name: 'WAV to MP3', from: 'wav', to: 'mp3', category: 'audio', description: 'Convert WAV to MP3 format' },
  { id: 'mp3-to-ogg', name: 'MP3 to OGG', from: 'mp3', to: 'ogg', category: 'audio', description: 'Convert MP3 to OGG format' },
  { id: 'ogg-to-mp3', name: 'OGG to MP3', from: 'ogg', to: 'mp3', category: 'audio', description: 'Convert OGG to MP3 format' },
  { id: 'mp3-to-m4a', name: 'MP3 to M4A', from: 'mp3', to: 'm4a', category: 'audio', description: 'Convert MP3 to M4A format' },
  { id: 'm4a-to-mp3', name: 'M4A to MP3', from: 'm4a', to: 'mp3', category: 'audio', description: 'Convert M4A to MP3 format' },
  { id: 'video-to-mp3', name: 'Video to MP3', from: 'video', to: 'mp3', category: 'audio', description: 'Extract audio from video', popular: true },
  { id: 'trim-audio', name: 'Trim Audio', from: 'audio', to: 'audio', category: 'audio', description: 'Cut audio files' },
  { id: 'flac-to-mp3', name: 'FLAC to MP3', from: 'flac', to: 'mp3', category: 'audio', description: 'Convert FLAC to MP3 format' },
  { id: 'mp3-to-flac', name: 'MP3 to FLAC', from: 'mp3', to: 'flac', category: 'audio', description: 'Convert MP3 to FLAC format' },
  { id: 'aac-to-mp3', name: 'AAC to MP3', from: 'aac', to: 'mp3', category: 'audio', description: 'Convert AAC to MP3 format' },
  { id: 'mp3-to-aac', name: 'MP3 to AAC', from: 'mp3', to: 'aac', category: 'audio', description: 'Convert MP3 to AAC format' },
  { id: 'wma-to-mp3', name: 'WMA to MP3', from: 'wma', to: 'mp3', category: 'audio', description: 'Convert WMA to MP3 format' },
  { id: 'mp3-to-wma', name: 'MP3 to WMA', from: 'mp3', to: 'wma', category: 'audio', description: 'Convert MP3 to WMA format' },
  { id: 'audio-to-mp3', name: 'Audio to MP3', from: 'audio', to: 'mp3', category: 'audio', description: 'Convert any audio format to MP3' },

  // VIDEO CONVERSIONS (15+)
  { id: 'mp4-to-webm', name: 'MP4 to WEBM', from: 'mp4', to: 'webm', category: 'video', description: 'Convert MP4 to WEBM format' },
  { id: 'webm-to-mp4', name: 'WEBM to MP4', from: 'webm', to: 'mp4', category: 'video', description: 'Convert WEBM to MP4 format' },
  { id: 'mp4-to-avi', name: 'MP4 to AVI', from: 'mp4', to: 'avi', category: 'video', description: 'Convert MP4 to AVI format' },
  { id: 'avi-to-mp4', name: 'AVI to MP4', from: 'avi', to: 'mp4', category: 'video', description: 'Convert AVI to MP4 format' },
  { id: 'mov-to-mp4', name: 'MOV to MP4', from: 'mov', to: 'mp4', category: 'video', description: 'Convert MOV to MP4 format' },
  { id: 'mp4-to-mov', name: 'MP4 to MOV', from: 'mp4', to: 'mov', category: 'video', description: 'Convert MP4 to MOV format' },
  { id: 'video-to-gif', name: 'Video to GIF', from: 'video', to: 'gif', category: 'video', description: 'Create GIF from video', popular: true },
  { id: 'compress-video', name: 'Compress Video', from: 'video', to: 'video', category: 'video', description: 'Reduce video file size' },
  { id: 'trim-video', name: 'Trim Video', from: 'video', to: 'video', category: 'video', description: 'Cut video files' },
  { id: 'video-to-frames', name: 'Video to Frames', from: 'video', to: 'images', category: 'video', description: 'Extract frames from video' },
  { id: 'mkv-to-mp4', name: 'MKV to MP4', from: 'mkv', to: 'mp4', category: 'video', description: 'Convert MKV to MP4 format' },
  { id: 'mp4-to-mkv', name: 'MP4 to MKV', from: 'mp4', to: 'mkv', category: 'video', description: 'Convert MP4 to MKV format' },
  { id: 'flv-to-mp4', name: 'FLV to MP4', from: 'flv', to: 'mp4', category: 'video', description: 'Convert FLV to MP4 format' },
  { id: 'wmv-to-mp4', name: 'WMV to MP4', from: 'wmv', to: 'mp4', category: 'video', description: 'Convert WMV to MP4 format' },
  { id: 'video-to-mp4', name: 'Video to MP4', from: 'video', to: 'mp4', category: 'video', description: 'Convert any video format to MP4' },

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
  { id: 'text-to-speech', name: 'Text to Speech', from: 'text', to: 'audio', category: 'utility', description: 'Convert text to speech audio' },
  { id: 'speech-to-text', name: 'Speech to Text', from: 'audio', to: 'text', category: 'utility', description: 'Convert speech to text' },
  { id: 'color-picker', name: 'Color Picker', from: 'image', to: 'color', category: 'utility', description: 'Extract colors from images' },
  { id: 'image-to-ascii', name: 'Image to ASCII', from: 'image', to: 'text', category: 'utility', description: 'Convert images to ASCII art' },
];

export const categories = [
  { id: 'image', name: 'Image Tools', icon: '🖼️', description: 'Convert and optimize images' },
  { id: 'pdf', name: 'PDF Tools', icon: '📄', description: 'PDF conversion and manipulation' },
  { id: 'video', name: 'Video Tools', icon: '🎥', description: 'Video format conversions' },
  { id: 'audio', name: 'Audio Tools', icon: '🎵', description: 'Audio format conversions' },
  { id: 'document', name: 'Document Tools', icon: '📝', description: 'Document conversions' },
  { id: 'data', name: 'Data Tools', icon: '📊', description: 'Data format conversions' },
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

