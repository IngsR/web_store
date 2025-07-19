import { getProductsForAdmin } from '@/lib/data/products';
import AdminProductsPageClient from './page.client';

export default async function AdminProductsPageWrapper() {
    // Data is fetched on the server during the render process.
    const initialProducts = await getProductsForAdmin();

    // The client component receives the data as an initial prop.
    return <AdminProductsPageClient initialProducts={initialProducts} />;
}
