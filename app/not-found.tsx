import Link from 'next/link';
import Script from 'next/script';

export default function NotFound() {
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
      <div className="max-w-2xl mx-auto text-center py-20">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        The conversion tool you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </Link>
      </div>
    </>
  );
}

