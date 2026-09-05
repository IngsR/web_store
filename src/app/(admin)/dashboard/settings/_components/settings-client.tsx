'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import JumpingDotsLoader from '@/components/ui/jumping-dots-loader';
import type { Product } from '@/types';
import ProductSettingsList from './product-settings-list';
import { Star, Tag, Save } from 'lucide-react';

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
        setProducts((prev) =>
            prev.map((p) => (p.id === productId ? { ...p, [key]: value } : p)),
        );
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        const featuredProductIds = products.filter((p) => p.isFeatured).map((p) => p.id);
        const promoProductIds = products.filter((p) => p.isPromo).map((p) => p.id);

        try {
            const res = await fetch('/api/settings/homepage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featuredProductIds, promoProductIds }),
                credentials: 'include',
            });

            if (res.ok) {
                toast({
                    title: 'Tersimpan',
                    description: 'Pengaturan halaman utama berhasil diperbarui.',
                    variant: 'success',
                });
                router.refresh();
            } else {
                const errorData = await res.json();
                toast({
                    title: 'Gagal menyimpan',
                    description: errorData.message || 'Terjadi kesalahan saat menyimpan.',
                    variant: 'destructive',
                });
            }
        } catch {
            toast({
                title: 'Error',
                description: 'Koneksi gagal. Coba lagi.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-semibold tracking-tight">Pengaturan Halaman Utama</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Kelola produk yang tampil di carousel promo dan seksi unggulan.
                </p>
            </div>

            {/* Sections */}
            <div className="grid gap-5 sm:grid-cols-2">
                {/* Promo */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4 shadow-xs">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                            <Tag className="size-4 text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Promo Terbaru</h2>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                Ditampilkan di carousel utama halaman publik.
                            </p>
                        </div>
                    </div>
                    <ProductSettingsList
                        products={products}
                        loading={false}
                        productKey="isPromo"
                        onToggle={(id, val) => handleToggle(id, 'isPromo', val)}
                        searchPlaceholder="Cari produk promo..."
                    />
                </div>

                {/* Featured */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4 shadow-xs">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                            <Star className="size-4 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Produk Unggulan</h2>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                Ditampilkan di seksi unggulan halaman publik.
                            </p>
                        </div>
                    </div>
                    <ProductSettingsList
                        products={products}
                        loading={false}
                        productKey="isFeatured"
                        onToggle={(id, val) => handleToggle(id, 'isFeatured', val)}
                        searchPlaceholder="Cari produk unggulan..."
                    />
                </div>
            </div>

            {/* Save Action */}
            <div className="flex justify-end pt-1">
                <Button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="gap-2 min-w-32"
                >
                    {isSaving ? (
                        <JumpingDotsLoader />
                    ) : (
                        <>
                            <Save className="size-4" />
                            Simpan Perubahan
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
