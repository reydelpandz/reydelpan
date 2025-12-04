"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User } from "@/generated/prisma";
import { format } from "date-fns";
import { Pagination } from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NoResults from "../NoResults";
import { Button } from "@/components/ui/button";
import { RiPencilLine } from "@remixicon/react";
import { useModal } from "@/hooks/use-modal";
import { Trash2 } from "lucide-react";

interface UsersTableProps {
    users: User[];
    currentPage: number;
    totalPages: number;
}

const UsersTable = ({ users, currentPage, totalPages }: UsersTableProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toggle } = useModal();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (!users.length) {
        return <NoResults />;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell className="font-medium">
                                {user.email}
                            </TableCell>
                            <TableCell className="font-medium">
                                {user.role}
                            </TableCell>
                            <TableCell className="font-medium">
                                {format(user.createdAt, "dd/mm/yyyy")}
                            </TableCell>

                            <TableCell>
                                <div className="grid grid-cols-2 gap-1 items-center">
                                    <Button
                                        onClick={() => toggle("user", user)}
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <RiPencilLine className="size-5 text-blue-500" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            toggle("deleteUser", user)
                                        }
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

export default UsersTable;
