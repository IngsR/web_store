'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

function SearchInputInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full relative">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Cari produk..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 pr-3 h-8 sm:h-9 text-xs sm:text-sm rounded-full bg-muted/60 hover:bg-muted focus:bg-background border-border/80 transition-all placeholder:text-muted-foreground/80 focus-visible:ring-1 focus-visible:ring-primary"
          aria-label="Cari produk"
        />
      </div>
    </form>
  );
}

export default function SearchInput() {
  return (
    <Suspense
      fallback={
        <div className="w-full relative flex items-center">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
          <div className="w-full h-8 sm:h-9 rounded-full bg-muted/60 border border-border/80" />
        </div>
      }
    >
      <SearchInputInner />
    </Suspense>
  );
}
