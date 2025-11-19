"use client";

import { formatPrice } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface TopSellingProduct {
    id: number;
    name: string;
    totalSold: number;
    revenue: number;
}

interface TopSellingProductsTableProps {
    products: TopSellingProduct[];
}

export function TopSellingProductsTable({ products }: TopSellingProductsTableProps) {
    if (!products || products.length === 0) {
        return <p className="text-center py-4 text-muted-foreground">No data available</p>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Units Sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">
                                <Link 
                                    href={`/administration/products/${product.id}`}
                                    className="hover:underline text-blue-600"
                                >
                                    {product.name}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">{product.totalSold}</TableCell>
                            <TableCell className="text-right">{formatPrice(product.revenue)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}