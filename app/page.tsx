import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import FileTypeIcon from '@/components/FileTypeIcon';
import { getPopularConversions } from '@/lib/conversionMap';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Head from 'next/head';

export default function Home() {
  const popularConversions = getPopularConversions();

  return (
    <>
      <Head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-EJ0XSFKCTQ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EJ0XSFKCTQ');
            `,
          }}
        />
      </Head>
      <div className="max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ConvertingHub</span> - Convert Anything
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          185+ free file conversion tools. Images, PDFs, videos, documents, and more.
          Everything happens in your browser - completely private and secure.
        </p>
        <div className="pt-6">
          <SearchBar />
        </div>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 pt-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100% Free</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No Limits</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Private</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Popular Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularConversions.map((conversion) => (
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
                <div className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 mb-1">
                  {conversion.from.toUpperCase()} → {conversion.to.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">{conversion.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Browse by Category</h2>
        <CategoryGrid />
      </div>

      <div className="grid md:grid-cols-3 gap-8 pt-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Lightning Fast</h3>
          <p className="text-gray-600">No upload or download times. Conversions happen instantly in your browser.</p>
        </div>
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Completely Private</h3>
          <p className="text-gray-600">Your files never leave your device. All processing happens locally in your browser.</p>
        </div>
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Unlimited Usage</h3>
          <p className="text-gray-600">Convert as many files as you want. No registration, no limits, no restrictions.</p>
        </div>
      </div>
      </div>
    </>
  );
}

