'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from './ui/button';
import { Calculator, ArrowRight } from 'lucide-react';

const bannerImages = [
    {
        src: '/home/banner-company.jpg',
        alt: 'Banner promosi mobil terbaru',
        title: 'Temukan Mobil Impian Anda',
        description: 'Koleksi mobil terlengkap dengan penawaran bunga rendah hingga tenor 5 tahun.',
        link: '/products',
    },
    {
        src: '/home/banner-company1.jpg',
        alt: 'Penawaran spesial untuk model SUV',
        title: 'Promo Spesial SUV Tangguh',
        description: 'Jelajahi berbagai medan dengan kenyamanan maksimal dan cicilan ringan.',
        link: '/products?category=SUV',
    },
    {
        src: '/home/banner-company2.jpg',
        alt: 'Mobil keluarga yang nyaman dan aman',
        title: 'Kenyamanan Keluarga Tercinta',
        description: 'Pilihan mobil keluarga yang lapang, aman, dan hemat bahan bakar.',
        link: '/products?category=MPV',
    },
];

export default function HomeBannerCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true }),
    );

    return (
        <section className="relative w-full overflow-hidden bg-neutral-950">
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                    {bannerImages.map((banner, index) => (
                        <CarouselItem key={index}>
                            <div className="relative h-[280px] sm:h-[360px] md:h-[480px] lg:h-[540px] w-full">
                                <Image
                                    src={banner.src}
                                    alt={banner.alt}
                                    fill
                                    className="object-cover object-center"
                                    priority={index === 0}
                                    sizes="100vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                                    <div className="container mx-auto px-2 sm:px-4 max-w-3xl">
                                        <h1 className="font-headline text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
                                            {banner.title}
                                        </h1>
                                        <p className="mx-auto mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm md:text-lg text-gray-200 drop-shadow line-clamp-2 sm:line-clamp-none">
                                            {banner.description}
                                        </p>
                                        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                                            <Button
                                                asChild
                                                size="sm"
                                                className="font-bold sm:h-11 sm:px-6 text-xs sm:text-sm shadow-lg"
                                            >
                                                <Link href={banner.link} className="flex items-center gap-1.5">
                                                    Lihat Penawaran
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="bg-white/15 hover:bg-white/25 text-white border-white/30 backdrop-blur-sm font-semibold sm:h-11 sm:px-5 text-xs sm:text-sm"
                                            >
                                                <Link href="/simulasi-kredit" className="flex items-center gap-1.5">
                                                    <Calculator className="h-3.5 w-3.5" />
                                                    Simulasi Kredit
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 md:flex bg-black/40 text-white border-white/20 hover:bg-black/70 hover:text-white" />
                <CarouselNext className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 md:flex bg-black/40 text-white border-white/20 hover:bg-black/70 hover:text-white" />
            </Carousel>
        </section>
    );
}
