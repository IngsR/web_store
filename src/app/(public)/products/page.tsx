'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/product-card';
import ProductFilters, { type FilterState } from '@/components/product-filters';
import type { Product } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, Package, RotateCcw } from 'lucide-react';

const MAX_PRICE = 35000000000;

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [allCategories, setAllCategories] = useState<string[]>([]);

    const [filters, setFilters] = useState<FilterState>({
        categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
        conditions: searchParams.get('condition') ? [searchParams.get('condition')!] : [],
        fuelTypes: searchParams.get('fuelType') ? [searchParams.get('fuelType')!] : [],
        isPromo: searchParams.get('promo') === 'true',
        priceMin: 0,
        priceMax: MAX_PRICE,
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
        filters.conditions.forEach((cond) => params.append('condition', cond));
        filters.fuelTypes.forEach((fuel) => params.append('fuelType', fuel));
        if (filters.isPromo) {
            params.append('promo', 'true');
        }
        if (filters.priceMin > 0) {
            params.append('priceMin', String(filters.priceMin));
        }
        if (filters.priceMax < MAX_PRICE) {
            params.append('priceMax', String(filters.priceMax));
        }
        params.append('sortBy', sortBy);

        try {
            const res = await fetch(`/api/products?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            } else {
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
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/products/categories');
                if (res.ok) {
                    const data = await res.json();
                    setAllCategories(data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const handleResetAll = () => {
        setFilters({
            categories: [],
            conditions: [],
            fuelTypes: [],
            isPromo: false,
            priceMin: 0,
            priceMax: MAX_PRICE,
        });
        setSearchQuery('');
    };

    // Quick filter shortcuts
    const setQuickCondition = (cond: string | null) => {
        setFilters((prev) => ({
            ...prev,
            conditions: cond ? [cond] : [],
        }));
    };

    return (
        <div className="container mx-auto px-3 sm:px-4 md:px-8 py-5 sm:py-8 max-w-7xl">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" />
                    <span>Home</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                <span className="font-semibold text-foreground">Semua Produk</span>
                {searchQuery && (
                    <>
                        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                        <span className="text-primary italic truncate max-w-[150px]">"{searchQuery}"</span>
                    </>
                )}
            </nav>

            {/* Page Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b">
                <div>
                    <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                        Semua Produk
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        Katalog produk lengkap dengan jaminan kualitas terbaik dan penawaran cicilan ringan.
                    </p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0 font-medium">
                    Menampilkan <span className="font-bold text-foreground">{products.length}</span> produk
                </p>
            </div>

            {/* Main Layout: Left Sidebar Filter + Right Product Catalog */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                {/* 1. LEFT SIDEBAR FILTER (Desktop only) */}
                <ProductFilters
                    mode="sidebar"
                    filters={filters}
                    setFilters={setFilters}
                    categories={allCategories}
                    maxPrice={MAX_PRICE}
                    resultsCount={products.length}
                    onReset={handleResetAll}
                />

                {/* 2. RIGHT PRODUCTS CATALOG */}
                <div className="flex-1 min-w-0 w-full space-y-4">
                    {/* Top Control Bar: Mobile Filter Button, Quick Filter Chips, and Sorting */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-spinner">
                            {/* Mobile Filter Button (renders only on mobile) */}
                            <ProductFilters
                                mode="mobile-button"
                                filters={filters}
                                setFilters={setFilters}
                                categories={allCategories}
                                maxPrice={MAX_PRICE}
                                resultsCount={products.length}
                                onReset={handleResetAll}
                            />

                            {/* Quick Filter Chips */}
                            <button
                                type="button"
                                onClick={() => {
                                    setQuickCondition(null);
                                    setFilters((prev) => ({ ...prev, isPromo: false }));
                                }}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap font-medium ${
                                    filters.conditions.length === 0 && !filters.isPromo
                                        ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm'
                                        : 'bg-muted/30 hover:bg-muted text-muted-foreground border-border'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                type="button"
                                onClick={() => setQuickCondition('Baru')}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap font-medium ${
                                    filters.conditions.includes('Baru')
                                        ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm'
                                        : 'bg-muted/30 hover:bg-muted text-muted-foreground border-border'
                                }`}
                            >
                                Unit Baru
                            </button>
                            <button
                                type="button"
                                onClick={() => setQuickCondition('Bekas')}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap font-medium ${
                                    filters.conditions.includes('Bekas')
                                        ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm'
                                        : 'bg-muted/30 hover:bg-muted text-muted-foreground border-border'
                                }`}
                            >
                                Unit Bekas
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        isPromo: !prev.isPromo,
                                    }))
                                }
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap font-medium ${
                                    filters.isPromo
                                        ? 'bg-destructive text-destructive-foreground border-destructive font-bold shadow-sm'
                                        : 'bg-muted/30 hover:bg-muted text-muted-foreground border-border'
                                }`}
                            >
                                Promo / Diskon
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-muted-foreground hidden sm:inline">Urutkan:</span>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[150px] sm:w-[170px] h-9 text-xs font-semibold bg-background">
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem value="popularity" className="text-xs">
                                        Paling Populer
                                    </SelectItem>
                                    <SelectItem value="newest" className="text-xs">
                                        Produk Terbaru
                                    </SelectItem>
                                    <SelectItem value="price-asc" className="text-xs">
                                        Harga Terendah
                                    </SelectItem>
                                    <SelectItem value="price-desc" className="text-xs">
                                        Harga Tertinggi
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Products Grid: 2 columns on mobile, 3-4 columns on desktop */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ProductCard.Skeleton key={i} />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed bg-card space-y-3">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                <Package className="h-7 w-7" />
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-foreground">
                                Produk Tidak Ditemukan
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                                Tidak ada produk yang sesuai dengan kriteria filter Anda. Coba hapus beberapa filter untuk menemukan produk yang diinginkan.
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleResetAll}
                                className="text-xs font-semibold gap-1.5 mt-2"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset Semua Filter
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                    Memuat katalog produk...
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
