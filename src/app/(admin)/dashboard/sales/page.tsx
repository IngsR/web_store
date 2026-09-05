"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserPlus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SalesPerson } from "@/types";

import SalesStats from "./_components/sales-stats";
import SalesCardList from "./_components/sales-card-list";
import SalesTable from "./_components/sales-table";
import SalesFormDialog, { type SalesFormData } from "./_components/sales-form-dialog";

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
  const [formData, setFormData] = useState<SalesFormData>({
    employeeId: "",
    name: "",
    phone: "",
    email: "",
    title: "",
    status: "ACTIVE",
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

      {/* KPI Cards Component */}
      <SalesStats
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
        totalLeads={stats.totalLeads}
      />

      {/* Filter & Table Container */}
      <Card className="bg-card border border-border shadow-xs">
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
              <SalesCardList
                salesList={filteredSales}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteSales}
              />

              {/* Desktop View: Table */}
              <SalesTable
                salesList={filteredSales}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteSales}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Tambah/Edit Sales */}
      <SalesFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingSales={editingSales}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
