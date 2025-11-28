import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma";
import { hasPermission } from "@/lib/permissions";

export default async function DashboardPage() {
    const authSession = await getServerSession();

    if (
        !hasPermission(authSession?.user.role as Role, "VIEW_ADMIN_DASHBOARD")
    ) {
        redirect("/administration/login");
    }

    redirect("/administration/orders");
}
