'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export interface Column<T extends Record<string, any>> {
    header: string;
    accessorKey: keyof T;
    cell?: (data: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, any>> {
    columns: Column<T>[];
    data: T[];
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
}: DataTableProps<T>): React.ReactElement {
    return (
        <div className="relative w-full overflow-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={String(column.accessorKey)}>
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map((column) => (
                                <TableCell key={String(column.accessorKey)}>
                                    {column.cell
                                        ? column.cell(row)
                                        : (row[
                                              column.accessorKey
                                          ] as React.ReactNode)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
