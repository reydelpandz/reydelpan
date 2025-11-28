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
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
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
