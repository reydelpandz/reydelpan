"use client";

import { RiErrorWarningFill, RiHome2Line } from "@remixicon/react";
import { SidebarTrigger } from "../ui/sidebar";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { revokeSessions } from "@/lib/auth-client";
import axios from "axios";

const AdminHeader = () => {
    const router = useRouter();

    const { data: pendingCount } = useQuery({
        queryKey: ["pending-orders-count"],
        queryFn: async () => {
            const { data } = await axios.get("/api/orders/pending-count");
            return data.count as number;
        },
    });

    const { mutate: handleSignOut, isPending } = useMutation({
        mutationFn: async () => {
            await revokeSessions();
        },
        onSuccess() {
            router.replace("/");
        },
        onError(error) {
            toast.error(error.message);
        },
    });
    return (
        <header className="flex items-center justify-between py-6 px-4">
            <div className="flex-1 flex items-center gap-2">
                <SidebarTrigger />
                {pendingCount && pendingCount > 0 ? (
                    <RiErrorWarningFill className="text-red-500 w-6 h-6 animate-pulse" />
                ) : null}
            </div>
            <div className="flex items-center gap-2">
                <Link href="/" className={buttonVariants({ size: "icon" })}>
                    <RiHome2Line />
                </Link>
                <Button
                    isLoading={isPending}
                    onClick={() => handleSignOut()}
                    variant="destructive"
                >
                    Sign Out
                </Button>
            </div>
        </header>
    );
};

export default AdminHeader;
