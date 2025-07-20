'use server';

import { revalidatePath } from 'next/cache';

/**
 * Revalidates paths related to a specific product.
 * @param productId - The ID of the product that was changed.
 */
export async function revalidateProduct(productId: string) {
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    revalidatePath('/home');
    console.log(`Revalidated paths for product: ${productId}`);
}

/**
 * Revalidates paths related to homepage settings (promo/featured).
 */
export async function revalidateHomepageSettings() {
    revalidatePath('/home');
    revalidatePath('/products');
    console.log('Revalidated homepage settings paths.');
}
