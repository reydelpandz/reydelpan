"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Order } from "@/generated/prisma";

const DeleteOrderModal = () => {
    const router = useRouter();
    const {
        isOpen,
        toggle,
        actionData: selectedOrder,
    } = useModal<Order | null>();
    const [confirmationText, setConfirmationText] = useState("");

    const { isPending, mutate: handleDelete } = useMutation({
        mutationFn: async () => {
            if (!selectedOrder) return;
            await axios.delete(`/api/orders/${selectedOrder.id}`);
        },
        onSuccess() {
            toast.success("Order deleted successfully");
            toggle("deleteOrder");
            router.refresh();
        },
        onError(error: any) {
            toast.error(error.message);
        },
    });

    const isDeleteConfirmed =
        confirmationText.toLowerCase() === "delete this order";

    useEffect(() => {
        if (!isOpen("deleteOrder")) {
            setConfirmationText("");
        }
    }, [isOpen("deleteOrder")]);

    return (
        <AlertDialog
            open={isOpen("deleteOrder")}
            onOpenChange={() => {
                toggle("deleteOrder");
                setConfirmationText("");
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this order.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-3">
                    <Label htmlFor="confirmation">
                        To confirm, type delete this order below:
                    </Label>
                    <Input
                        id="confirmation"
                        type="text"
                        placeholder="delete this order"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        isLoading={isPending}
                        onClick={() => handleDelete()}
                        variant="destructive"
                        disabled={!isDeleteConfirmed}
                    >
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteOrderModal;
