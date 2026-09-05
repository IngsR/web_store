import { Button } from "@/components/ui/button";
import { Phone, Mail, Edit2, Trash2 } from "lucide-react";
import { formatWhatsAppNumber } from "@/lib/utils";
import type { SalesPerson } from "@/types";

interface SalesTableProps {
  salesList: SalesPerson[];
  onToggleStatus: (sales: SalesPerson) => void;
  onEdit: (sales: SalesPerson) => void;
  onDelete: (sales: SalesPerson) => void;
}

export default function SalesTable({
  salesList,
  onToggleStatus,
  onEdit,
  onDelete,
}: SalesTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-muted/40 text-muted-foreground border-b border-border/60 text-[11px] uppercase tracking-wider font-semibold">
          <tr>
            <th className="py-3 px-4">Staf Sales</th>
            <th className="py-3 px-4">WhatsApp & Email</th>
            <th className="py-3 px-4">Jabatan</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-center">Pesanan Ditangani</th>
            <th className="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {salesList.map((sales) => {
            const waNumber = formatWhatsAppNumber(sales.phone);

            return (
              <tr
                key={sales.id}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 px-4 align-middle">
                  <div className="font-bold text-foreground text-sm">
                    {sales.name}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    NIK: {sales.employeeId}
                  </div>
                </td>

                <td className="py-3 px-4 align-middle">
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline flex items-center gap-1 font-mono font-medium"
                  >
                    <Phone className="h-3 w-3 shrink-0" />
                    {sales.phone}
                  </a>
                  <div className="text-muted-foreground flex items-center gap-1 text-[11px] mt-0.5">
                    <Mail className="h-3 w-3 shrink-0" />
                    {sales.email}
                  </div>
                </td>

                <td className="py-3 px-4 align-middle">
                  <span className="font-medium text-foreground">
                    {sales.title}
                  </span>
                </td>

                <td className="py-3 px-4 align-middle">
                  {sales.status === "ACTIVE" ? (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(sales)}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:opacity-80 transition-opacity"
                      title="Klik untuk mengubah status"
                    >
                      Aktif
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(sales)}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:opacity-80 transition-opacity"
                      title="Klik untuk mengubah status"
                    >
                      Tidak Aktif
                    </button>
                  )}
                </td>

                <td className="py-3 px-4 align-middle text-center font-bold">
                  <span className="inline-block bg-muted px-2 py-0.5 rounded text-xs">
                    {sales.assignedLeadsCount} Unit
                  </span>
                </td>

                <td className="py-3 px-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-2.5"
                      onClick={() => onEdit(sales)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(sales)}
                      title="Hapus Sales"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
