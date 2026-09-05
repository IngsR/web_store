import fs from 'fs/promises';
import path from 'path';
import type { Order, OrderStatus } from '@/lib/types';

const ORDERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'orders.json');

/**
 * Membaca semua pesanan dari database penyimpanan JSON.
 */
export async function getOrders(): Promise<Order[]> {
    try {
        const data = await fs.readFile(ORDERS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Gagal membaca data orders:', error);
        return [];
    }
}

/**
 * Mengambil satu pesanan berdasarkan ID (Nomor SPK).
 */
export async function getOrderById(id: string): Promise<Order | null> {
    const orders = await getOrders();
    return orders.find((order) => order.id === id) || null;
}

/**
 * Menyimpan pesanan baru (SPK) dari customer.
 */
export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerCity: string;
    customerAddress: string;
    paymentMethod: 'CASH' | 'KREDIT';
    notes?: string;
    items: Order['items'];
    totalAmount: number;
}): Promise<Order> {
    const orders = await getOrders();

    // Generate Nomor SPK format Dealer: SPK-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SPK-${dateStr}-${randomSuffix}`;

    const newOrder: Order = {
        id: orderId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        customerCity: data.customerCity,
        customerAddress: data.customerAddress,
        paymentMethod: data.paymentMethod,
        notes: data.notes || '',
        items: data.items,
        totalAmount: data.totalAmount,
        status: 'BARU',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Tambahkan pesanan baru di urutan paling atas
    const updatedOrders = [newOrder, ...orders];
    await fs.writeFile(
        ORDERS_FILE_PATH,
        JSON.stringify(updatedOrders, null, 2),
        'utf-8',
    );

    return newOrder;
}

/**
 * Memperbarui status pesanan oleh Admin di dashboard CMS.
 */
export async function updateOrderStatus(
    id: string,
    status: OrderStatus,
): Promise<Order | null> {
    const orders = await getOrders();
    const index = orders.findIndex((order) => order.id === id);

    if (index === -1) {
        return null;
    }

    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();

    await fs.writeFile(
        ORDERS_FILE_PATH,
        JSON.stringify(orders, null, 2),
        'utf-8',
    );

    return orders[index];
}

/**
 * Menghapus pesanan berdasarkan ID.
 */
export async function deleteOrder(id: string): Promise<boolean> {
    const orders = await getOrders();
    const filteredOrders = orders.filter((order) => order.id !== id);

    if (filteredOrders.length === orders.length) {
        return false;
    }

    await fs.writeFile(
        ORDERS_FILE_PATH,
        JSON.stringify(filteredOrders, null, 2),
        'utf-8',
    );

    return true;
}
