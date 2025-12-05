import {
    RiHome5Line,
    RiShoppingBag3Line,
    RiArchiveLine,
    RiBox3Line,
    RiListIndefinite,
    RiImageLine,
} from "@remixicon/react";

import {
    Sidebar as Sidepanel,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const items = [
    // {
    //     title: "Dashboard",
    //     url: "/administration",
    //     icon: RiHome5Line,
    // },
    {
        title: "Products",
        url: "/administration/products",
        icon: RiShoppingBag3Line,
    },
    {
        title: "Categories",
        url: "/administration/categories",
        icon: RiListIndefinite,
    },
    {
        title: "Orders",
        url: "/administration/orders",
        icon: RiBox3Line,
    },
    {
        title: "Users",
        url: "/administration/users",
        icon: RiArchiveLine,
    },
    {
        title: "Media",
        url: "/administration/media",
        icon: RiImageLine,
    },
];

const Sidebar = () => {
    const { toggleSidebar } = useSidebar();
    const isMobile = useIsMobile();

    const { data: pendingCount } = useQuery({
        queryKey: ["pending-orders-count"],
        queryFn: async () => {
            const { data } = await axios.get("/api/orders/pending-count");
            return data.count as number;
        },
    });

    return (
        <Sidepanel>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            onClick={() => {
                                                if (isMobile) toggleSidebar();
                                            }}
                                            href={item.url}
                                            className="flex items-center w-full"
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                            {item.title === "Orders" &&
                                            pendingCount &&
                                            pendingCount > 0 ? (
                                                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                                    {pendingCount}
                                                </span>
                                            ) : null}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidepanel>
    );
};

export default Sidebar;
