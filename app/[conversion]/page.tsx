import { getConversionById } from '@/lib/conversionMap';
import ConversionPage from '@/components/ConversionPage';
import { notFound } from 'next/navigation';
import Script from 'next/script';

export function generateStaticParams() {
  return [];
}

export default async function ConversionRoute({ params }: { params: Promise<{ conversion: string }> }) {
  const { conversion: conversionId } = await params;
  const conversion = getConversionById(conversionId);
  if (!conversion) {
    notFound();
  }
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
      <div className="max-w-7xl mx-auto">
        <ConversionPage conversion={conversion} />
      </div>
    </>
  );
}

