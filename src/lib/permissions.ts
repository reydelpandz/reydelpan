import { Role } from "@/generated/prisma";

export const PERMISSIONS = [
    "VIEW_ADMIN_DASHBOARD",
    // Products
    "VIEW_PRODUCTS",
    "CREATE_PRODUCTS",
    "EDIT_PRODUCTS",
    "DELETE_PRODUCTS",

    // Users
    "VIEW_USERS",
    "CREATE_USERS",
    "EDIT_USERS",
    "DELETE_USERS",

    // Orders
    "VIEW_ORDERS",
    "CREATE_ORDERS",
    "EDIT_ORDER_STATUS",
    "EDIT_ORDER_NOTE",
    "EDIT_ORDERS",
    "DELETE_ORDERS",

    // Categories
    "VIEW_CATEGORIES",
    "CREATE_CATEGORIES",
    "EDIT_CATEGORIES",
    "DELETE_CATEGORIES",

    // Media
    "VIEW_MEDIA",
    "CREATE_MEDIA",
    "EDIT_MEDIA",
    "DELETE_MEDIA",
] as const;

export type Permission = (typeof PERMISSIONS)[number] | "*";

export const permissions: Record<Role | "GUEST", Permission[]> = {
    ADMIN: ["*"],

    MANAGER: [
        "VIEW_ORDERS",
        "EDIT_ORDER_STATUS",
        "EDIT_ORDER_NOTE",
        "DELETE_ORDERS",
    ],

    CUSTOMER: [],
    GUEST: [],
};

export function hasPermission(
    role: Role | "GUEST",
    action: Permission
): boolean {
    // In case the role hasn't loaded yet, we default to GUEST
    const rolePerms = permissions[role ?? "GUEST"];

    return rolePerms.includes("*") || rolePerms.includes(action);
}
