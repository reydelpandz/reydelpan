import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const orderId = Number((await params).id);

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "DELETE_ORDERS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        await prisma.order.delete({
            where: { id: orderId },
        });

        return Response.json(
            { message: "Order deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}
