"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RiPhoneLine, RiMailLine } from "@remixicon/react";
import { socials } from "./Footer";
import { useSearchParams, usePathname } from "next/navigation";

export default function ContactModal() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isOpen = searchParams.get("contact") === "visible";

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("contact");
        const query = params.toString();
        history.pushState(null, "", query ? `${pathname}?${query}` : pathname);
    };

    const contactItems = [
        {
            icon: RiPhoneLine,
            label: "البليدة",
            value: "0669087382",
            href: "tel:0669087382",
        },
        {
            icon: RiPhoneLine,
            label: "الشراقة",
            value: "0696042764",
            href: "tel:0696042764",
        },
        {
            icon: RiMailLine,
            label: "البريد الإلكتروني",
            value: "reydelpan2018@gmail.com",
            href: "mailto:reydelpan2018@gmail.com",
        },
    ];

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) closeModal();
            }}
        >
            <DialogContent showCloseButton={false} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-right">تواصل معنا</DialogTitle>
                    <DialogDescription className="text-right">
                        اختر الطريقة الأنسب للتواصل معنا
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 mt-6">
                    {contactItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={index}
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg border border-input bg-background p-4 transition-colors hover:bg-accent"
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <div className="text-right flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <p className="font-medium">{item.value}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>

                <div className="flex justify-center items-center gap-4 py-2">
                    {socials.map((s) => (
                        <a key={s.name} href={s.link}>
                            {s.icon}
                        </a>
                    ))}
                </div>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={closeModal}
                >
                    إغلاق
                </Button>
            </DialogContent>
        </Dialog>
    );
}
