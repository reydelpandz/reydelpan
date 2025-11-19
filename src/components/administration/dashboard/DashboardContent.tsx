"use client";

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import {
    RiShoppingBag3Line,
    RiMoneyDollarCircleLine,
    RiShoppingCartLine,
} from "@remixicon/react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { TopSellingProductsTable } from "./TopSellingProductsTable";

export interface StatsData {
    orders: {
        total: number;
        totalRevenue: number;
        averageOrderValue: number;
        byStatus: {
            status: string;
            _count: number;
        }[];
        last30DaysRevenue: {
            date: string;
            revenue: number;
        }[];
    };
    products: {
        topSellingMonth: {
            id: number;
            name: string;
            totalSold: number;
            revenue: number;
        }[];
        topSellingSixMonths: {
            id: number;
            name: string;
            totalSold: number;
            revenue: number;
        }[];
        topSellingYear: {
            id: number;
            name: string;
            totalSold: number;
            revenue: number;
        }[];
    };
    lastUpdated: string;
}

export default function DashboardContent({
    stats,
}: {
    stats: StatsData | null;
}) {
    if (!stats) {
        return (
            <div className="text-center py-10">
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                    title="Total Orders"
                    value={stats.orders.total.toString()}
                    icon={<RiShoppingBag3Line className="h-5 w-5" />}
                    description={`As of ${format(
                        new Date(stats.lastUpdated),
                        "MMMM dd, yyyy"
                    )}`}
                />
                <StatsCard
                    title="Total Revenue"
                    value={formatPrice(stats.orders.totalRevenue)}
                    icon={<RiMoneyDollarCircleLine className="h-5 w-5" />}
                    description="All time revenue"
                />
                <StatsCard
                    title="Average Order Value"
                    value={formatPrice(stats.orders.averageOrderValue)}
                    icon={<RiShoppingCartLine className="h-5 w-5" />}
                    description="Per order average"
                />
            </div>

            {/* Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.orders.last30DaysRevenue}>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) =>
                                        format(new Date(value), "dd/MM")
                                    }
                                    fontSize={12}
                                />
                                <YAxis
                                    tickFormatter={(value) =>
                                        `${value / 1000}k`
                                    }
                                    fontSize={12}
                                />
                                <Tooltip
                                    formatter={(value) =>
                                        formatPrice(Number(value))
                                    }
                                    labelFormatter={(label) =>
                                        format(new Date(label), "MMM dd, yyyy")
                                    }
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Top Selling Products */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-full lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Top Selling Products (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TopSellingProductsTable
                            products={stats.products.topSellingMonth}
                        />
                    </CardContent>
                </Card>
                <Card className="col-span-full lg:col-span-1">
                    <CardHeader>
                        <CardTitle>
                            Top Selling Products (Last 6 Months)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TopSellingProductsTable
                            products={stats.products.topSellingSixMonths}
                        />
                    </CardContent>
                </Card>
                <Card className="col-span-full lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Top Selling Products (Last Year)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TopSellingProductsTable
                            products={stats.products.topSellingYear}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    description: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
