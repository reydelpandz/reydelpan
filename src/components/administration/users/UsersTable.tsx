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

interface UsersTableProps {
    users: User[];
    currentPage: number;
    totalPages: number;
}

const UsersTable = ({ users, currentPage, totalPages }: UsersTableProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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
