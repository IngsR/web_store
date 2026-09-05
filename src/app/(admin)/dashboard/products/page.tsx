import { getProductsForAdmin } from '@/lib/repositories/product-repository';
import AdminProductsPageClient from './_components/products-client';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const products = await getProductsForAdmin();
    return <AdminProductsPageClient initialProducts={products} />;
}

