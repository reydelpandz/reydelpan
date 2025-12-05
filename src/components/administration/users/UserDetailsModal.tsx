"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { User } from "@/generated/prisma";
import Loader from "@/components/Loader";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UserDetailsResponse = {
    deliveredOrdersCount: number;
    confirmedOrdersStats: {
        month: string;
        year: string;
        count: number;
    }[];
};

export function UserDetailsModal() {
    const { isOpen, toggle, actionData: user } = useModal<User | null>();

    const { data: stats, isLoading } = useQuery({
        queryKey: ["user-admin-details", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const response = await axios.get(
                `/api/users/${user.id}/admin-details`
            );
            return response.data as UserDetailsResponse;
        },
        enabled: !!user?.id && isOpen("userDetails"),
    });

    if (!user) return null;

    return (
        <Dialog
            open={isOpen("userDetails")}
            onOpenChange={() => toggle("userDetails")}
        >
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>User Details: {user.name}</DialogTitle>
                    <DialogDescription>
                        Role: {user.role} | Email: {user.email}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader />
                        </div>
                    ) : stats ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Delivered
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {stats.deliveredOrdersCount}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Confirmed (Last 3 Mo)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {stats.confirmedOrdersStats.reduce(
                                                (acc, curr) => acc + curr.count,
                                                0
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Confirmed Orders Trend
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={
                                                    stats.confirmedOrdersStats
                                                }
                                            >
                                                <XAxis
                                                    dataKey="month"
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    allowDecimals={false}
                                                />
                                                <Tooltip
                                                    cursor={{
                                                        fill: "transparent",
                                                    }}
                                                    contentStyle={{
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    fill="#3b82f6"
                                                    radius={[4, 4, 0, 0]}
                                                    name="Confirmed"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No data available.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UserDetailsModal;
