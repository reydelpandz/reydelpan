import React from "react";
import { Badge } from "../ui/badge";
import { OrderStatus } from "@/generated/prisma";

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            // Primary statuses
            case "PENDING":
                return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50";
            case "TO_BE_CONFIRMED":
                return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50";
            case "SHIPPING":
                return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50";
            case "DELIVERED":
                return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";

            // Failure statuses - different shades of red/orange
            case "FAILED_01":
                return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50";
            case "FAILED_02":
                return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50";
            case "FAILED_03":
                return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50";
            case "FAILED_04":
                return "bg-red-100 text-red-800 border-red-300 hover:bg-red-100";
            case "FAILED_05":
                return "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-100";

            // Issue statuses - yellow/amber tones
            case "DUPLICATE":
                return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50";
            case "WRONG_NUMBER":
                return "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100";
            case "WRONG_ORDER":
                return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100";

            // Special cases
            case "OUT_OF_STOCK":
                return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50";
            case "CANCELED":
                return "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-100";

            default:
                return "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50";
        }
    };

    return (
        <Badge className={getStatusColor(status)} variant="outline">
            {status.replaceAll("_", " ")}
        </Badge>
    );
};

export default OrderStatusBadge;
