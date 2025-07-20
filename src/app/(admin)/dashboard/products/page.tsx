import { getProductsForAdmin } from '@/lib/data/products';
import AdminProductsPageClient from './page.client';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const products = await getProductsForAdmin();
    return <AdminProductsPageClient initialProducts={products} />;
}
