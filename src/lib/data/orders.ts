import prisma from "@/lib/prisma";
import type { Order, OrderStatus } from "@/lib/types";
import { getNextRoundRobinSales } from "@/lib/data/sales";

/**
 * Mengambil semua pemesanan mobil dari database PostgreSQL via Prisma ORM.
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      include: {
        assignedSales: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      customerNik: o.customerNik || undefined,
      customerPhone: o.customerPhone,
      customerEmail: o.customerEmail,
      customerCity: o.customerCity,
      customerAddress: o.customerAddress,
      paymentMethod: o.paymentMethod as "CASH" | "KREDIT",
      notes: o.notes || undefined,
      items: (o.items as any) || [],
      totalAmount: o.totalAmount,
      status: o.status as OrderStatus,
      assignedSalesId: o.assignedSalesId || undefined,
      assignedSalesName: o.assignedSales?.name,
      assignedSalesPhone: o.assignedSales?.phone,
      assignedSalesEmployeeId: o.assignedSales?.employeeId,
      forwardedToSalesAt: o.forwardedToSalesAt?.toISOString(),
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Prisma: Gagal membaca data orders:", error);
    return [];
  }
}

/**
 * Mengambil satu pesanan berdasarkan Nomor Pemesanan / Order ID.
 */
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const o = await prisma.order.findUnique({
      where: { id },
      include: {
        assignedSales: true,
      },
    });

    if (!o) return null;

    return {
      id: o.id,
      customerName: o.customerName,
      customerNik: o.customerNik || undefined,
      customerPhone: o.customerPhone,
      customerEmail: o.customerEmail,
      customerCity: o.customerCity,
      customerAddress: o.customerAddress,
      paymentMethod: o.paymentMethod as "CASH" | "KREDIT",
      notes: o.notes || undefined,
      items: (o.items as any) || [],
      totalAmount: o.totalAmount,
      status: o.status as OrderStatus,
      assignedSalesId: o.assignedSalesId || undefined,
      assignedSalesName: o.assignedSales?.name,
      assignedSalesPhone: o.assignedSales?.phone,
      assignedSalesEmployeeId: o.assignedSales?.employeeId,
      forwardedToSalesAt: o.forwardedToSalesAt?.toISOString(),
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Prisma: Gagal mengambil order by ID:", error);
    return null;
  }
}

/**
 * Menyimpan pesanan baru (Pemesanan Mobil) dan SECARA OTOMATIS
 * menetapkan sales konsultan via algoritma Round Robin murni di backend
 * (Tidak ada input manual penugasan dari admin).
 */
export async function createOrder(data: {
  customerName: string;
  customerNik?: string;
  customerPhone: string;
  customerEmail: string;
  customerCity: string;
  customerAddress: string;
  paymentMethod: "CASH" | "KREDIT";
  notes?: string;
  items: Order["items"];
  totalAmount: number;
}): Promise<Order> {
  // Generate Nomor Pemesanan format Dealer: ORD-YYYYMMDD-XXXX
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `ORD-${dateStr}-${randomSuffix}`;

  // Jalankan logika Round Robin otomatis untuk penugasan sales
  const assignedSales = await getNextRoundRobinSales();

  const created = await prisma.order.create({
    data: {
      id: orderId,
      customerName: data.customerName,
      customerNik: data.customerNik || null,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      customerCity: data.customerCity,
      customerAddress: data.customerAddress,
      paymentMethod: data.paymentMethod,
      notes: data.notes || null,
      items: data.items as any,
      totalAmount: data.totalAmount,
      status: "BARU",
      assignedSalesId: assignedSales ? assignedSales.id : null,
    },
    include: {
      assignedSales: true,
    },
  });

  return {
    id: created.id,
    customerName: created.customerName,
    customerNik: created.customerNik || undefined,
    customerPhone: created.customerPhone,
    customerEmail: created.customerEmail,
    customerCity: created.customerCity,
    customerAddress: created.customerAddress,
    paymentMethod: created.paymentMethod as "CASH" | "KREDIT",
    notes: created.notes || undefined,
    items: (created.items as any) || [],
    totalAmount: created.totalAmount,
    status: created.status as OrderStatus,
    assignedSalesId: created.assignedSalesId || undefined,
    assignedSalesName: created.assignedSales?.name,
    assignedSalesPhone: created.assignedSales?.phone,
    assignedSalesEmployeeId: created.assignedSales?.employeeId,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

/**
 * Memperbarui status pesanan di dashboard admin.
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { assignedSales: true },
    });

    return {
      id: updated.id,
      customerName: updated.customerName,
      customerNik: updated.customerNik || undefined,
      customerPhone: updated.customerPhone,
      customerEmail: updated.customerEmail,
      customerCity: updated.customerCity,
      customerAddress: updated.customerAddress,
      paymentMethod: updated.paymentMethod as "CASH" | "KREDIT",
      notes: updated.notes || undefined,
      items: (updated.items as any) || [],
      totalAmount: updated.totalAmount,
      status: updated.status as OrderStatus,
      assignedSalesId: updated.assignedSalesId || undefined,
      assignedSalesName: updated.assignedSales?.name,
      assignedSalesPhone: updated.assignedSales?.phone,
      assignedSalesEmployeeId: updated.assignedSales?.employeeId,
      forwardedToSalesAt: updated.forwardedToSalesAt?.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Prisma: Gagal update order status:", error);
    return null;
  }
}

/**
 * Menandai bahwa detail pemesanan unit telah dikirim admin ke nomor WhatsApp Sales.
 */
export async function markOrderForwardedToSales(
  orderId: string,
): Promise<Order | null> {
  try {
    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) return null;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        forwardedToSalesAt: new Date(),
        status: existing.status === "BARU" ? "DIHUBUNGI" : existing.status,
      },
      include: { assignedSales: true },
    });

    return {
      id: updated.id,
      customerName: updated.customerName,
      customerNik: updated.customerNik || undefined,
      customerPhone: updated.customerPhone,
      customerEmail: updated.customerEmail,
      customerCity: updated.customerCity,
      customerAddress: updated.customerAddress,
      paymentMethod: updated.paymentMethod as "CASH" | "KREDIT",
      notes: updated.notes || undefined,
      items: (updated.items as any) || [],
      totalAmount: updated.totalAmount,
      status: updated.status as OrderStatus,
      assignedSalesId: updated.assignedSalesId || undefined,
      assignedSalesName: updated.assignedSales?.name,
      assignedSalesPhone: updated.assignedSales?.phone,
      assignedSalesEmployeeId: updated.assignedSales?.employeeId,
      forwardedToSalesAt: updated.forwardedToSalesAt?.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Prisma: Gagal mark forwarded to sales:", error);
    return null;
  }
}

/**
 * Menugaskan sales aktif berikutnya ke pesanan melalui logika Round Robin.
 */
export async function assignNextSalesToOrder(
  orderId: string,
): Promise<Order | null> {
  try {
    const nextSales = await getNextRoundRobinSales();
    if (!nextSales) {
      console.warn("Prisma: Tidak ada staf sales aktif yang dapat ditugaskan.");
      return null;
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        assignedSalesId: nextSales.id,
      },
      include: { assignedSales: true },
    });

    return {
      id: updated.id,
      customerName: updated.customerName,
      customerNik: updated.customerNik || undefined,
      customerPhone: updated.customerPhone,
      customerEmail: updated.customerEmail,
      customerCity: updated.customerCity,
      customerAddress: updated.customerAddress,
      paymentMethod: updated.paymentMethod as "CASH" | "KREDIT",
      notes: updated.notes || undefined,
      items: (updated.items as any) || [],
      totalAmount: updated.totalAmount,
      status: updated.status as OrderStatus,
      assignedSalesId: updated.assignedSalesId || undefined,
      assignedSalesName: updated.assignedSales?.name,
      assignedSalesPhone: updated.assignedSales?.phone,
      assignedSalesEmployeeId: updated.assignedSales?.employeeId,
      forwardedToSalesAt: updated.forwardedToSalesAt?.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Prisma: Gagal menugaskan sales ke pesanan:", error);
    return null;
  }
}

/**
 * Menghapus pesanan.
 */
export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await prisma.order.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error("Prisma: Gagal delete order:", error);
    return false;
  }
}
