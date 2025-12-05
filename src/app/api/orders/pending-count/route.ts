import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { Role } from "@/generated/prisma";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!hasPermission(session?.user.role as Role, "VIEW_ORDERS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        const count = await prisma.order.count({
            where: {
                status: "PENDING",
            },
        });

        return Response.json({ count }, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: "Error on the server side." },
            { status: 500 }
        );
    }
}
