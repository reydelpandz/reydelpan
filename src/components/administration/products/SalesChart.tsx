"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";

interface SalesChartProps {
    data: Array<{
        month: string;
        sales: number;
        earnings: number;
    }>;
}

export function SalesChart({ data }: SalesChartProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Monthly Sales (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]s">
                <ChartContainer
                    config={{
                        sales: {
                            label: "Sales",
                            color: "#2563eb",
                        },
                        earnings: {
                            label: "Earnings",
                            color: "#10b981",
                        },
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <ChartTooltipContent
                                                formatter={(value, name) => {
                                                    if (name === "earnings") {
                                                        return formatPrice(
                                                            Number(value)
                                                        );
                                                    }
                                                    return value;
                                                }}
                                            />
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="sales"
                                stroke="var(--color-sales)"
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="earnings"
                                stroke="var(--color-earnings)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
