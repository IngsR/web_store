import prisma from "@/lib/prisma";
import type { SalesPerson } from "@/lib/types";

/**
 * Mengambil semua data staf sales dari database melalui Prisma ORM.
 */
export async function getSalesList(): Promise<SalesPerson[]> {
  try {
    const sales = await prisma.sales.findMany({
      orderBy: { createdAt: "desc" },
    });

    return sales.map((s) => ({
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
    const s = await prisma.sales.findUnique({ where: { id } });
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
  const created = await prisma.sales.create({
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
    const updated = await prisma.sales.update({
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
    await prisma.sales.delete({ where: { id } });
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
 *
 * Algoritma:
 * 1. Ambil semua sales dengan status "ACTIVE".
 * 2. Urutkan berdasarkan lastAssignedAt ascending (sales yang belum pernah dapat lead atau paling lama tidak dapat lead akan berada di urutan pertama).
 * 3. Update counter assignedLeadsCount dan timestamp lastAssignedAt ke saat ini.
 */
export async function getNextRoundRobinSales(): Promise<SalesPerson | null> {
  try {
    const activeSales = await prisma.sales.findMany({
      where: { status: "ACTIVE" },
    });

    if (activeSales.length === 0) {
      return null;
    }

    // Urutkan sales: null lastAssignedAt diprioritaskan, kemudian yang timestampnya paling lampau
    activeSales.sort((a, b) => {
      if (!a.lastAssignedAt && b.lastAssignedAt) return -1;
      if (a.lastAssignedAt && !b.lastAssignedAt) return 1;
      if (!a.lastAssignedAt && !b.lastAssignedAt) return 0;
      return a.lastAssignedAt!.getTime() - b.lastAssignedAt!.getTime();
    });

    const selected = activeSales[0];

    // Update rotasi pada database
    const updated = await prisma.sales.update({
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
