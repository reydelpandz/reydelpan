import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";
import { startOfMonth } from "date-fns";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = (await params).id;

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "VIEW_USERS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);

        const thisMonthDeliveredCount = await prisma.order.count({
            where: {
                confirmedBy: userId,
                status: "DELIVERED",
                confirmedAt: {
                    gte: startOfCurrentMonth,
                },
            },
        });

        const previousMonthsDeliveredCount = await prisma.order.count({
            where: {
                confirmedBy: userId,
                status: "DELIVERED",
                confirmedAt: {
                    lt: startOfCurrentMonth,
                },
            },
        });

        return Response.json(
            {
                thisMonthDeliveredCount,
                previousMonthsDeliveredCount,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}
