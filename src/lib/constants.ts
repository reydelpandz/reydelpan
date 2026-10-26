import type { OrderStatus } from "@/generated/prisma";

// The statuses staff actually set and filter by.
export const ORDER_STATUSES: OrderStatus[] = ["PENDING", "DELIVERED"];
