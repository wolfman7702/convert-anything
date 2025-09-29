import Link from 'next/link';
import { categories } from '@/lib/conversionMap';

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className="p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-center group"
        >
          <div className="text-4xl mb-3">{category.icon}</div>
          <div className="font-semibold text-gray-900 group-hover:text-blue-600">{category.name}</div>
          <div className="text-sm text-gray-500 mt-1">{category.description}</div>
        </Link>
      ))}
    </div>
  );
}

