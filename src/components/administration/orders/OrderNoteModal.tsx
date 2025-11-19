"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/use-modal";
import type { Order } from "@/generated/prisma";
import { toast } from "sonner";
import {
    RiAccountCircleLine,
    RiChat4Line,
    RiPencilLine,
} from "@remixicon/react";
import { useRouter } from "next/navigation";

export function OrderNoteModal() {
    const { isOpen, toggle, actionData: order } = useModal<Order | null>();
    const router = useRouter();
    const [adminNote, setAdminNote] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (order?.adminNote) {
            setAdminNote(order.adminNote);
        } else {
            setAdminNote("");
        }
        setIsEditing(false);
    }, [order?.adminNote]);

    const { mutate: updateNote, isPending } = useMutation({
        mutationFn: async () => {
            if (!order?.id) return;
            return axios.patch(`/api/orders/${order.id}/note`, { adminNote });
        },
        onSuccess: () => {
            toast("Admin note updated successfully");
            router.refresh();
            setIsEditing(false);
        },
        onError: () => {
            toast("Failed to update admin note");
        },
    });

    const handleCancel = () => {
        setAdminNote(order?.adminNote || "");
        setIsEditing(false);
    };

    if (!order) return null;

    return (
        <Dialog
            open={isOpen("orderNote")}
            onOpenChange={() => toggle("orderNote")}
        >
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Order Notes - #{order.id}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {order.customerNote && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <RiAccountCircleLine className="size-5" />
                                Customer Note
                            </div>
                            <div className="rounded-lg border bg-muted/50 p-4 text-sm">
                                {order.customerNote}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <RiChat4Line className="size-5" />
                            Admin Note
                        </div>
                        {!isEditing ? (
                            <div className="rounded-lg border bg-muted/50 p-4 text-sm relative group">
                                {adminNote || (
                                    <span className="text-muted-foreground italic">
                                        No admin note yet
                                    </span>
                                )}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 h-8 w-8 transition-opacity"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <RiPencilLine className="size-5" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Textarea
                                    placeholder="Add an internal note for your team..."
                                    value={adminNote}
                                    onChange={(e) =>
                                        setAdminNote(e.target.value)
                                    }
                                    className="min-h-[120px]"
                                    autoFocus
                                />

                                <div className="flex justify-end gap-2 mt-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => updateNote()}
                                        isLoading={isPending}
                                    >
                                        Save Admin Note
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
