'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { conversions } from '@/lib/conversionMap';
import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof conversions>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = conversions.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()) ||
          c.from.toLowerCase().includes(query.toLowerCase()) ||
          c.to.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="What do you want to convert?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none shadow-sm"
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/${result.id}`}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <div className="font-medium text-gray-900">{result.name}</div>
              <div className="text-sm text-gray-500">{result.description}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

