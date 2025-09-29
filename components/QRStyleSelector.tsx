'use client';

import { useState } from 'react';

export interface QRStyle {
  id: string;
  name: string;
  preview: string;
  dotsOptions: any;
  cornersSquareOptions?: any;
  cornersDotOptions?: any;
}

export const qrStyles: QRStyle[] = [
  {
    id: 'classic',
    name: 'Classic',
    preview: '⬛',
    dotsOptions: { type: 'square' },
  },
  {
    id: 'rounded',
    name: 'Rounded',
    preview: '⚫',
    dotsOptions: { type: 'rounded' },
    cornersSquareOptions: { type: 'extra-rounded' },
    cornersDotOptions: { type: 'dot' }
  },
  {
    id: 'dots',
    name: 'Dots',
    preview: '••',
    dotsOptions: { type: 'dots' },
    cornersSquareOptions: { type: 'dot' },
    cornersDotOptions: { type: 'dot' }
  },
  {
    id: 'classy',
    name: 'Classy',
    preview: '◆',
    dotsOptions: { type: 'classy' },
    cornersSquareOptions: { type: 'extra-rounded' }
  },
  {
    id: 'classy-rounded',
    name: 'Classy Rounded',
    preview: '◈',
    dotsOptions: { type: 'classy-rounded' },
    cornersSquareOptions: { type: 'extra-rounded' }
  },
  {
    id: 'extra-rounded',
    name: 'Extra Rounded',
    preview: '●',
    dotsOptions: { type: 'extra-rounded' },
    cornersSquareOptions: { type: 'extra-rounded' },
    cornersDotOptions: { type: 'dot' }
  },
  {
    id: 'sharp',
    name: 'Sharp',
    preview: '▪',
    dotsOptions: { type: 'square' },
    cornersSquareOptions: { type: 'square' }
  }
];

interface QRStyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
}

export default function QRStyleSelector({ selectedStyle, onStyleChange }: QRStyleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">QR Code Style</label>
      <div className="grid grid-cols-3 gap-3">
        {qrStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              selectedStyle === style.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">{style.preview}</div>
            <div className="text-xs font-medium text-gray-700">{style.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
