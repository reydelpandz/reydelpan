"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnderPressureCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UnderPressureCheckoutModal({
    isOpen,
    onClose,
}: UnderPressureCheckoutModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader className="space-y-4">
                    {/* Animated Warning Icon */}
                    <div className="mx-auto flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-red-400/30" />
                            <div className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30">
                                <XCircle className="size-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <DialogTitle className="text-center text-2xl font-bold text-red-600">
                        الطلبات متوقفة مؤقتاً
                    </DialogTitle>
                    
                    <DialogDescription className="text-center text-base leading-relaxed">
                        <div className="space-y-4">
                            <p className="text-lg font-medium text-foreground">
                                عذراً، لا نستطيع قبول طلبات جديدة حالياً
                            </p>
                            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-800">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="size-5 text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-red-800 dark:text-red-200 text-right">
                                        نظراً للضغط الكبير على طلباتنا، لا يمكننا خدمة الجميع في الوقت الحالي.
                                        نعمل بأقصى طاقتنا لمعالجة الطلبات الحالية.
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800">
                                <p className="text-amber-800 dark:text-amber-200">
                                    يرجى العودة لاحقاً والمحاولة مرة أخرى.
                                    نشكركم على تفهمكم وصبركم معنا.
                                </p>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium"
                    >
                        فهمت
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
