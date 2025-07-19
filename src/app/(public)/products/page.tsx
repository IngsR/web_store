'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product-card';
import ProductFilters from '@/components/product-filters';
import type { Product } from '@/lib/types';

const ALL_CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Sport', 'Listrik'];
const MAX_PRICE = 5000000000;

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        categories: searchParams.get('category')
            ? [searchParams.get('category')!]
            : [],
        priceRange: [0, MAX_PRICE] as [number, number],
    });
    const [sortBy, setSortBy] = useState('popularity');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();

        if (searchQuery) {
            params.append('q', searchQuery);
        }
        filters.categories.forEach((cat) => params.append('category', cat));
        params.append('priceMin', String(filters.priceRange[0]));
        params.append('priceMax', String(filters.priceRange[1]));
        params.append('sortBy', sortBy);

        try {
            const res = await fetch(`/api/products?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
                setProducts([]);
            }
        } catch (error) {
            console.error('An error occurred while fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters, searchQuery, sortBy]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

    return (
        <main className="container mx-auto px-4 py-12">
            <div className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary">
                    Semua Mobil Kami
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Temukan mobil impian Anda dari koleksi terbaik kami.
                </p>
            </div>

            <div className="mb-8">
                <ProductFilters
                    filters={filters}
                    setFilters={setFilters}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    categories={ALL_CATEGORIES}
                    maxPrice={MAX_PRICE}
                    resultsCount={products.length}
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <ProductCard.Skeleton key={i} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center text-center text-muted-foreground">
                    <h2 className="text-2xl font-semibold">
                        Mobil tidak ditemukan
                    </h2>
                    <p className="mt-2">
                        Tidak ada mobil yang cocok dengan filter Anda. Coba
                        sesuaikan pencarian Anda.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
}
