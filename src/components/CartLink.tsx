"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { usePathname } from "next/navigation";

const CartLink = () => {
    const { signalCart } = useCart();
    const pathname = usePathname();

    if (!signalCart || pathname.startsWith("/checkout")) {
        return null;
    }

    return (
        <Link
            href="/checkout"
            className={buttonVariants({
                className:
                    "w-full max-w-96 animate-bounce fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
                size: "lg",
            })}
        >
            الإنتقال إلى السلة
        </Link>
    );
};

export default CartLink;
