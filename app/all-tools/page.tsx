import { conversions, categories } from '@/lib/conversionMap';
import FileTypeIcon from '@/components/FileTypeIcon';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AllToolsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Conversion Tools</h1>
        <p className="text-lg text-gray-600">Browse all 145+ conversion tools organized by category</p>
      </div>

      {categories.map((category) => {
        const categoryConversions = conversions.filter(c => c.category === category.id);
        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{category.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categoryConversions.map((conversion) => (
                <Link
                  key={conversion.id}
                  href={`/${conversion.id}`}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
                >
                  {/* File Type Icons */}
                  <div className="flex items-center justify-center mb-2">
                    <div className="flex items-center space-x-1">
                      <FileTypeIcon 
                        fileType={conversion.from} 
                        size={24} 
                        className="transition-transform group-hover:scale-110" 
                      />
                      <ArrowRight 
                        size={12} 
                        className="text-gray-400 group-hover:text-blue-500" 
                      />
                      <FileTypeIcon 
                        fileType={conversion.to} 
                        size={24} 
                        className="transition-transform group-hover:scale-110" 
                      />
                    </div>
                  </div>
                  <div className="font-medium text-gray-900 text-sm mb-1">{conversion.name}</div>
                  <div className="text-xs text-blue-600 mb-1">{conversion.from.toUpperCase()} → {conversion.to.toUpperCase()}</div>
                  <div className="text-xs text-gray-500">{conversion.description}</div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

