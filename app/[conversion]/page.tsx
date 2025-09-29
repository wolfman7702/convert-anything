import { getConversionById } from '@/lib/conversionMap';
import ConversionPage from '@/components/ConversionPage';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [];
}

export default function ConversionRoute({ params }: { params: { conversion: string } }) {
  const conversion = getConversionById(params.conversion);
  if (!conversion) {
    notFound();
  }
  return (
    <div className="max-w-7xl mx-auto">
      <ConversionPage conversion={conversion} />
    </div>
  );
}

