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

interface DataTableProps<TData extends Record<string, any>> {
    columns: {
        header: string;
        accessorKey: keyof TData;
        cell?: (data: TData) => React.ReactNode;
    }[];
    data: TData[];
}

export function DataTable<TData extends Record<string, any>>({
    columns,
    data,
}: DataTableProps<TData>) {
    return (
        <div className="rounded-md border">
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
