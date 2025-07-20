'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';

// Anda bisa menyesuaikan daftar gambar banner di sini
const bannerImages = [
    {
        src: '/home/banner-company.jpg',
        alt: 'Banner promosi mobil terbaru',
    },
    {
        src: '/home/banner-company1.jpg',
        alt: 'Penawaran spesial untuk model SUV',
    },
    {
        src: '/home/banner-company2.jpg',
        alt: 'Mobil keluarga yang nyaman dan aman',
    },
];

export default function HomeBannerCarousel() {
    // Inisialisasi plugin autoplay
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true }),
    );

    return (
        <section className="w-full -mt-px">
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
                            <div className="relative h-[40vh] md:h-[60vh] w-full">
                                <Image
                                    src={banner.src}
                                    alt={banner.alt}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    sizes="100vw"
                                />
                                <div className="absolute inset-0 bg-black/40" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}
