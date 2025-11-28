"use client";

import { RiHome2Line } from "@remixicon/react";
import { SidebarTrigger } from "../ui/sidebar";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { revokeSessions } from "@/lib/auth-client";

const AdminHeader = () => {
    const router = useRouter();
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
            <div className="flex-1">
                <SidebarTrigger />
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
