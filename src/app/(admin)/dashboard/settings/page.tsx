import { getProductsForSettings } from '@/lib/data/products';
import SettingsPageClient from './page.client';

/**
 * This tells Next.js to always render this page dynamically on the server.
 * It prevents the page from being statically cached, ensuring that the
 * list of products is always up-to-date when the user navigates here.
 */
export const dynamic = 'force-dynamic';

/**
 * Server Component for the Settings page.
 * It fetches all products and passes them to the client component.
 */
export default async function SettingsPage() {
    const products = await getProductsForSettings();
    return <SettingsPageClient initialProducts={products} />;
}
