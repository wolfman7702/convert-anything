'use client';

import { useState, useEffect } from 'react';
import { FileText, Image as ImageIcon, X } from 'lucide-react';

interface FilePreviewProps {
	files: File[];
	onRemove?: (index: number) => void;
}

export default function FilePreview({ files, onRemove }: FilePreviewProps) {
	const [previews, setPreviews] = useState<string[]>([]);

	useEffect(() => {
		const newPreviews: string[] = [];
		files.forEach(file => {
			if (file.type.startsWith('image/')) {
				newPreviews.push(URL.createObjectURL(file));
			} else if (file.type === 'application/pdf') {
				newPreviews.push('pdf-icon');
			} else {
				newPreviews.push('file-icon');
			}
		});
		setPreviews(newPreviews);
		return () => {
			newPreviews.forEach(url => {
				if (url.startsWith('blob:')) URL.revokeObjectURL(url);
			});
		};
	}, [files]);

	if (files.length === 0) return null;

	return (
		<div className="mt-6 space-y-3">
			<h3 className="text-sm font-medium text-gray-700">File Preview</h3>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{files.map((file, index) => (
					<div key={index} className="relative border-2 border-gray-200 rounded-lg p-3">
						{onRemove && (
							<button
								onClick={() => onRemove(index)}
								className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
							>
								<X className="w-4 h-4" />
							</button>
						)}

						{file.type.startsWith('image/') && previews[index]?.startsWith('blob:') ? (
							<img src={previews[index]} alt={file.name} className="w-full h-32 object-cover rounded mb-2" />
						) : file.type === 'application/pdf' ? (
							<div className="w-full h-32 bg-red-50 rounded mb-2 flex items-center justify-center">
								<FileText className="w-12 h-12 text-red-600" />
							</div>
						) : (
							<div className="w-full h-32 bg-gray-50 rounded mb-2 flex items-center justify-center">
								<ImageIcon className="w-12 h-12 text-gray-400" />
							</div>
						)}

						<div className="text-xs truncate text-gray-600">{file.name}</div>
						<div className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
					</div>
				))}
			</div>
		</div>
	);
}


