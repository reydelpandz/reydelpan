"use client";

import { useModal } from "@/hooks/use-modal";
import { formatPrice } from "@/lib/utils";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Product } from "@/generated/prisma";
import { RiBarChart2Line } from "@remixicon/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import NoResults from "../NoResults";

interface ProductsTableProps {
    products: Product[];
    currentPage: number;
    totalPages: number;
}

const ProductsTable = ({
    products,
    totalPages,
    currentPage,
}: ProductsTableProps) => {
    const { toggle } = useModal();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleEdit = (product: Product) => {
        toggle("product", product);
    };

    const handleDelete = (product: Product) => {
        toggle("deleteProduct", product);
    };

    if (!products.length) {
        return <NoResults />;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discounted Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">
                                <div className="flex gap-2 items-center">
                                    <div className="h-16 w-16 relative rounded-md overflow-hidden">
                                        <Image
                                            className="object-cover"
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            sizes="64px"
                                            unoptimized
                                        />
                                    </div>
                                    <Link
                                        className="hover:underline"
                                        href={`/products/${product.slug}`}
                                    >
                                        {product.name}
                                    </Link>
                                </div>
                            </TableCell>
                            <TableCell>{formatPrice(product.price)}</TableCell>
                            <TableCell>
                                {Number(product.discountedPrice) > 0
                                    ? formatPrice(product.discountedPrice!)
                                    : "-"}
                            </TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>
                                <div className="flex gap-2 items-center">
                                    <Link
                                        href={`/administration/products/${product.id}/stats`}
                                        prefetch={false}
                                        className={buttonVariants({
                                            variant: "ghost",
                                            size: "icon",
                                        })}
                                    >
                                        <RiBarChart2Line className="h-4 w-4 text-green-500" />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <Pencil className="h-4 w-4 text-blue-500" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(product)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {totalPages > 1 && (
                <div className="py-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductsTable;
