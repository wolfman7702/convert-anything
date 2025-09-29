import { getConversionById } from '@/lib/conversionMap';
import ConversionPage from '@/components/ConversionPage';
import { notFound } from 'next/navigation';

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
    <div className="max-w-7xl mx-auto">
      <ConversionPage conversion={conversion} />
    </div>
  );
}

