"use client";

import AdminHeader from "@/components/administration/AdminHeader";
import AdminSidebar from "@/components/administration/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const showNav = !pathname.includes("/login");

    return (
        <SidebarProvider lang="en" dir="ltr">
            {showNav && <AdminSidebar />}
            <div className="w-full">
                {showNav && <AdminHeader />}
                {children}
            </div>
        </SidebarProvider>
    );
}
