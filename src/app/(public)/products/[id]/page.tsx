import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
    getAllProductIds,
    getProductById,
    getRelatedProducts,
} from '@/lib/data/products';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product-card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { ErrorBoundary } from 'react-error-boundary';
import AddToCartButton from './add-to-cart-button';
import { formatCurrency, formatNumber } from '@/lib/utils';
import 'server-only';

// ✅ Required by Next.js for static generation
export async function generateStaticParams() {
    const products = await getAllProductIds();
    return products.map((product) => ({
        id: product.id,
    }));
}

// ✅ Gunakan interface yang kompatibel dengan Next.js
interface PageProps {
    params: { id: string };
}

// ✅ Jadikan komponen halaman sebagai fungsi async tunggal untuk menyederhanakan struktur
export default async function ProductDetailPage({ params }: PageProps) {
    const product = await getProductById(params.id);
    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(
        product.category,
        product.id,
    );

    const displayImages =
        product.images && product.images.length > 0
            ? product.images
            : ['/home/placeholder.jpg'];

    return (
        <div className="py-8 md:py-12">
            <ErrorBoundary
                fallback={
                    <div className="text-center py-20">
                        Something went wrong rendering product details.
                    </div>
                }
            >
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                        <div className="w-full max-w-md mx-auto">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {displayImages.map((img, index) => (
                                        <CarouselItem key={index}>
                                            <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg bg-muted/20">
                                                <Image
                                                    src={img}
                                                    alt={`${
                                                        product.name
                                                    } image ${index + 1}`}
                                                    fill
                                                    className="object-contain p-4"
                                                    sizes="(max-width: 768px) 90vw, 450px"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="absolute left-2" />
                                <CarouselNext className="absolute right-2" />
                            </Carousel>
                        </div>

                        <div className="flex flex-col justify-center">
                            <Badge variant="secondary" className="w-fit">
                                {product.category}
                            </Badge>
                            <h1 className="font-headline text-4xl md:text-5xl font-bold my-4">
                                {product.name}
                            </h1>
                            <p className="text-muted-foreground text-lg mb-6">
                                {product.description}
                            </p>

                            <div className="flex items-center gap-4 mb-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">
                                        Kondisi:
                                    </span>
                                    <Badge variant="outline">
                                        {product.condition}
                                    </Badge>
                                </div>
                                {product.condition === 'Bekas' &&
                                    product.mileage != null && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                                Jarak Tempuh:
                                            </span>
                                            <span className="text-muted-foreground">
                                                {formatNumber(product.mileage)}{' '}
                                                KM
                                            </span>
                                        </div>
                                    )}
                                {product.fuelType && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">
                                            Bahan Bakar:
                                        </span>
                                        <Badge variant="outline">
                                            {product.fuelType}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {product.discountPrice &&
                            product.discountPrice > 0 ? (
                                <div className="flex items-baseline gap-4 mb-6">
                                    <p className="font-bold text-3xl md:text-4xl text-destructive">
                                        {formatCurrency(product.discountPrice)}
                                    </p>
                                    <p className="text-xl md:text-2xl text-muted-foreground line-through">
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>
                            ) : (
                                <p className="font-bold text-3xl md:text-4xl mb-6">
                                    {formatCurrency(product.price)}
                                </p>
                            )}

                            <AddToCartButton product={product} />
                        </div>
                    </div>

                    <div className="mt-16 lg:mt-20">
                        <h2 className="font-headline text-3xl font-bold text-center mb-8">
                            Spesifikasi Detail
                        </h2>
                        <div className="max-w-4xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-sm border">
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {product.longDescription}
                            </p>
                        </div>
                    </div>

                    {relatedProducts.length > 0 && (
                        <div className="mt-24">
                            <h2 className="font-headline text-3xl font-bold text-center mb-8">
                                Mobil Lain yang Mungkin Anda Suka
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {relatedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </ErrorBoundary>
        </div>
    );
}
