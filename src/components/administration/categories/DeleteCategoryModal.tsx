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
import { Category } from "@/generated/prisma";
import axios, { isAxiosError } from "axios";

const DeleteCategoryModal = () => {
    const router = useRouter();
    const {
        isOpen,
        toggle,
        actionData: selectedCategory,
    } = useModal<Category>();
    const [confirmationText, setConfirmationText] = useState("");

    const { isPending, mutate: handleDelete } = useMutation({
        mutationFn: async () => {
            if (!selectedCategory) return;
            await axios.delete(`/api/categories/${selectedCategory.id}`);
        },
        onSuccess() {
            toast.success("Category deleted successfully");
            toggle("deleteCategory");
            router.refresh();
        },
        onError(error) {
            isAxiosError(error) && toast.error(error?.response?.data.message);
        },
    });

    const isDeleteConfirmed =
        confirmationText.toLowerCase() === "delete this category";

    useEffect(() => {
        if (!isOpen("deleteCategory")) {
            setConfirmationText("");
        }
    }, [isOpen("deleteCategory")]);

    return (
        <AlertDialog
            open={isOpen("deleteCategory")}
            onOpenChange={() => {
                toggle("deleteCategory");
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
                        delete this category.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-3">
                    <Label htmlFor="confirmation">
                        To confirm, type delete this category below:
                    </Label>
                    <Input
                        id="confirmation"
                        type="text"
                        placeholder="delete this category"
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

export default DeleteCategoryModal;
