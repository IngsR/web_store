'use client';

import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

interface ProductImageCarouselProps {
    images: string[];
    productName: string;
}

export default function ProductImageCarousel({
    images,
    productName,
}: ProductImageCarouselProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true }),
    );

    return (
        <Carousel
            className="w-full"
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{ loop: true }}
        >
            <CarouselContent>
                {images.map((img, index) => (
                    <CarouselItem key={index}>
                        <div className="aspect-square relative rounded-lg overflow-hidden border">
                            <Image
                                src={img}
                                alt={`${productName} image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4" />
            <CarouselNext className="absolute right-4" />
        </Carousel>
    );
}
