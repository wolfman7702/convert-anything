import { getConversionById } from '@/lib/conversionMap';
import ConversionPage from '@/components/ConversionPage';
import { notFound } from 'next/navigation';
import Head from 'next/head';

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
      <div className="max-w-7xl mx-auto">
        <ConversionPage conversion={conversion} />
      </div>
    </>
  );
}

