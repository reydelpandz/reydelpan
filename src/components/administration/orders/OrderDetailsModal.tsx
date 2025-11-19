"use client";

import type React from "react";

import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useModal } from "@/hooks/use-modal";
import OrderStatusBadge from "../OrderStatus";
import { formatPrice } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { Order, OrderedProduct } from "@/generated/prisma";
import OrderProductsTable from "./OrderProductsTable";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/Loader";

type OrderWithProducts = Order & {
    products: OrderedProduct[];
};

export function OrderDetailsModal() {
    const { isOpen, toggle, actionData: order } = useModal<Order | null>();

    const { data: orderDetails, isLoading } = useQuery({
        queryKey: ["order", order?.id],
        queryFn: async () => {
            if (!order?.id) return null;
            const response = await axios.get(
                `/api/orders/${order.id}/products`
            );
            return response.data as OrderWithProducts;
        },
        enabled: !!order?.id && isOpen("orderDetails"),
    });

    if (!order) {
        return null;
    }

    return (
        <Dialog
            open={isOpen("orderDetails")}
            onOpenChange={() => toggle("orderDetails")}
        >
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Order #{order.id}</span>
                        <OrderStatusBadge status={order.status} />
                    </DialogTitle>
                    <DialogDescription>
                        Placed on{" "}
                        {format(order.createdAt, "PPP", { locale: fr })}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Full Name
                                </p>
                                <p>{order.customerFullName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Phone
                                </p>
                                <p>{order.customerPhone}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{order.customerAddress}</p>
                            <p>
                                {order.customerCommune}, {order.customerWilaya}
                            </p>
                            <div>
                                Delivery method:{" "}
                                {order.deliveryMethod === "HOME" ? (
                                    <Badge className="bg-teal-400">Home</Badge>
                                ) : (
                                    <Badge className="bg-yellow-400">
                                        Stop-Desk
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {orderDetails?.customerNote && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Customer Note
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{orderDetails.customerNote}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="w-full flex justify-center py-4">
                                    <Loader />
                                </div>
                            ) : (
                                <OrderProductsTable
                                    products={orderDetails?.products ?? []}
                                />
                            )}

                            <Separator className="my-4" />

                            <div className="flex justify-between">
                                <span className="font-medium">Subtotal</span>
                                <span className="font-bold">
                                    {formatPrice(order.productsTotal)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Delivery cost
                                </span>
                                <span className="font-bold">
                                    {formatPrice(order.deliveryCost)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Total</span>
                                <span className="font-bold">
                                    {formatPrice(
                                        order.productsTotal + order.deliveryCost
                                    )}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
