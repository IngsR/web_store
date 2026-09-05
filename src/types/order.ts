export type OrderStatus = 'BARU' | 'DIHUBUNGI' | 'DEAL' | 'SELESAI' | 'BATAL';

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    images?: string[];
    condition?: string;
    category?: string;
}

export interface Order {
    id: string; // Nomor Pemesanan / Order ID e.g. "ORD-202609-001"
    customerName: string;
    customerNik?: string; // Nomor KTP / NIK Pemesan Mobil
    customerPhone: string;
    customerEmail: string;
    customerCity: string;
    customerAddress: string;
    paymentMethod: 'CASH' | 'KREDIT';
    notes?: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    // Sales Assignment (Round Robin)
    assignedSalesId?: string;
    assignedSalesName?: string;
    assignedSalesPhone?: string;
    assignedSalesEmployeeId?: string;
    assignedAt?: string;
    forwardedToSalesAt?: string;
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
}
