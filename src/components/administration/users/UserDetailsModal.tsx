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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UserDetailsResponse = {
    thisMonthDeliveredCount: number;
    previousMonthsDeliveredCount: number;
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
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        This Month Delivered
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats.thisMonthDeliveredCount}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Previous Months Delivered
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats.previousMonthsDeliveredCount}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
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
