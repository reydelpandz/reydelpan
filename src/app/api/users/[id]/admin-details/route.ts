import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

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

        const deliveredOrdersCount = await prisma.order.count({
            where: { confirmedBy: userId, status: "DELIVERED" },
        });

        const now = new Date();
        const stats = [];

        for (let i = 0; i < 3; i++) {
            const date = subMonths(now, i);
            const start = startOfMonth(date);
            const end = endOfMonth(date);

            const count = await prisma.order.count({
                where: {
                    confirmedBy: userId,
                    confirmedAt: {
                        gte: start,
                        lte: end,
                    },
                },
            });

            stats.push({
                month: format(date, "MMMM"),
                year: format(date, "yyyy"),
                count,
            });
        }

        return Response.json(
            { deliveredOrdersCount, confirmedOrdersStats: stats.reverse() },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}
