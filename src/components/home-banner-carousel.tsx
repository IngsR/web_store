'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from './ui/button';

interface Banner {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
}

const staticBanners: Banner[] = [
    {
        id: 1,
        title: 'Temukan Mobil Impian Anda',
        description: 'Koleksi terlengkap dengan penawaran terbaik.',
        image: '/home/banner-company.jpg',
        link: '/products',
    },
    {
        id: 2,
        title: 'Promo Spesial Bulan Ini',
        description:
            'Dapatkan diskon dan bonus eksklusif untuk pembelian mobil pilihan.',
        image: '/home/banner-company1.jpg',
        link: '/products',
    },
    {
        id: 3,
        title: 'Teknologi Terdepan, Kenyamanan Maksimal',
        description:
            'Jelajahi fitur-fitur canggih dari mobil-mobil terbaru kami.',
        image: '/home/banner-company2.jpg',
        link: '/products',
    },
];

export default function HomeBannerCarousel() {
    const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{ loop: true }}
        >
            <CarouselContent>
                {staticBanners.map((banner, index) => (
                    <CarouselItem key={banner.id}>
                        <div className="relative w-full aspect-[16/6] bg-black">
                            <Image
                                src={banner.image}
                                alt={banner.title}
                                fill
                                className="object-cover object-center"
                                priority={index === 0}
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-black/50" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                                <h2 className="font-headline text-3xl md:text-5xl font-bold">
                                    {banner.title}
                                </h2>
                                <p className="mt-2 text-md md:text-lg max-w-2xl">
                                    {banner.description}
                                </p>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
    );
}
