import { NextResponse } from "next/server";
import {
  getSalesList,
  createSales,
  seedInitialSalesIfEmpty,
} from "@/lib/repositories/sales-repository";
import { getServerSession } from "@/lib/auth/auth-server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createSalesSchema = z.object({
  employeeId: z
    .string()
    .min(2, "Nomor Identitas Karyawan (NIK/ID ERP) wajib diisi"),
  name: z.string().min(2, "Nama lengkap sales wajib diisi"),
  phone: z.string().min(9, "Nomor WhatsApp minimal 9 digit"),
  email: z.string().email("Format email tidak valid"),
  title: z.string().min(2, "Jabatan / Posisi sales wajib diisi"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

/**
 * GET: Mengambil daftar sales dan statistik dari Prisma ORM.
 */
export async function GET() {
  const session = await getServerSession();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let sales = await getSalesList();

    // Seed data awal jika database masih kosong
    if (sales.length === 0) {
      sales = await seedInitialSalesIfEmpty();
    }

    const stats = {
      total: sales.length,
      active: sales.filter((s) => s.status === "ACTIVE").length,
      inactive: sales.filter((s) => s.status === "INACTIVE").length,
      totalLeads: sales.reduce(
        (acc, s) => acc + (s.assignedLeadsCount || 0),
        0,
      ),
    };

    return NextResponse.json({
      sales,
      stats,
    });
  } catch (error) {
    console.error("Error saat mengambil data sales:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data tim sales" },
      { status: 500 },
    );
  }
}

/**
 * POST: Menambahkan sales baru oleh Admin (Prisma ORM).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createSalesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Form data sales tidak valid",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const newSales = await createSales(validation.data);
    return NextResponse.json(newSales, { status: 201 });
  } catch (error: any) {
    console.error("Error saat menambahkan sales:", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "ID Karyawan atau Email sudah terdaftar di sistem." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem saat menyimpan sales" },
      { status: 500 },
    );
  }
}
