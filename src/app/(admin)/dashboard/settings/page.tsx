import { getProductsForSettings } from '@/lib/data/products';
import SettingsPageClient from './page.client';

export default async function SettingsPage() {
    const initialProducts = await getProductsForSettings();

    return <SettingsPageClient initialProducts={initialProducts} />;
}
