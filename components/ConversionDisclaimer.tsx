import { AlertCircle } from 'lucide-react';

interface ConversionDisclaimerProps {
  conversionId: string;
}

export default function ConversionDisclaimer({ conversionId }: ConversionDisclaimerProps) {
  const disclaimers: Record<string, string> = {
    'html-to-docx': 'Complex formatting, images, and styles may not be preserved.',
    'txt-to-docx': 'Creates a basic Word document with plain text.',
    'odt-to-docx': 'Formatting and styles may be simplified or lost.',
    'rtf-to-docx': 'Advanced formatting may not transfer correctly.',
    'docx-to-rtf': 'Some Word-specific features may not convert.',
    'docx-to-odt': 'This is a simplified conversion - formatting may be lost.',
    'pdf-to-txt': 'Text extraction is basic and may not capture formatting or layout.',
    'text-to-speech': 'Uses your browser\'s built-in text-to-speech (no download).',
  };

  const disclaimer = disclaimers[conversionId];
  
  if (!disclaimer) return null;

  return (
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-yellow-800">
        <strong>Note:</strong> {disclaimer}
      </div>
    </div>
  );
}
