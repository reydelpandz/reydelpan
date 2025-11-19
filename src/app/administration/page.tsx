import DashboardContent from "@/components/administration/dashboard/DashboardContent";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { subDays, subMonths, subYears, startOfMonth, format } from "date-fns";
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

    // Calculate date ranges
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    const sixMonthsAgo = subMonths(today, 6);
    const oneYearAgo = subYears(today, 1);
    const startOfCurrentMonth = startOfMonth(today);

    // Fetch all data in parallel with optimized queries - ONLY DELIVERED ORDERS
    const [
        ordersByStatus,
        totalRevenueResult,
        ordersCount,
        last30DaysRevenueData,
        topSellingMonth,
        topSellingSixMonths,
        topSellingYear,
    ] = await Promise.all([
        // Orders by status (still get all statuses for the chart)
        prisma.order.groupBy({
            by: ["status"],
            _count: true,
        }),

        // Total revenue - ONLY DELIVERED
        prisma.order.aggregate({
            _sum: { productsTotal: true },
            where: {
                status: "DELIVERED",
            },
        }),

        // Total orders count - ONLY DELIVERED
        prisma.order.count({
            where: {
                status: "DELIVERED",
            },
        }),

        // Revenue by day for last 30 days - ONLY DELIVERED
        prisma.order.groupBy({
            by: ["createdAt"],
            _sum: { productsTotal: true },
            where: {
                createdAt: { gte: thirtyDaysAgo },
                status: "DELIVERED",
            },
            orderBy: {
                createdAt: "asc",
            },
        }),

        // Top selling products for current month - ONLY DELIVERED
        getTopSellingProductsOptimized(startOfCurrentMonth),

        // Top selling products for last 6 months - ONLY DELIVERED
        getTopSellingProductsOptimized(sixMonthsAgo),

        // Top selling products for last year - ONLY DELIVERED
        getTopSellingProductsOptimized(oneYearAgo),
    ]);

    // Process revenue data by day for the last 30 days
    const revenueByDay = last30DaysRevenueData.reduce((acc, dayData) => {
        const dateKey = format(dayData.createdAt, "yyyy-MM-dd");
        acc[dateKey] = dayData._sum.productsTotal || 0;
        return acc;
    }, {} as Record<string, number>);

    // Fill in missing days
    const last30DaysRevenue = Array.from({ length: 30 }).map((_, i) => {
        const date = format(subDays(today, 29 - i), "yyyy-MM-dd");
        return {
            date,
            revenue: revenueByDay[date] || 0,
        };
    });

    const stats = {
        orders: {
            total: ordersCount,
            totalRevenue: totalRevenueResult._sum.productsTotal || 0,
            averageOrderValue:
                ordersCount > 0
                    ? (totalRevenueResult._sum.productsTotal || 0) / ordersCount
                    : 0,
            byStatus: ordersByStatus,
            last30DaysRevenue,
        },
        products: {
            topSellingMonth,
            topSellingSixMonths,
            topSellingYear,
        },
        lastUpdated: new Date().toISOString(),
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <DashboardContent stats={stats} />
        </div>
    );
}

// Optimized function to get top selling products - ONLY DELIVERED ORDERS
async function getTopSellingProductsOptimized(startDate: Date) {
    const result = await prisma.orderedProduct.groupBy({
        by: ["productId", "name"],
        _sum: {
            quantity: true,
            retailPrice: true,
        },
        where: {
            order: {
                createdAt: {
                    gte: startDate,
                },
                status: "DELIVERED", // Only delivered orders
            },
            productId: {
                not: null,
            },
        },
        orderBy: {
            _sum: {
                quantity: "desc",
            },
        },
        take: 5,
    });

    return result.map((item) => ({
        id: item.productId!,
        name: item.name,
        totalSold: item._sum.quantity || 0,
        revenue: (item._sum.retailPrice || 0) * (item._sum.quantity || 0),
    }));
}
