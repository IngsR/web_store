import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { ChevronRight } from 'lucide-react';
import PromoProductCard from '@/components/promo-product-card';
import HomeBannerCarousel from '@/components/home-banner-carousel';
import { getFeaturedProducts, getPromoProducts } from '@/lib/data/products';
import PromoCarousel from './promo-carousel';

export const revalidate = 3600;

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
        <main className="flex flex-col min-h-screen bg-background">
            {/* Banner Section */}
            <HomeBannerCarousel />

            {/* Promo Spesial */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-card to-background">
                <div className="container mx-auto px-4">
                    <div className="mb-12 flex flex-col items-center">
                        <h2 className="font-headline text-3xl font-bold text-primary text-center md:text-4xl">
                            Promo Mobil Terbaru
                        </h2>
                        <p className="mt-2 max-w-2xl text-center text-md text-muted-foreground md:text-lg">
                            Penawaran eksklusif dengan harga terbaik, hanya
                            untuk Anda. Jangan sampai terlewat!
                        </p>
                    </div>
                    <PromoCarousel products={promoProducts} />
                </div>
            </section>

            {/* Produk Unggulan */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center mb-8">
                        <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary text-center">
                            Mobil Unggulan
                        </h2>
                        <Button
                            asChild
                            variant="default"
                            className="mt-4 w-full md:w-auto font-semibold"
                        >
                            <Link
                                href="/products"
                                className="flex items-center gap-2 justify-center"
                            >
                                Lihat Semua Mobil
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
