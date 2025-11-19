import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const orderId = Number((await params).id);

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "EDIT_ORDER_NOTE")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { adminNote: body.adminNote },
        });

        return Response.json(
            { message: "Admin note updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "Error updating admin note" },
            { status: 500 }
        );
    }
}
