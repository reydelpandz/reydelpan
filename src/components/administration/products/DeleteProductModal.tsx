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
import { Product } from "@/generated/prisma";
import axios from "axios";

const DeleteProductModal = () => {
    const router = useRouter();
    const { isOpen, toggle, actionData: selectedProduct } = useModal<Product>();
    const [confirmationText, setConfirmationText] = useState("");

    const { isPending, mutate: handleDelete } = useMutation({
        mutationFn: async () => {
            return await axios.delete(`/api/products/${selectedProduct.id}`);
        },
        onSuccess() {
            toast.success("Product deleted successfully");
            toggle("deleteProduct");
            router.refresh();
        },
        onError(error) {
            toast.error(error.message);
        },
    });

    const isDeleteConfirmed =
        confirmationText.toLowerCase() === "delete this product";

    useEffect(() => {
        if (!isOpen("deleteProduct")) {
            setConfirmationText("");
        }
    }, [isOpen("deleteProduct")]);

    return (
        <AlertDialog
            open={isOpen("deleteProduct")}
            onOpenChange={() => {
                toggle("deleteProduct");
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
                        delete this product.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-3">
                    <Label htmlFor="confirmation">
                        To confirm, type delete this product below:
                    </Label>
                    <Input
                        id="confirmation"
                        type="text"
                        placeholder="delete this product"
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

export default DeleteProductModal;
