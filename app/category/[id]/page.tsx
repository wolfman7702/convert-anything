import { getConversionsByCategory, categories } from '@/lib/conversionMap';
import FileTypeIcon from '@/components/FileTypeIcon';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Script from 'next/script';

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = categories.find(c => c.id === id);
  if (!category) {
    notFound();
  }
  const conversions = getConversionsByCategory(id);

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-EJ0XSFKCTQ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EJ0XSFKCTQ');
        `}
      </Script>
      <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="text-6xl">{category.icon}</div>
        <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
        <p className="text-lg text-gray-600">{category.description}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {conversions.map((conversion) => (
          <Link
            key={conversion.id}
            href={`/${conversion.id}`}
            className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-center">
              {/* File Type Icons */}
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center space-x-2">
                  <FileTypeIcon 
                    fileType={conversion.from} 
                    size={32} 
                    className="transition-transform group-hover:scale-110" 
                  />
                  <ArrowRight 
                    size={16} 
                    className="text-gray-400 group-hover:text-blue-500" 
                  />
                  <FileTypeIcon 
                    fileType={conversion.to} 
                    size={32} 
                    className="transition-transform group-hover:scale-110" 
                  />
                </div>
              </div>
              <div className="font-semibold text-gray-900 mb-2">{conversion.name}</div>
              <div className="text-sm text-blue-600 mb-2">{conversion.from.toUpperCase()} → {conversion.to.toUpperCase()}</div>
              <div className="text-xs text-gray-500">{conversion.description}</div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </>
  );
}

