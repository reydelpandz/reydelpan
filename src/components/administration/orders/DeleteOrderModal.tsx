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
import axios from "axios";
import { Order } from "@/generated/prisma";

const DeleteOrderModal = () => {
    const router = useRouter();
    const {
        isOpen,
        toggle,
        actionData: selectedOrder,
    } = useModal<Order | null>();

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

    return (
        <AlertDialog
            open={isOpen("deleteOrder")}
            onOpenChange={() => {
                toggle("deleteOrder");
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
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        isLoading={isPending}
                        onClick={() => handleDelete()}
                        variant="destructive"
                    >
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteOrderModal;
