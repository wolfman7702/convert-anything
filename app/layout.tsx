import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConvertingHub - Free Online File Converter',
  description: 'Convert images, PDFs, videos, audio, documents, and more. 185+ conversion tools. 100% free and private.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
          {children}
        </main>
        <footer className="bg-white border-t py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
            <p className="mb-2">© 2025 ConvertingHub. All conversions happen in your browser.</p>
            <p className="text-sm">No uploads, no storage, complete privacy.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

