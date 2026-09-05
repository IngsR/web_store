import { getProductsForSettings } from '@/lib/repositories/product-repository';
import SettingsPageClient from './_components/settings-client';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const products = await getProductsForSettings();
    return <SettingsPageClient initialProducts={products} />;
}

