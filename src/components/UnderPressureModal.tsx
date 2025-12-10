"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnderPressureModalProps {
    isUnderPressure: boolean;
}

const UnderPressureModal = ({ isUnderPressure }: UnderPressureModalProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const showPressureModal = searchParams.get("pressure") === "true";
        if (showPressureModal && isUnderPressure) {
            setIsOpen(true);
        }
    }, [searchParams, isUnderPressure]);

    // Also show modal automatically when visiting the site for the first time
    useEffect(() => {
        if (isUnderPressure) {
            // Check if user has already seen the modal in this session
            const hasSeenModal = sessionStorage.getItem("hasSeenPressureModal");
            if (!hasSeenModal) {
                setIsOpen(true);
                sessionStorage.setItem("hasSeenPressureModal", "true");
            }
        }
    }, [isUnderPressure]);

    const handleClose = () => {
        setIsOpen(false);
        // Remove the pressure param from URL if present
        const params = new URLSearchParams(searchParams.toString());
        if (params.has("pressure")) {
            params.delete("pressure");
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
            router.replace(newUrl, { scroll: false });
        }
    };

    if (!isUnderPressure) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader className="space-y-4">
                    {/* Animated Warning Icon */}
                    <div className="mx-auto flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" />
                            <div className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                                <AlertTriangle className="size-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <DialogTitle className="text-center text-2xl font-bold text-amber-600">
                        تنبيه هام
                    </DialogTitle>
                    
                    <DialogDescription className="text-center text-base leading-relaxed">
                        <div className="space-y-4">
                            <p className="text-lg font-medium text-foreground">
                                نحن نواجه ضغطاً كبيراً حالياً
                            </p>
                            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800">
                                <p className="text-amber-800 dark:text-amber-200">
                                    بسبب الطلب الكبير على منتجاتنا، قد نواجه تأخيراً في معالجة الطلبات.
                                    نعتذر عن أي إزعاج قد يسببه ذلك ونشكركم على تفهمكم وصبركم.
                                </p>
                            </div>
                            <p className="text-muted-foreground">
                                سنبذل قصارى جهدنا لخدمتكم في أقرب وقت ممكن.
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Button
                        onClick={handleClose}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium"
                    >
                        فهمت، المتابعة
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UnderPressureModal;
