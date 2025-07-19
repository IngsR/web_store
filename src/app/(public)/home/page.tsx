import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import PromoProductCard from '@/components/promo-product-card';
import { Skeleton } from '@/components/ui/skeleton';
import HomeBannerCarousel from '@/components/home-banner-carousel';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { getFeaturedProducts, getPromoProducts } from '@/lib/data/products';

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
                    {promoProducts.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                            Belum ada mobil promo saat ini.
                        </div>
                    ) : (
                        <div className="relative w-full px-12">
                            <Carousel
                                opts={{
                                    align: 'start',
                                    loop: promoProducts.length > 4,
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-4">
                                    {promoProducts.map((product) => (
                                        <CarouselItem
                                            key={product.id}
                                            className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                                        >
                                            <div className="p-1 h-full aspect-[3/4]">
                                                <PromoProductCard
                                                    product={product}
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
                                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
                            </Carousel>
                        </div>
                    )}
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
