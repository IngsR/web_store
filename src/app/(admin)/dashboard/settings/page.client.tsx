'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import JumpingDotsLoader from '@/components/ui/jumping-dots-loader';
import type { Product } from '@/lib/types';
import ProductSettingsList from './_components/product-settings-list';

export default function SettingsPageClient({
    initialProducts,
}: {
    initialProducts: Product[];
}) {
    const { toast } = useToast();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const handleToggle = (
        productId: string,
        key: 'isFeatured' | 'isPromo',
        value: boolean,
    ) => {
        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.id === productId ? { ...p, [key]: value } : p,
            ),
        );
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);

        const featuredProductIds = products
            .filter((p) => p.isFeatured)
            .map((p) => p.id);
        const promoProductIds = products
            .filter((p) => p.isPromo)
            .map((p) => p.id);

        try {
            const res = await fetch('/api/settings/homepage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    featuredProductIds,
                    promoProductIds,
                }),
                credentials: 'include',
            });

            if (res.ok) {
                toast({
                    title: 'Success',
                    description: 'Homepage settings have been updated.',
                    variant: 'success',
                });
                router.refresh();
            } else {
                const errorData = await res.json();
                toast({
                    title: 'Error',
                    description:
                        errorData.message ||
                        'Failed to update homepage settings.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">
                Homepage Settings
            </h1>

            {/* Promo Products */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage Promo Products</CardTitle>
                    <CardDescription>
                        Pilih mobil mana yang akan ditampilkan sebagai "Promo
                        Mobil Terbaru" dalam carousel di halaman utama.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductSettingsList
                        products={products}
                        loading={false}
                        productKey="isPromo"
                        onToggle={(id, val) => handleToggle(id, 'isPromo', val)}
                        searchPlaceholder="Search promo products..."
                    />
                </CardContent>
            </Card>

            {/* Featured Products */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage Featured Products</CardTitle>
                    <CardDescription>
                        Pilih mobil mana yang akan ditampilkan di bagian "Mobil
                        Unggulan" pada halaman utama.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductSettingsList
                        products={products}
                        loading={false}
                        productKey="isFeatured"
                        onToggle={(id, val) =>
                            handleToggle(id, 'isFeatured', val)
                        }
                        searchPlaceholder="Search featured products..."
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <JumpingDotsLoader /> : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
