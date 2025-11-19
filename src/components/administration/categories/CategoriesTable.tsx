"use client";

import { useModal } from "@/hooks/use-modal";

import { Pencil, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Category } from "@/generated/prisma";
import NoResults from "../NoResults";

interface CategoriesTableProps {
    categories: Category[];
}

const CategoriesTable = ({ categories }: CategoriesTableProps) => {
    const { toggle } = useModal();

    const handleEdit = (category: Category) => {
        toggle("category", category);
    };

    const handleDelete = (category: Category) => {
        toggle("deleteCategory", category);
    };

    if (!categories.length) {
        return <NoResults />;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium">
                                {category.label}
                            </TableCell>
                            <TableCell>{category.priority}</TableCell>
                            <TableCell>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4 text-blue-500" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(category)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CategoriesTable;
