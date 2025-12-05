"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal";
import OrderStatusBadge from "../OrderStatus";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next//navigation";
import { Order, OrderStatus } from "@/generated/prisma";

export default function OrderStatusChanger() {
    const { isOpen, toggle, actionData: order } = useModal<Order | null>();
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState<
        OrderStatus | undefined
    >(order?.status);
    const statuses: OrderStatus[] = ["PENDING", "DELIVERED"];

    const { isPending, mutate } = useMutation({
        mutationFn: async () => {
            if (!selectedStatus) {
                return toast.error(
                    "There was an error, no status was selected"
                );
            }
            return await axios.patch(`/api/orders/${order!.id}/status`, {
                newStatus: selectedStatus,
            });
        },
        onSuccess() {
            toast.success("Status updated successfully");
            toggle("orderStatusChanger");
            router.refresh();
        },
        onError(error) {
            isAxiosError(error) && toast.error(error.response?.data.message);
        },
    });

    if (!order) return null;

    return (
        <Dialog
            open={isOpen("orderStatusChanger")}
            onOpenChange={() => toggle("orderStatusChanger")}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                    <DialogDescription>
                        Change the status for order #{order.id}
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        mutate();
                    }}
                >
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="current-status"
                                className="text-right"
                            >
                                Current
                            </Label>
                            <div className="col-span-3">
                                <OrderStatusBadge status={order.status} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-status" className="text-right">
                                New Status
                            </Label>
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) =>
                                    setSelectedStatus(value as OrderStatus)
                                }
                            >
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Select new status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            <div className="flex items-center">
                                                <span>
                                                    {status.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            isLoading={isPending}
                            type="submit"
                            disabled={selectedStatus === order.status}
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
