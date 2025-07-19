'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import type { Product } from '@/lib/types';
import { useMemo, useState } from 'react';

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

    const idPrefix = productKey.replace('is', '').toLowerCase();

    return (
        <>
            <div className="mb-4">
                <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : filteredProducts.length > 0 ? (
                <ul className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {filteredProducts.map((product) => (
                        <li
                            key={product.id}
                            className="flex items-center justify-between p-3 rounded-md border"
                        >
                            <Label
                                htmlFor={`${idPrefix}-${product.id}`}
                                className="font-medium"
                            >
                                {product.name}
                            </Label>
                            <Switch
                                id={`${idPrefix}-${product.id}`}
                                checked={product[productKey]}
                                onCheckedChange={(checked) =>
                                    onToggle(product.id, checked)
                                }
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                    No products found matching your search.
                </p>
            )}
        </>
    );
}
