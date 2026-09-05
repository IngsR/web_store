import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SalesPerson } from "@/types";

export interface SalesFormData {
  employeeId: string;
  name: string;
  phone: string;
  email: string;
  title: string;
  status: "ACTIVE" | "INACTIVE";
}

interface SalesFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingSales: SalesPerson | null;
  formData: SalesFormData;
  setFormData: React.Dispatch<React.SetStateAction<SalesFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function SalesFormDialog({
  isOpen,
  onOpenChange,
  editingSales,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}: SalesFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md p-5 sm:p-6 rounded-xl">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold">
              {editingSales ? "Edit Data Sales" : "Tambah Sales Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Data staf sales yang tersimpan di sistem showroom.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs sm:text-sm">
            <div className="space-y-1">
              <Label htmlFor="employeeId" className="text-xs font-semibold">
                Nomor Induk Karyawan (NIK / ID ERP) *
              </Label>
              <Input
                id="employeeId"
                placeholder="Contoh: SLS-ERP-105"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    employeeId: e.target.value.toUpperCase(),
                  })
                }
                className="h-9 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold">
                Nama Lengkap *
              </Label>
              <Input
                id="name"
                placeholder="Contoh: Dimas Arya Pratama"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Nomor WhatsApp Aktif *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Contoh: 081289891234"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-9 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email Showroom *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="sales@ingstore.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs font-semibold">
                Jabatan / Posisi
              </Label>
              <Input
                id="title"
                placeholder="Contoh: Senior Automotive Consultant"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Status Keaktifan
              </Label>
              <Select
                value={formData.status}
                onValueChange={(val: "ACTIVE" | "INACTIVE") =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Aktif (Hijau)</SelectItem>
                  <SelectItem value="INACTIVE">
                    Tidak Aktif (Merah)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 text-xs w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 text-xs bg-primary hover:bg-primary/90 font-semibold w-full sm:w-auto"
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingSales
                  ? "Simpan"
                  : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
