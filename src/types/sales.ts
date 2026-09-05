export interface SalesPerson {
    id: string;
    employeeId: string; // NIK / Nomor Induk Karyawan ERP
    name: string;
    phone: string;
    email: string;
    title: string;
    status: 'ACTIVE' | 'INACTIVE';
    assignedLeadsCount: number;
    lastAssignedAt?: string;
    createdAt: string;
    updatedAt: string;
}
