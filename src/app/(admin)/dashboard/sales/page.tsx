"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Phone,
  Mail,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  Briefcase,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SalesPerson } from "@/lib/types";
import { formatWhatsAppNumber } from "@/lib/utils";

export default function SalesManagementPage() {
  const { toast } = useToast();
  const [salesList, setSalesList] = useState<SalesPerson[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalLeads: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSales, setEditingSales] = useState<SalesPerson | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    phone: "",
    email: "",
    title: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sales");
      if (res.ok) {
        const data = await res.json();
        setSalesList(data.sales || []);
        setStats(
          data.stats || {
            total: 0,
            active: 0,
            inactive: 0,
            totalLeads: 0,
          },
        );
      } else {
        toast({
          variant: "destructive",
          title: "Gagal memuat data sales",
          description: "Terjadi gangguan saat mengambil data dari database.",
        });
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        variant: "destructive",
        title: "Koneksi error",
        description: "Tidak dapat terhubung ke database sales.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingSales(null);
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFormData({
      employeeId: `SLS-ERP-${randomNum}`,
      name: "",
      phone: "",
      email: "",
      title: "Automotive Sales Consultant",
      status: "ACTIVE",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (sales: SalesPerson) => {
    setEditingSales(sales);
    setFormData({
      employeeId: sales.employeeId,
      name: sales.name,
      phone: sales.phone,
      email: sales.email,
      title: sales.title,
      status: sales.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.employeeId.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Data belum lengkap",
        description:
          "Nomor Identitas, Nama Lengkap, dan No. WhatsApp wajib diisi.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSales) {
        const res = await fetch(`/api/sales/${editingSales.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          toast({
            title: "Data Sales Diperbarui",
            description: `Profil sales ${formData.name} berhasil diperbarui.`,
          });
          setIsDialogOpen(false);
          fetchSales();
        } else {
          const err = await res.json();
          toast({
            variant: "destructive",
            title: "Gagal update",
            description: err.message || "Terjadi kesalahan sistem.",
          });
        }
      } else {
        const res = await fetch("/api/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          toast({
            title: "Sales Berhasil Ditambahkan",
            description: `${formData.name} berhasil disimpan ke database showroom.`,
          });
          setIsDialogOpen(false);
          fetchSales();
        } else {
          const err = await res.json();
          toast({
            variant: "destructive",
            title: "Gagal menambahkan sales",
            description: err.message || "Periksa kembali data Anda.",
          });
        }
      }
    } catch (error) {
      console.error("Error saving sales:", error);
      toast({
        variant: "destructive",
        title: "Kesalahan Jaringan",
        description: "Tidak dapat menyimpan data sales.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (sales: SalesPerson) => {
    const nextStatus = sales.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch(`/api/sales/${sales.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        toast({
          title:
            nextStatus === "ACTIVE" ? "Status: Aktif" : "Status: Tidak Aktif",
          description: `Status ${sales.name} diubah menjadi ${nextStatus === "ACTIVE" ? "Aktif" : "Tidak Aktif"}.`,
        });
        fetchSales();
      }
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  const handleDeleteSales = async (sales: SalesPerson) => {
    if (
      !confirm(`Hapus sales ${sales.name} (${sales.employeeId}) dari database?`)
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/sales/${sales.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Sales Dihapus",
          description: `Data ${sales.name} telah dihapus.`,
        });
        fetchSales();
      }
    } catch (error) {
      console.error("Delete sales error:", error);
    }
  };

  const filteredSales = salesList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ? true : s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Tim Sales Showroom
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Data representatif sales showroom. Distribusi prospek pesanan baru
            berjalan otomatis bergantian pada staf yang aktif.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSales}
            disabled={isLoading}
            className="h-9 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleOpenCreateModal}
            size="sm"
            className="h-9 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Tambah Sales
          </Button>
        </div>
      </div>

      {/* KPI Cards (Real Showroom Metrics, Mobile-First Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-none border border-border/80">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Total Tim Sales</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Staf terdaftar
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-border/80">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Sales Aktif</span>
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.active}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Menerima giliran otomatis
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-border/80">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Tidak Aktif</span>
              <UserX className="h-4 w-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">
              {stats.inactive}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Sedang cuti / dilewati
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-border/80">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">
                Total Pesanan Ditangani
              </span>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {stats.totalLeads}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Pemesanan terdistribusi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Table Container */}
      <Card className="shadow-none border border-border/80">
        <CardHeader className="p-3.5 sm:p-4 pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari nama, NIK ERP, atau no. WA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                Status:
              </span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">
                    Semua ({salesList.length})
                  </SelectItem>
                  <SelectItem value="ACTIVE">Aktif ({stats.active})</SelectItem>
                  <SelectItem value="INACTIVE">
                    Tidak Aktif ({stats.inactive})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
              Memuat data tim sales...
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
              Tidak ada data sales yang cocok.
            </div>
          ) : (
            <>
              {/* Mobile View: Cards */}
              <div className="block md:hidden divide-y divide-border/60">
                {filteredSales.map((sales) => {
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
                          onClick={() => handleToggleStatus(sales)}
                        >
                          {sales.status === "ACTIVE"
                            ? "Nonaktifkan"
                            : "Aktifkan"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs px-2.5"
                          onClick={() => handleOpenEditModal(sales)}
                        >
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteSales(sales)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border/60 text-[11px] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Staf Sales</th>
                      <th className="py-3 px-4">WhatsApp & Email</th>
                      <th className="py-3 px-4">Jabatan</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">
                        Pesanan Ditangani
                      </th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredSales.map((sales) => {
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
                                onClick={() => handleToggleStatus(sales)}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:opacity-80 transition-opacity"
                                title="Klik untuk mengubah status"
                              >
                                Aktif
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(sales)}
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
                                onClick={() => handleOpenEditModal(sales)}
                              >
                                <Edit2 className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteSales(sales)}
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Tambah/Edit Sales */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md p-5 sm:p-6 rounded-xl">
          <form onSubmit={handleSubmitForm}>
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
                onClick={() => setIsDialogOpen(false)}
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
    </div>
  );
}
