"use client";

import { useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { RiMenu2Line, RiShoppingCartLine } from "@remixicon/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { Role } from "@/generated/prisma";
import { hasPermission } from "@/lib/permissions";
import { motion } from "motion/react";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const session = useSession();
    const role = session.data?.user.role as Role;

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    const navItems = [
        { href: "/", label: "الرئيسية" },
        { href: "/products", label: "المتجر" },
        { href: "/#about", label: "من نحن" },
        { href: "/#faq", label: "الإستفسارات" },
    ];

    if (hasPermission(role, "VIEW_ORDERS")) {
        navItems.push({ href: "/administration/orders", label: "الإدارة" });
    }

    return (
        <header
            className={cn(
                "shadow p-4 bg-background/75 backdrop-blur-sm sticky top-0 z-50 h-24",
                pathname !== "/" && "mb-8"
            )}
        >
            <div className="container flex justify-between items-center mx-auto h-full max-md:flex-row-reverse">
                <Link href="/" className="flex items-center">
                    <Logo />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-foreground hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Cart Icon - Desktop */}
                    <CheckoutButton />
                </nav>

                <div className="md:hidden flex items-center gap-2">
                    {/* Cart Icon - Mobile (Always visible) */}
                    <CheckoutButton />

                    {/* Mobile Menu Button with Sheet */}
                    <Sheet
                        open={isMobileMenuOpen}
                        onOpenChange={setIsMobileMenuOpen}
                    >
                        <SheetTrigger asChild>
                            <button
                                className="text-foreground p-2 focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                <RiMenu2Line className="size-6" />
                            </button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="p-0 w-[300px] sm:w-[350px]"
                        >
                            <SheetTitle className="hidden">
                                Mobile Navbar
                            </SheetTitle>
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b flex justify-center">
                                    <Logo />
                                </div>
                                <nav className="flex-1 overflow-auto py-6 px-4">
                                    <div className="flex flex-col text-right space-y-5">
                                        {navItems.map((item, index) => (
                                            <motion.div
                                                key={item.href}
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={
                                                    isMobileMenuOpen
                                                        ? { opacity: 1, x: 0 }
                                                        : { opacity: 0, x: 50 }
                                                }
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.1,
                                                    ease: [0.25, 0.46, 0.45, 0.94],
                                                }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={handleLinkClick}
                                                    className="text-foreground hover:text-primary transition-colors py-2 text-lg font-medium block"
                                                >
                                                    {item.label}
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </nav>
                                <div className="p-4 border-t mt-auto">
                                    <p
                                        className="text-sm text-muted-foreground text-center"
                                        dir="ltr"
                                    >
                                        © {`2018-${new Date().getFullYear()}`}{" "}
                                        Rey del Pan
                                    </p>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Header;

const CheckoutButton = () => {
    const { isEmpty, itemsCount } = useCart();

    if (isEmpty) {
        return null;
    }

    return (
        <Link
            href="/checkout"
            className="relative p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="View your shopping cart"
        >
            <RiShoppingCartLine size={20} />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white shadow text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemsCount}
            </span>
        </Link>
    );
};
