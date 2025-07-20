import { getProductsForSettings } from '@/lib/data/products';
import SettingsPageClient from './page.client';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const products = await getProductsForSettings();
    return <SettingsPageClient initialProducts={products} />;
}
