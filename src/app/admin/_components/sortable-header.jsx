"use client";

import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';

export function SortableHeader({ children, field, sortBy, sortOrder, onSort }) {
    const isActive = sortBy === field;
    const isAsc = sortOrder === 'asc';

    const handleSort = () => {
        const newSortOrder = isActive && isAsc ? 'desc' : 'asc';
        onSort(field, newSortOrder);
    };

    return (
        <TableHead>
            <Button variant="ghost" onClick={handleSort}>
                {children}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </TableHead>
    );
}