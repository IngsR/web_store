'use client';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

interface ProductSettingsListProps {
    products: Product[];
    loading: boolean;
    productKey: 'isPromo' | 'isFeatured';
    onToggle: (productId: string, value: boolean) => void;
    searchPlaceholder: string;
}

export default function ProductSettingsList({
    products,
    loading,
    productKey,
    onToggle,
    searchPlaceholder,
}: ProductSettingsListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [products, searchTerm]);

    const activeCount = products.filter((p) => p[productKey]).length;
    const idPrefix = productKey.replace('is', '').toLowerCase();

    if (loading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Search + Counter */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-9 text-sm"
                    />
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs font-medium px-2.5">
                    {activeCount} aktif
                </Badge>
            </div>

            {/* Product List */}
            {filteredProducts.length > 0 ? (
                <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {filteredProducts.map((product) => {
                        const isActive = product[productKey];
                        return (
                            <li
                                key={product.id}
                                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                                    isActive
                                        ? 'bg-accent border-primary/30'
                                        : 'bg-background border-border hover:bg-muted/50'
                                }`}
                                onClick={() => onToggle(product.id, !isActive)}
                            >
                                <div className="min-w-0 flex-1">
                                    <p className={`text-sm font-medium truncate leading-tight ${isActive ? 'text-accent-foreground' : 'text-foreground'}`}>
                                        {product.name}
                                    </p>
                                </div>
                                <Switch
                                    id={`${idPrefix}-${product.id}`}
                                    checked={isActive}
                                    onCheckedChange={(checked) => onToggle(product.id, checked)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="shrink-0"
                                />
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        {searchTerm ? `Tidak ada produk untuk "${searchTerm}"` : 'Belum ada produk.'}
                    </p>
                </div>
            )}
        </div>
    );
}
