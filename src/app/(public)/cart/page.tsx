'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Calculator } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } =
        useCart();

    const getItemPrice = (item: (typeof cartItems)[0]) => {
        return item.discountPrice && item.discountPrice > 0
            ? item.discountPrice
            : item.price;
    };

    const getValidImage = (img?: string) => {
        if (img && (img.startsWith('data:image') || img.startsWith('http') || img.startsWith('/'))) {
            return img;
        }
        return '/home/placeholder.jpg';
    };

    return (
        <div className="container mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-10 max-w-6xl">
            <div className="text-center mb-6 sm:mb-10 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Keranjang Pesanan
                </div>
                <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                    Keranjang Belanja
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {cartCount > 0
                        ? `Terdapat ${cartCount} unit pilihan di keranjang Anda.`
                        : 'Keranjang belanja Anda saat ini masih kosong.'}
                </p>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12 sm:py-16 px-4 border border-dashed rounded-2xl bg-card max-w-md mx-auto space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                        <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base text-foreground">Belum Ada Mobil yang Dipilih</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Jelajahi koleksi mobil terbaik kami atau hitung simulasi cicilan terlebih dahulu.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                        <Button asChild size="sm" className="font-bold text-xs h-10 px-5">
                            <Link href="/products" className="flex items-center gap-1.5">
                                Lihat Semua Mobil
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="text-xs h-10">
                            <Link href="/simulasi-kredit" className="flex items-center gap-1.5">
                                <Calculator className="h-3.5 w-3.5" />
                                Simulasi Kredit
                            </Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Item List */}
                    <div className="lg:col-span-8">
                        <Card className="border-border/80 shadow-sm overflow-hidden">
                            <CardHeader className="py-3 px-4 sm:px-6 bg-muted/30 border-b">
                                <CardTitle className="text-sm font-bold text-foreground">
                                    Daftar Mobil Pilihan ({cartItems.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ul className="divide-y divide-border/60">
                                    {cartItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:bg-muted/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
                                                <div className="relative h-16 w-20 sm:h-20 sm:w-24 rounded-lg overflow-hidden bg-muted/20 border border-border/60 shrink-0">
                                                    <Image
                                                        src={getValidImage(item.images?.[0])}
                                                        alt={item.name}
                                                        fill
                                                        className="object-contain p-1"
                                                        sizes="96px"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/products/${item.id}`}
                                                        className="font-bold text-xs sm:text-sm line-clamp-1 hover:text-primary transition-colors text-foreground"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                                                        Kategori: {item.category} • {item.condition}
                                                    </p>
                                                    <p className="text-xs sm:text-sm font-extrabold text-primary mt-1">
                                                        {formatCurrency(getItemPrice(item))}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Quantity & Delete Controls */}
                                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                                                <div className="flex items-center gap-1.5 border rounded-lg p-0.5 bg-background">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                Math.max(1, item.quantity - 1),
                                                            )
                                                        }
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-xs font-bold">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity + 1,
                                                            )
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <p className="text-xs sm:text-sm font-bold text-foreground sm:min-w-[100px] text-right">
                                                    {formatCurrency(getItemPrice(item) * item.quantity)}
                                                </p>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                                    onClick={() => removeFromCart(item.id)}
                                                    title="Hapus dari keranjang"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary Checkout Card */}
                    <div className="lg:col-span-4 space-y-4">
                        <Card className="border-border/80 shadow-sm">
                            <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
                                <CardTitle className="font-headline text-base sm:text-lg font-bold">
                                    Ringkasan Pesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 px-4 sm:px-6 pb-5 text-xs sm:text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Total Item:</span>
                                    <span className="font-semibold text-foreground">{cartCount} unit</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold text-foreground">{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Estimasi Pengiriman:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Gratis Showroom</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-sm sm:text-base pt-1">
                                    <span className="text-foreground">Total OTR:</span>
                                    <span className="text-primary text-base sm:text-lg font-extrabold">{formatCurrency(cartTotal)}</span>
                                </div>

                                <div className="space-y-2 pt-3">
                                    <Button asChild size="lg" className="w-full font-bold h-11 text-xs sm:text-sm shadow-md">
                                        <a
                                            href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                                `Halo Sales Ing Store, saya ingin memesan unit dari keranjang:\n\n${cartItems
                                                    .map(
                                                        (item) =>
                                                            `- ${item.name} (${item.quantity}x) = ${formatCurrency(
                                                                getItemPrice(item) * item.quantity,
                                                            )}`,
                                                    )
                                                    .join('\n')}\n\n*Total:* ${formatCurrency(
                                                    cartTotal,
                                                )}\n\nMohon info ketersediaan stok dan prosedur booking. Terima kasih!`,
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Proses Booking via WhatsApp
                                        </a>
                                    </Button>

                                    <Button asChild variant="outline" className="w-full text-xs h-10">
                                        <Link href="/simulasi-kredit">
                                            Simulasi Kredit untuk Unit Ini
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
