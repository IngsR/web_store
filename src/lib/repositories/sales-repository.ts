import prisma from "@/lib/database/prisma";
import type { SalesPerson } from "@/types";

// Fallback cast to protect against IDE Language Server stale cache on dynamic Prisma delegates
const db = prisma as any;

/**
 * Mengambil semua data staf sales dari database melalui Prisma ORM.
 */
export async function getSalesList(): Promise<SalesPerson[]> {
  try {
    const sales = await db.sales.findMany({
      orderBy: { createdAt: "desc" },
    });

    return sales.map((s: any) => ({
      id: s.id,
      employeeId: s.employeeId,
      name: s.name,
      phone: s.phone,
      email: s.email,
      title: s.title,
      status: s.status as "ACTIVE" | "INACTIVE",
      assignedLeadsCount: s.assignedLeadsCount,
      lastAssignedAt: s.lastAssignedAt
        ? s.lastAssignedAt.toISOString()
        : undefined,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Prisma: Gagal membaca data sales:", error);
    return [];
  }
}

/**
 * Mengambil satu sales berdasarkan ID.
 */
export async function getSalesById(id: string): Promise<SalesPerson | null> {
  try {
    const s = await db.sales.findUnique({ where: { id } });
    if (!s) return null;
    return {
      id: s.id,
      employeeId: s.employeeId,
      name: s.name,
      phone: s.phone,
      email: s.email,
      title: s.title,
      status: s.status as "ACTIVE" | "INACTIVE",
      assignedLeadsCount: s.assignedLeadsCount,
      lastAssignedAt: s.lastAssignedAt
        ? s.lastAssignedAt.toISOString()
        : undefined,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Prisma: Gagal mengambil sales by ID:", error);
    return null;
  }
}

/**
 * Menambahkan sales baru oleh Admin (Prisma ORM).
 */
export async function createSales(data: {
  employeeId: string;
  name: string;
  phone: string;
  email: string;
  title: string;
  status?: "ACTIVE" | "INACTIVE";
}): Promise<SalesPerson> {
  const created = await db.sales.create({
    data: {
      employeeId: data.employeeId.trim().toUpperCase(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      title: data.title.trim() || "Automotive Sales Consultant",
      status: data.status || "ACTIVE",
    },
  });

  return {
    id: created.id,
    employeeId: created.employeeId,
    name: created.name,
    phone: created.phone,
    email: created.email,
    title: created.title,
    status: created.status as "ACTIVE" | "INACTIVE",
    assignedLeadsCount: created.assignedLeadsCount,
    lastAssignedAt: created.lastAssignedAt
      ? created.lastAssignedAt.toISOString()
      : undefined,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

/**
 * Mengupdate data atau status sales (Prisma ORM).
 */
export async function updateSales(
  id: string,
  data: Partial<Omit<SalesPerson, "id" | "createdAt">>,
): Promise<SalesPerson | null> {
  try {
    const updated = await db.sales.update({
      where: { id },
      data: {
        ...(data.employeeId
          ? { employeeId: data.employeeId.trim().toUpperCase() }
          : {}),
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.phone ? { phone: data.phone.trim() } : {}),
        ...(data.email ? { email: data.email.trim() } : {}),
        ...(data.title ? { title: data.title.trim() } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
    });

    return {
      id: updated.id,
      employeeId: updated.employeeId,
      name: updated.name,
      phone: updated.phone,
      email: updated.email,
      title: updated.title,
      status: updated.status as "ACTIVE" | "INACTIVE",
      assignedLeadsCount: updated.assignedLeadsCount,
      lastAssignedAt: updated.lastAssignedAt
        ? updated.lastAssignedAt.toISOString()
        : undefined,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Prisma: Gagal update sales:", error);
    return null;
  }
}

/**
 * Menghapus data sales (Prisma ORM).
 */
export async function deleteSales(id: string): Promise<boolean> {
  try {
    await db.sales.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error("Prisma: Gagal delete sales:", error);
    return false;
  }
}

/**
 * LOGIKA OTOMATIS ROUND ROBIN (FULLSTACK PRISMA ORM):
 * Sistem secara otomatis memilih sales yang aktif dan gilirannya tiba tanpa memerlukan
 * input atau penugasan manual dari admin.
 */
export async function getNextRoundRobinSales(): Promise<SalesPerson | null> {
  try {
    const activeSales = await db.sales.findMany({
      where: { status: "ACTIVE" },
    });

    if (activeSales.length === 0) {
      return null;
    }

    // Urutkan sales: null lastAssignedAt diprioritaskan, kemudian yang timestampnya paling lampau
    activeSales.sort((a: any, b: any) => {
      if (!a.lastAssignedAt && b.lastAssignedAt) return -1;
      if (a.lastAssignedAt && !b.lastAssignedAt) return 1;
      if (!a.lastAssignedAt && !b.lastAssignedAt) return 0;
      return new Date(a.lastAssignedAt).getTime() - new Date(b.lastAssignedAt).getTime();
    });

    const selected = activeSales[0];

    // Update rotasi pada database
    const updated = await db.sales.update({
      where: { id: selected.id },
      data: {
        assignedLeadsCount: { increment: 1 },
        lastAssignedAt: new Date(),
      },
    });

    return {
      id: updated.id,
      employeeId: updated.employeeId,
      name: updated.name,
      phone: updated.phone,
      email: updated.email,
      title: updated.title,
      status: updated.status as "ACTIVE" | "INACTIVE",
      assignedLeadsCount: updated.assignedLeadsCount,
      lastAssignedAt: updated.lastAssignedAt?.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Prisma: Gagal menjalankan rotasi Round Robin:", error);
    return null;
  }
}

/**
 * Inisialisasi awal data sales jika database masih kosong.
 */
export async function seedInitialSalesIfEmpty(): Promise<SalesPerson[]> {
  try {
    const count = await db.sales.count();
    if (count === 0) {
      await db.sales.createMany({
        data: [
          {
            employeeId: "SLS-ERP-101",
            name: "Dimas Arya Pratama",
            phone: "081289891234",
            email: "dimas.arya@ingstore.com",
            title: "Senior Automotive Consultant",
            status: "ACTIVE",
            assignedLeadsCount: 5,
          },
          {
            employeeId: "SLS-ERP-102",
            name: "Ratna Anindya",
            phone: "085712345678",
            email: "ratna.anindya@ingstore.com",
            title: "Sales Executive Specialist",
            status: "ACTIVE",
            assignedLeadsCount: 4,
          },
          {
            employeeId: "SLS-ERP-103",
            name: "Fajar Hidayat",
            phone: "087890123456",
            email: "fajar.hidayat@ingstore.com",
            title: "Fleet & VIP Advisor",
            status: "ACTIVE",
            assignedLeadsCount: 3,
          },
        ],
        skipDuplicates: true,
      });
    }
    return getSalesList();
  } catch (error) {
    console.error("Prisma: Gagal seeding initial sales:", error);
    return [];
  }
}
