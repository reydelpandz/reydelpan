import OrdersTable from "@/components/administration/orders/OrdersTable";
import OrdersHeader from "@/components/administration/orders/OrdersHeader";
import { redirect } from "next/navigation";
import { OrderDetailsModal } from "@/components/administration/orders/OrderDetailsModal";
import OrderStatusChanger from "@/components/administration/orders/OrderStatusChanger";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import DeleteOrderModal from "@/components/administration/orders/DeleteOrderModal";
import { OrderNoteModal } from "@/components/administration/orders/OrderNoteModal";
import { OrderStatus, Role } from "@/generated/prisma";
import { hasPermission } from "@/lib/permissions";

const OrdersPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const authSession = await getServerSession();

    if (!hasPermission(authSession?.user.role as Role, "VIEW_ORDERS")) {
        redirect("/administration/login");
    }

    const status = (await searchParams).status as OrderStatus;
    const searchType = (await searchParams).searchType;
    const query = (await searchParams).query;
    const showAllOrders = (await searchParams).showAllOrders === "true";

    const page = parseInt((await searchParams).page || "1");
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const whereClause: any = {};

    if (status) {
        whereClause.status = status;
    } else {
        if (!showAllOrders) {
            whereClause.status = { not: "SHIPPING" as OrderStatus };
        }
    }

    if (query && searchType) {
        switch (searchType) {
            case "id":
                const orderId = parseInt(query);
                if (!isNaN(orderId)) {
                    whereClause.id = orderId;
                }
                break;
            case "name":
                whereClause.customerFullName = {
                    contains: query,
                    mode: "insensitive",
                };
                break;
            case "phone":
                whereClause.OR = [
                    { customerPhone: { contains: query } },
                    { customerPhone2: { contains: query } },
                ];
                break;
            case "confirmedBy":
                whereClause.confirmedBy = {
                    contains: query,
                    mode: "insensitive",
                };
                break;
        }
    }

    const [orders, totalOrders] = await Promise.all([
        prisma.order.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
        }),
        prisma.order.count({
            where: whereClause,
        }),
    ]);

    const totalPages = Math.ceil(totalOrders / pageSize);

    return (
        <>
            <OrderDetailsModal />
            <DeleteOrderModal />
            <OrderStatusChanger />
            <OrderNoteModal />

            <h1 className="page-title">Orders</h1>
            <div className="container mx-auto px-4 py-2">
                <OrdersHeader />
                <OrdersTable
                    orders={orders}
                    currentPage={page}
                    totalPages={totalPages}
                />
            </div>
        </>
    );
};

export default OrdersPage;
