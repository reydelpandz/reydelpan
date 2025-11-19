import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const orderId = Number((await params).id);

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "VIEW_ORDERS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        const orderWithProducts = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!orderWithProducts) {
            return Response.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        return Response.json(orderWithProducts, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}
