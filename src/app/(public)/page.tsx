import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/product-card';
import { ChevronRight, Calculator, Sparkles, ShieldCheck, Clock, Percent } from 'lucide-react';
import HomeBannerCarousel from './_components/home-banner-carousel';
import { getFeaturedProducts, getPromoProducts } from '@/lib/repositories/product-repository';
import PromoCarousel from './_components/promo-carousel';

export const revalidate = 300; // Static ISR caching every 5 minutes

async function getHomepageData() {
    const [featuredProducts, promoProducts] = await Promise.all([
        getFeaturedProducts(),
        getPromoProducts(),
    ]);
    return { featuredProducts, promoProducts };
}

export default async function HomePage() {
    const { featuredProducts, promoProducts } = await getHomepageData();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* 1. Hero Banner Carousel */}
            <HomeBannerCarousel />

            {/* 2. Mobile Quick Action Highlights */}
            <section className="py-4 border-b bg-card/50">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        <div className="flex items-center gap-2.5 p-2 sm:p-3 rounded-lg bg-background border border-border/60">
                            <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                                <Percent className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold leading-tight truncate">Bunga Mulai 5.5%</p>
                                <p className="text-[10px] text-muted-foreground truncate">Tenor s/d 5 Tahun</p>
                            </div>
                        </div>

                        <Link
                            href="/simulasi-kredit"
                            className="flex items-center gap-2.5 p-2 sm:p-3 rounded-lg bg-background border border-border/60 hover:border-primary/50 transition-colors group"
                        >
                            <div className="p-2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                                <Calculator className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold leading-tight truncate group-hover:text-primary transition-colors">Simulasi Kredit</p>
                                <p className="text-[10px] text-muted-foreground truncate">Hitung Cicilan Instan</p>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2.5 p-2 sm:p-3 rounded-lg bg-background border border-border/60">
                            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold leading-tight truncate">Unit Terinspeksi</p>
                                <p className="text-[10px] text-muted-foreground truncate">Garansi Kualitas 100%</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-2 sm:p-3 rounded-lg bg-background border border-border/60">
                            <div className="p-2 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold leading-tight truncate">Proses Cepat</p>
                                <p className="text-[10px] text-muted-foreground truncate">Persetujuan 1 Hari</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Promo Spesial (Card Geser) */}
            {promoProducts.length > 0 && (
                <section className="py-8 sm:py-12 md:py-16 bg-muted/20 border-b">
                    <div className="container mx-auto px-3 sm:px-4">
                        <div className="mb-4 sm:mb-8 flex items-end justify-between">
                            <div>
                                <h2 className="font-headline text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                    Promo Spesial
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-md">
                                    Penawaran diskon harga terbaik dengan unit dan periode terbatas.
                                </p>
                            </div>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-xs font-semibold hover:text-primary gap-1 shrink-0 p-0 h-auto sm:h-9 sm:px-3"
                            >
                                <Link href="/products?promo=true">
                                    <span>Lihat Semua Promo</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <PromoCarousel products={promoProducts} />
                    </div>
                </section>
            )}

            {/* 4. Produk Unggulan (Grid 2 Kolom di Mobile) */}
            <section className="py-8 sm:py-12 md:py-16">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="mb-4 sm:mb-8 flex items-end justify-between">
                        <div>
                            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                                Koleksi Terkini
                            </span>
                            <h2 className="font-headline text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                Produk Unggulan
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                Pilihan produk berkualitas dengan spesifikasi lengkap dan terjamin.
                            </p>
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="text-xs font-semibold gap-1 shrink-0 hidden sm:inline-flex"
                        >
                            <Link href="/products">
                                <span>Lihat Semua Produk</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile 2 baris / 2 kolom grid with balanced gap and typography */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Mobile "Lihat Semua" CTA at bottom */}
                    <div className="mt-6 text-center sm:hidden">
                        <Button
                            asChild
                            variant="outline"
                            className="w-full text-xs font-semibold h-10 shadow-sm"
                        >
                            <Link href="/products" className="flex items-center justify-center gap-1.5">
                                Lihat Semua Produk
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* 5. Banner Simulasi Kredit Call To Action */}
            <section className="py-8 sm:py-12 bg-gradient-to-br from-primary/10 via-background to-secondary border-t">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="rounded-2xl border border-primary/20 bg-card p-5 sm:p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left max-w-xl">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                <Calculator className="h-3.5 w-3.5" />
                                Kalkulator Kredit Pintar
                            </div>
                            <h3 className="font-headline text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                Rencanakan Cicilan Mobil Anda Hingga 5 Tahun
                            </h3>
                            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                                Dapatkan simulasi rincian angsuran per bulan, perhitungan DP, persentase suku bunga, dan tabel perbandingan tenor 1 sampai 5 tahun secara transparan.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                            <Button
                                asChild
                                size="lg"
                                className="w-full sm:w-auto font-bold text-xs sm:text-sm h-11 px-6 shadow-md"
                            >
                                <Link href="/simulasi-kredit" className="flex items-center justify-center gap-2">
                                    <Calculator className="h-4 w-4" />
                                    Buka Simulasi Kredit
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto text-xs sm:text-sm h-11"
                            >
                                <Link href="/products">Pilih Mobil Dulu</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
