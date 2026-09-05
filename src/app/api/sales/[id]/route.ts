import { NextResponse } from "next/server";
import { updateSales, deleteSales, getSalesById } from "@/lib/data/sales";
import { z } from "zod";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

const updateSalesSchema = z.object({
  employeeId: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  phone: z.string().min(9).optional(),
  email: z.string().email().optional(),
  title: z.string().min(2).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

/**
 * PATCH: Mengupdate data sales atau toggle status Aktif/Nonaktif.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const validation = updateSalesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Data pembaruan sales tidak valid",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const updatedSales = await updateSales(id, validation.data);

    if (!updatedSales) {
      return NextResponse.json(
        { message: "Data sales tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedSales);
  } catch (error) {
    console.error("Error saat memperbarui sales:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE: Menghapus sales.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const success = await deleteSales(id);

    if (!success) {
      return NextResponse.json(
        { message: "Data sales tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Sales berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus sales:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
