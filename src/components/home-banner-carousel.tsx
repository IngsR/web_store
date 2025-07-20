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

// Daftar gambar banner statis dari direktori /public
const bannerImages = [
    {
        src: '/home/banner-company.jpg',
        alt: 'Banner promosi mobil terbaru',
        title: 'Temukan Mobil Impian Anda',
        description: 'Koleksi terlengkap dengan penawaran terbaik.',
        link: '/products',
    },
    {
        src: '/home/banner-company1.jpg',
        alt: 'Penawaran spesial untuk model SUV',
        title: 'Promo Spesial SUV Tangguh',
        description:
            'Siap menjelajah di segala medan. Dapatkan diskon khusus bulan ini.',
        link: '/products?category=SUV',
    },
    {
        src: '/home/banner-company2.jpg',
        alt: 'Mobil keluarga yang nyaman dan aman',
        title: 'Kenyamanan Untuk Keluarga',
        description: 'Pilihan mobil keluarga yang luas, aman, dan efisien.',
        link: '/products?category=MPV',
    },
];

export default function HomeBannerCarousel() {
    // Inisialisasi plugin autoplay
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true }),
    );

    return (
        <section className="relative w-full">
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
                            <div className="relative h-[40vh] w-full md:h-[60vh]">
                                <Image
                                    src={banner.src}
                                    alt={banner.alt}
                                    fill
                                    className="object-cover"
                                    priority={index === 0} // Prioritaskan gambar pertama untuk LCP
                                    sizes="100vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                                    <div className="container mx-auto px-4">
                                        <h1 className="font-headline text-4xl font-bold drop-shadow-lg md:text-6xl">
                                            {banner.title}
                                        </h1>
                                        <p className="mx-auto mt-4 max-w-2xl text-lg drop-shadow-md md:text-xl">
                                            {banner.description}
                                        </p>
                                        <Button
                                            asChild
                                            className="mt-8 font-bold"
                                            size="lg"
                                        >
                                            <Link href={banner.link}>
                                                Lihat Penawaran
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 md:flex" />
                <CarouselNext className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 md:flex" />
            </Carousel>
        </section>
    );
}
