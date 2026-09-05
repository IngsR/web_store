import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Edit2, Trash2 } from "lucide-react";
import { formatWhatsAppNumber } from "@/lib/utils";
import type { SalesPerson } from "@/types";

interface SalesCardListProps {
  salesList: SalesPerson[];
  onToggleStatus: (sales: SalesPerson) => void;
  onEdit: (sales: SalesPerson) => void;
  onDelete: (sales: SalesPerson) => void;
}

export default function SalesCardList({
  salesList,
  onToggleStatus,
  onEdit,
  onDelete,
}: SalesCardListProps) {
  return (
    <div className="block md:hidden divide-y divide-border/60">
      {salesList.map((sales) => {
        const waNumber = formatWhatsAppNumber(sales.phone);

        return (
          <div key={sales.id} className="p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-bold text-sm text-foreground block">
                  {sales.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {sales.employeeId} • {sales.title}
                </span>
              </div>
              {sales.status === "ACTIVE" ? (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                  Aktif
                </Badge>
              ) : (
                <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-[10px] font-semibold">
                  Tidak Aktif
                </Badge>
              )}
            </div>

            <div className="bg-muted/40 p-2.5 rounded-md text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> WhatsApp
                </span>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-medium text-emerald-600 hover:underline"
                >
                  {sales.phone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email
                </span>
                <span className="text-foreground truncate max-w-[180px]">
                  {sales.email}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <span className="text-muted-foreground">
                  Pesanan Ditangani:
                </span>
                <span className="font-bold text-foreground">
                  {sales.assignedLeadsCount} Unit
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs px-2.5"
                onClick={() => onToggleStatus(sales)}
              >
                {sales.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs px-2.5"
                onClick={() => onEdit(sales)}
              >
                <Edit2 className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(sales)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
