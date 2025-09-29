'use client';

import { Download } from 'lucide-react';

interface DownloadButtonProps {
  blob: Blob;
  filename: string;
  onDownload?: () => void;
}

export default function DownloadButton({ blob, filename, onDownload }: DownloadButtonProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
    >
      <Download className="w-5 h-5" />
      <span>Download {filename}</span>
    </button>
  );
}

