import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/repositories/order-repository';
import { getServerSession } from '@/lib/auth/auth-server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validasi skema pesanan
const orderSchema = z.object({
    customerName: z.string().min(2, 'Nama lengkap wajib diisi'),
    customerPhone: z.string().min(9, 'Nomor telepon/WhatsApp minimal 9 digit'),
    customerEmail: z.string().email('Format email tidak valid'),
    customerCity: z.string().min(2, 'Kota/Kabupaten wajib diisi'),
    customerAddress: z.string().min(5, 'Alamat lengkap wajib diisi'),
    paymentMethod: z.enum(['CASH', 'KREDIT']),
    notes: z.string().optional(),
    items: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number().int().min(1),
            images: z.array(z.string()).optional(),
            category: z.string().optional(),
            condition: z.string().optional(),
        }),
    ).min(1, 'Pesanan harus memuat minimal 1 produk'),
    totalAmount: z.number().positive('Total harga harus bernilai positif'),
});

/**
 * GET: Mengambil daftar semua pesanan untuk dashboard admin.
 */
export async function GET() {
    const session = await getServerSession();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orders = await getOrders();
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error saat mengambil data pesanan:', error);
        return NextResponse.json(
            { message: 'Gagal mengambil data pesanan' },
            { status: 500 },
        );
    }
}

/**
 * POST: Membuat pesanan baru (booking mobil) dari customer.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = orderSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: 'Data formulir tidak valid',
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const newOrder = await createOrder(validation.data);
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Error saat membuat pesanan:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan sistem saat memproses pesanan' },
            { status: 500 },
        );
    }
}
