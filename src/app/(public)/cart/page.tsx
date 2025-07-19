'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } =
        useCart();

    const getItemPrice = (item: (typeof cartItems)[0]) => {
        return item.discountPrice && item.discountPrice > 0
            ? item.discountPrice
            : item.price;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl md:text-5xl font-bold">
                    Your Cart
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                    {cartCount > 0
                        ? `You have ${cartCount} item(s) in your cart.`
                        : 'Your cart is empty.'}
                </p>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">
                        Looks like you haven't added anything yet.
                    </p>
                    <Button asChild>
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Card>
                            <CardContent className="p-0">
                                <ul className="divide-y">
                                    {cartItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex items-center p-4 flex-wrap gap-4"
                                        >
                                            <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted/20">
                                                <Image
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-1"
                                                    sizes="96px"
                                                />
                                            </div>

                                            <div className="ml-4 flex-1 min-w-[180px]">
                                                <h3 className="font-semibold">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.category}
                                                </p>
                                                <div className="text-sm font-bold mt-1">
                                                    {formatCurrency(
                                                        getItemPrice(item),
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            Math.max(
                                                                1,
                                                                item.quantity -
                                                                    1,
                                                            ),
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    readOnly
                                                    className="h-8 w-12 text-center"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="ml-4 flex flex-col items-end justify-between min-w-[96px] h-full">
                                                <p className="font-semibold text-right break-words leading-snug">
                                                    {formatCurrency(
                                                        getItemPrice(item) *
                                                            item.quantity,
                                                    )}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                >
                                                    <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatCurrency(cartTotal)}</span>
                                </div>
                                <Button size="lg" className="w-full mt-4">
                                    Proceed to Checkout
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
