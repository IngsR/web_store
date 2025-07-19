'use client';

import * as React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const banners = [
    {
        id: 1,
        image: '/home/banner1.jpg',
        title: 'Summer Collection 2025',
        description: 'Discover the latest trends in summer fashion',
        link: '/products?category=summer',
    },
    {
        id: 2,
        image: '/home/banner2.jpg',
        title: 'Premium Lifestyle',
        description: 'Elevate your everyday style with our premium collection',
        link: '/products?category=lifestyle',
    },
];

export function HeroBanner() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    React.useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="relative overflow-hidden">
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="relative flex-[0_0_100%] min-w-0 h-[70vh]"
                        >
                            <Image
                                src={banner.image}
                                alt={banner.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                                <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
                                    {banner.title}
                                </h1>
                                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                                    {banner.description}
                                </p>
                                <Button
                                    size="lg"
                                    className="mt-8 bg-white text-black hover:bg-white/90"
                                    asChild
                                >
                                    <a href={banner.link}>Shop Now</a>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                onClick={scrollPrev}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                onClick={scrollNext}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            'w-2 h-2 rounded-full transition-all',
                            selectedIndex === index
                                ? 'bg-white w-6'
                                : 'bg-white/50',
                        )}
                        onClick={() => emblaApi?.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    );
}
