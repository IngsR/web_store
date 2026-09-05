import { NextResponse } from 'next/server';
import {
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    markOrderForwardedToSales,
    assignNextSalesToOrder,
} from '@/lib/repositories/order-repository';
import { getServerSession } from '@/lib/auth/auth-server';
import type { OrderStatus } from '@/types';

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: {
        id: string;
    };
}

/**
 * GET: Mengambil detail satu pesanan berdasarkan ID (admin only).
 */
export async function GET(_request: Request, { params }: RouteParams) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { id } = params;
        const order = await getOrderById(id);
        if (!order) {
            return NextResponse.json({ message: 'Pesanan tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error saat mengambil detail pesanan:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * PATCH: Memperbarui status pesanan, mencatat pengiriman ke sales, atau menggilir sales.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = params;
        const body = await request.json();

        // Aksi 1: Tandai sudah diforward ke WhatsApp sales
        if (body.action === 'markForwarded') {
            const updated = await markOrderForwardedToSales(id);
            if (!updated) {
                return NextResponse.json({ message: 'Pesanan tidak ditemukan' }, { status: 404 });
            }
            return NextResponse.json(updated);
        }

        // Aksi 2: Tugaskan sales giliran berikutnya via Round Robin
        if (body.action === 'assignNextSales') {
            const updated = await assignNextSalesToOrder(id);
            if (!updated) {
                return NextResponse.json(
                    { message: 'Gagal menugaskan sales atau tidak ada sales aktif' },
                    { status: 400 },
                );
            }
            return NextResponse.json(updated);
        }

        // Aksi 3: Update status pesanan
        const { status } = body as { status?: OrderStatus };
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
