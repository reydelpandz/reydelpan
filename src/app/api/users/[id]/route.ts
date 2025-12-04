import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const id = (await params).id;

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "EDIT_USERS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role: body.role },
        });

        if (!user) {
            return Response.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "User updated successfully",
        });
    } catch (error) {
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "DELETE_USERS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        await prisma.user.delete({
            where: { id },
        });

        return Response.json({
            message: "User deleted successfully",
        });
    } catch (error) {
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}
