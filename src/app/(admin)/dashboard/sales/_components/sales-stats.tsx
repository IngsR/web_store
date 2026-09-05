import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Briefcase } from "lucide-react";

interface SalesStatsProps {
  total: number;
  active: number;
  inactive: number;
  totalLeads: number;
}

export default function SalesStats({
  total,
  active,
  inactive,
  totalLeads,
}: SalesStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Sales */}
      <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
        <CardContent className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Total Tim Sales</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {total}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Staf terdaftar di showroom
          </p>
        </CardContent>
      </Card>

      {/* 2. Sales Aktif */}
      <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
        <CardContent className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Sales Aktif</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {active}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Menerima giliran otomatis
          </p>
        </CardContent>
      </Card>

      {/* 3. Tidak Aktif */}
      <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
        <CardContent className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Tidak Aktif</span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-500">
              <UserX className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
            {inactive}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sedang cuti / dilewati
          </p>
        </CardContent>
      </Card>

      {/* 4. Total Ditangani */}
      <Card className="bg-card border border-border shadow-xs hover:shadow-md transition-all duration-200">
        <CardContent className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Ditangani
            </span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {totalLeads}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Pemesanan terdistribusi
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
