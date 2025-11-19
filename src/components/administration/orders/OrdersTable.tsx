"use client";

import { formatPrice } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "../OrderStatus";
import {
    RiDeleteBin7Line,
    RiErrorWarningFill,
    RiInformation2Line,
    RiPencilLine,
    RiStickyNoteLine,
} from "@remixicon/react";
import { useModal } from "@/hooks/use-modal";
import { format } from "date-fns";
import { Order } from "@/generated/prisma";
import { Pagination } from "@/components/ui/pagination";
import NoResults from "../NoResults";

interface OrdersTableProps {
    orders: Order[];
    currentPage: number;
    totalPages: number;
}

const OrdersTable = ({ orders, currentPage, totalPages }: OrdersTableProps) => {
    const { toggle } = useModal();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (!orders.length) {
        return <NoResults />;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Wilaya</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        {/* <TableHead>Has Account</TableHead> */}
                        <TableHead>Ordered At</TableHead>
                        <TableHead>Confirmed By</TableHead>
                        <TableHead className="w-[100px] text-center">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">
                                {order.customerFullName}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{"No E-mail address"}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {order.customerPhone}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>{order.customerWilaya}</TableCell>
                            <TableCell>
                                <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                                {formatPrice(order.productsTotal)}
                            </TableCell>
                            {/* <TableCell>No</TableCell> */}
                            <TableCell>
                                {format(order.createdAt, "dd MMM yyyy | HH:mm")}
                            </TableCell>
                            <TableCell>
                                {order.confirmedBy && order.confirmedAt ? (
                                    <div className="flex flex-col">
                                        <span>{order.confirmedBy}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {format(
                                                order.confirmedAt,
                                                "dd MMM yyyy | HH:mm"
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    "-"
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="grid grid-cols-2 gap-1 items-center">
                                    <Button
                                        onClick={() =>
                                            toggle("orderDetails", order)
                                        }
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <RiInformation2Line className="size-5 text-green-500" />
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            toggle("orderStatusChanger", order)
                                        }
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <RiPencilLine className="size-5 text-blue-500" />
                                    </Button>
                                    <Button
                                        className="relative"
                                        onClick={() =>
                                            toggle("orderNote", order)
                                        }
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <RiStickyNoteLine className="size-5 text-yellow-500" />
                                        {(order.adminNote ||
                                            order.customerNote) && (
                                            <RiErrorWarningFill className="absolute top-1 right-1 size-4 text-destructive" />
                                        )}
                                    </Button>

                                    <Button
                                        onClick={() =>
                                            toggle("deleteOrder", order)
                                        }
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <RiDeleteBin7Line className="size-5 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <div className="py-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default OrdersTable;
