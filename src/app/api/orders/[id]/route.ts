import { NextResponse } from 'next/server';
import { updateOrderStatus, deleteOrder, getOrderById } from '@/lib/data/orders';
import type { OrderStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: {
        id: string;
    };
}

/**
 * PATCH: Memperbarui status pesanan (BARU, DIHUBUNGI, DEAL, SELESAI, BATAL).
 */
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = params;
        const body = await request.json();
        const { status } = body as { status: OrderStatus };

        const validStatuses: OrderStatus[] = [
            'BARU',
            'DIHUBUNGI',
            'DEAL',
            'SELESAI',
            'BATAL',
        ];

        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { message: 'Status pesanan tidak valid' },
                { status: 400 },
            );
        }

        const updatedOrder = await updateOrderStatus(id, status);

        if (!updatedOrder) {
            return NextResponse.json(
                { message: 'Pesanan tidak ditemukan' },
                { status: 404 },
            );
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error saat memperbarui status pesanan:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

/**
 * DELETE: Menghapus pesanan.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const { id } = params;
        const success = await deleteOrder(id);

        if (!success) {
            return NextResponse.json(
                { message: 'Pesanan tidak ditemukan' },
                { status: 404 },
            );
        }

        return NextResponse.json({ message: 'Pesanan berhasil dihapus' });
    } catch (error) {
        console.error('Error saat menghapus pesanan:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
