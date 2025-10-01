import React from 'react';
import { 
  FileText, 
  Camera, 
  Video, 
  Music, 
  Archive, 
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  Presentation,
  FileCode,
  FileJson
} from 'lucide-react';

interface FileTypeIconProps {
  fileType: string;
  size?: number;
  className?: string;
}

const FileTypeIcon: React.FC<FileTypeIconProps> = ({ 
  fileType, 
  size = 64, 
  className = '' 
}) => {
  const iconStyle = {
    width: size,
    height: size,
  };

  // Normalize file type to lowercase
  const normalizedType = fileType.toLowerCase();

  // Brand-specific icons with proper colors
  if (normalizedType === 'pdf') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={iconStyle}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={iconStyle}
        >
          <rect width="24" height="24" rx="4" fill="#DC4C2C"/>
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="8"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            PDF
          </text>
        </svg>
      </div>
    );
  }

  if (normalizedType === 'docx' || normalizedType === 'doc') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={iconStyle}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={iconStyle}
        >
          <rect width="24" height="24" rx="4" fill="#2B579A"/>
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            W
          </text>
        </svg>
      </div>
    );
  }

  if (normalizedType === 'xlsx' || normalizedType === 'xls') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={iconStyle}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={iconStyle}
        >
          <rect width="24" height="24" rx="4" fill="#217346"/>
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            X
          </text>
        </svg>
      </div>
    );
  }

  if (normalizedType === 'pptx' || normalizedType === 'ppt') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={iconStyle}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={iconStyle}
        >
          <rect width="24" height="24" rx="4" fill="#D24726"/>
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            P
          </text>
        </svg>
      </div>
    );
  }

  // Image formats
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg', 'ico'].includes(normalizedType)) {
    return (
      <div className={`flex items-center justify-center text-purple-500 ${className}`} style={iconStyle}>
        <Camera size={size} />
      </div>
    );
  }

  // Video formats
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'].includes(normalizedType)) {
    return (
      <div className={`flex items-center justify-center text-red-500 ${className}`} style={iconStyle}>
        <Video size={size} />
      </div>
    );
  }

  // Audio formats
  if (['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma'].includes(normalizedType)) {
    return (
      <div className={`flex items-center justify-center text-blue-500 ${className}`} style={iconStyle}>
        <FileAudio size={size} />
      </div>
    );
  }

  // Archive formats
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(normalizedType)) {
    return (
      <div className={`flex items-center justify-center text-yellow-500 ${className}`} style={iconStyle}>
        <FileArchive size={size} />
      </div>
    );
  }

  // Data formats
  if (['csv', 'json', 'xml', 'yaml', 'yml'].includes(normalizedType)) {
    return (
      <div className={`flex items-center justify-center text-green-500 ${className}`} style={iconStyle}>
        <FileSpreadsheet size={size} />
      </div>
    );
  }

  // Document formats
  if (['txt', 'md', 'rtf', 'odt'].includes(normalizedType)) {
    return (
      <div className={`flex items-center justify-center text-gray-500 ${className}`} style={iconStyle}>
        <FileText size={size} />
      </div>
    );
  }

  // HTML/CSS/JS
  if (['html', 'htm', 'css', 'js', 'ts', 'jsx', 'tsx'].includes(normalizedType)) {
    return (
      <div className={`flex items-center justify-center text-orange-500 ${className}`} style={iconStyle}>
        <FileCode size={size} />
      </div>
    );
  }

  // Default fallback with emoji
  const emojiMap: { [key: string]: string } = {
    'mp3': '🎵',
    'zip': '📦',
    'txt': '📄',
    'html': '🌐',
    'css': '🎨',
    'js': '⚡',
    'json': '📋',
    'xml': '📄',
    'csv': '📊',
    'md': '📝',
    'rtf': '📄',
    'odt': '📄',
    'default': '📁'
  };

  const emoji = emojiMap[normalizedType] || emojiMap['default'];

  return (
    <div className={`flex items-center justify-center text-4xl ${className}`} style={iconStyle}>
      {emoji}
    </div>
  );
};

export default FileTypeIcon;
