import DeleteUserModal from "@/components/administration/users/DeleteUserModal";
import UserDetailsModal from "@/components/administration/users/UserDetailsModal";
import UserModal from "@/components/administration/users/UserModal";
import UsersHeader from "@/components/administration/users/UsersHeader";
import UsersTable from "@/components/administration/users/UsersTable";
import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

const UsersPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const session = await getServerSession();

    if (!hasPermission(session?.user.role as Role, "VIEW_USERS")) {
        redirect("/administration/login");
    }

    const page = parseInt((await searchParams).page || "1");
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
        }),
        prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalUsers / pageSize);
    return (
        <>
            <UserDetailsModal />
            <UserModal />
            <DeleteUserModal />
            <h1 className="page-title">Users</h1>
            <div className="container mx-auto px-4 py-2">
                <UsersHeader />
                <UsersTable
                    users={users}
                    currentPage={page}
                    totalPages={totalPages}
                />
            </div>
        </>
    );
};

export default UsersPage;
