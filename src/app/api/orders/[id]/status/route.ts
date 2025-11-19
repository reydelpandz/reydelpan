import { Role, User } from "@/generated/prisma";
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
        const user = authSession?.user as User;
        const isConfirmation = body.newStatus === "DELIVERED";

        if (
            !hasPermission(authSession?.user.role as Role, "EDIT_ORDER_STATUS")
        ) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        await prisma.order.update({
            where: { id: orderId, confirmedBy: null, confirmedAt: null },
            data: {
                status: body.newStatus,
                ...(isConfirmation && {
                    confirmedBy: user.name,
                    confirmedAt: new Date(),
                }),
            },
            select: { id: true },
        });

        return Response.json(
            { message: "Status updated successfully" },
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
