'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(defaultQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 h-10 bg-muted"
          aria-label="Search products"
        />
      </div>
    </form>
  );
}
