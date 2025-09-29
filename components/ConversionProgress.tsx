'use client';

import { Loader2 } from 'lucide-react';

interface ConversionProgressProps {
  progress: number;
  status: string;
}

export default function ConversionProgress({ progress, status }: ConversionProgressProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <div className="text-center mb-4">
        <div className="text-lg font-medium text-gray-900 mb-1">{status}</div>
        <div className="text-sm text-gray-500">{Math.round(progress)}% complete</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="bg-blue-600 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

