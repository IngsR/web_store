import type { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";

/**
 * Helper untuk format tanggal Indonesia yang rapi di pembukuan
 */
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

/**
 * Mengonversi daftar pesanan menjadi file CSV yang kompatibel dengan Microsoft Excel & Google Sheets.
 * Dilengkapi dengan UTF-8 BOM (\uFEFF) dan teks proteksi agar NIK dan Nomor HP tidak terpotong atau menjadi notasi ilmiah (3.271E+15).
 */
export function exportOrdersToCSV(
  orders: Order[],
  filenamePrefix = "pembukuan-pemesanan-mobil",
): void {
  const headers = [
    "No. Pemesanan",
    "Tanggal Masuk",
    "Nama Calon Pembeli",
    "NIK KTP (Arsip)",
    "No. WhatsApp / HP",
    "Email",
    "Kota Domisili",
    "Alamat Lengkap",
    "Unit Mobil Dipesan",
    "Total Unit",
    "Nilai OTR (Rp)",
    "Skema Pembayaran",
    "Sales Penanggung Jawab",
    "ID Karyawan Sales",
    "No. WA Sales",
    "Status Pesanan",
    "Status Dispatch WA",
    "Waktu Dispatch Sales",
    "Catatan Pembeli",
  ];

  const rows = orders.map((order) => {
    const safeItems = Array.isArray(order.items) ? order.items : [];
    const unitSummary = safeItems
      .map((it) => `${it.name} (${it.quantity}x)`)
      .join("; ");
    const totalQty = safeItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

    return [
      order.id,
      formatDate(order.createdAt),
      order.customerName,
      order.customerNik ? `="${order.customerNik}"` : "-",
      order.customerPhone ? `="${order.customerPhone}"` : "-",
      order.customerEmail || "-",
      order.customerCity || "-",
      order.customerAddress
        ? order.customerAddress.replace(/[\r\n]+/g, " ")
        : "-",
      unitSummary || "-",
      totalQty,
      order.totalAmount,
      order.paymentMethod === "KREDIT" ? "Kredit Leasing" : "Tunai / Cash",
      order.assignedSalesName || "Belum Ditugaskan",
      order.assignedSalesEmployeeId || "-",
      order.assignedSalesPhone ? `="${order.assignedSalesPhone}"` : "-",
      order.status,
      order.forwardedToSalesAt ? "Sudah Terkirim ke WA Sales" : "Belum Dikirim",
      formatDate(order.forwardedToSalesAt),
      order.notes ? order.notes.replace(/[\r\n]+/g, " ") : "-",
    ];
  });

  const escapeCSV = (val: any): string => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent =
    "\uFEFF" +
    [
      headers.map(escapeCSV).join(","),
      ...rows.map((r) => r.map(escapeCSV).join(",")),
    ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filenamePrefix}-${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Mengonversi daftar pesanan menjadi spreadsheet Excel (.xls) berformat rapi dengan:
 * - Kop Laporan Pembukuan Showroom
 * - Tabel bergaris dengan header warna kontras
 * - Format mata uang dan kolom NIK/HP terproteksi sebagai text
 * - Baris ringkasan Akumulasi Total Nilai OTR & Total Unit
 */
export function exportOrdersToExcel(
  orders: Order[],
  filenamePrefix = "pembukuan-showroom-mobil",
): void {
  const totalTransactions = orders.reduce(
    (acc, o) => acc + (o.totalAmount || 0),
    0,
  );
  const totalCarsCount = orders.reduce((acc, o) => {
    const safeItems = Array.isArray(o.items) ? o.items : [];
    return acc + safeItems.reduce((iAcc, it) => iAcc + (it.quantity || 1), 0);
  }, 0);

  const nowFormatted = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const rowsHTML = orders
    .map((order, idx) => {
      const safeItems = Array.isArray(order.items) ? order.items : [];
      const unitSummary = safeItems
        .map((it) => `${it.name} (${it.quantity}x)`)
        .join(", ");
      const totalQty = safeItems.reduce(
        (acc, it) => acc + (it.quantity || 1),
        0,
      );
      const bgColor = idx % 2 === 0 ? "#ffffff" : "#f8fafc";

      return `
                <tr style="background-color: ${bgColor};">
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; mso-number-format:'\\@';">${order.id}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${formatDate(order.createdAt)}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${order.customerName}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; mso-number-format:'\\@';">${order.customerNik || "-"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; mso-number-format:'\\@';">${order.customerPhone}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px;">${order.customerEmail || "-"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px;">${order.customerCity || "-"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px;">${order.customerAddress || "-"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: 500;">${unitSummary || "-"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${totalQty}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; font-weight: bold; mso-number-format:'Rp #\\,##0';">${order.totalAmount}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${order.paymentMethod === "KREDIT" ? "Kredit Leasing" : "Tunai / Cash"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px;">${order.assignedSalesName || "Belum Ada"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; mso-number-format:'\\@';">${order.assignedSalesEmployeeId || "-"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; mso-number-format:'\\@';">${order.assignedSalesPhone || "-"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${order.status}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${order.forwardedToSalesAt ? "Sudah Terkirim" : "Belum"}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${formatDate(order.forwardedToSalesAt)}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 8px;">${order.notes || "-"}</td>
                </tr>
            `;
    })
    .join("");

  const template = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Pembukuan Pemesanan Mobil</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                body { font-family: Arial, sans-serif; font-size: 11px; }
                table { border-collapse: collapse; width: 100%; }
                th { background-color: #0f172a; color: #ffffff; font-weight: bold; border: 1px solid #0f172a; padding: 10px 8px; text-align: center; }
            </style>
        </head>
        <body>
            <div style="margin-bottom: 16px;">
                <h2 style="margin: 0; color: #0f172a; font-size: 18px;">LAPORAN PEMBUKUAN PEMESANAN MOBIL</h2>
                <p style="margin: 4px 0 0 0; color: #475569; font-size: 12px;">Showroom Resmi Automotive ERP | Dicetak pada: <strong>${nowFormatted}</strong></p>
                <p style="margin: 2px 0 12px 0; color: #475569; font-size: 12px;">Total Transaksi: <strong>${orders.length} Pemesanan</strong> | Total Unit: <strong>${totalCarsCount} Unit</strong> | Akumulasi Nilai: <strong>${formatCurrency(totalTransactions)}</strong></p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>No. Pemesanan</th>
                        <th>Tanggal Masuk</th>
                        <th>Nama Calon Pembeli</th>
                        <th>NIK KTP (Arsip)</th>
                        <th>No. WhatsApp</th>
                        <th>Email</th>
                        <th>Kota Domisili</th>
                        <th>Alamat Lengkap</th>
                        <th>Unit Mobil Dipesan</th>
                        <th>Total Unit</th>
                        <th>Nilai OTR (Rp)</th>
                        <th>Skema Pembayaran</th>
                        <th>Sales Konsultan</th>
                        <th>ID Sales</th>
                        <th>WA Sales</th>
                        <th>Status</th>
                        <th>Dispatch WA</th>
                        <th>Waktu Dispatch</th>
                        <th>Catatan Khusus</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML}
                    <!-- Summary Row -->
                    <tr style="background-color: #e2e8f0; font-weight: bold;">
                        <td colspan="9" style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">TOTAL AKUMULASI:</td>
                        <td style="border: 1px solid #cbd5e1; padding: 10px; text-align: center;">${totalCarsCount} Unit</td>
                        <td style="border: 1px solid #cbd5e1; padding: 10px; text-align: right; mso-number-format:'Rp #\\,##0';">${totalTransactions}</td>
                        <td colspan="8" style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 11px; color: #475569;">(${orders.length} berkas transaksi pemesanan)</td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
    `;

  const blob = new Blob([template], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filenamePrefix}-${timestamp}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
