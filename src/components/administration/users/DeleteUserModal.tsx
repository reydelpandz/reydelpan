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
import { User } from "@/generated/prisma";
import axios, { isAxiosError } from "axios";

const DeleteUserModal = () => {
    const router = useRouter();
    const { isOpen, toggle, actionData: selectedUser } = useModal<User>();
    const [confirmationText, setConfirmationText] = useState("");

    const { isPending, mutate: handleDelete } = useMutation({
        mutationFn: async () => {
            if (!selectedUser) return;
            await axios.delete(`/api/users/${selectedUser.id}`);
        },
        onSuccess() {
            toast.success("User deleted successfully");
            toggle("deleteUser");
            router.refresh();
        },
        onError(error) {
            isAxiosError(error) && toast.error(error?.response?.data.message);
        },
    });

    const isDeleteConfirmed =
        confirmationText.toLowerCase() === "delete this user";

    useEffect(() => {
        if (!isOpen("deleteUser")) {
            setConfirmationText("");
        }
    }, [isOpen("deleteUser")]);

    return (
        <AlertDialog
            open={isOpen("deleteUser")}
            onOpenChange={() => {
                toggle("deleteUser");
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
                        delete this user.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-3">
                    <Label htmlFor="confirmation">
                        To confirm, type delete this user below:
                    </Label>
                    <Input
                        id="confirmation"
                        type="text"
                        placeholder="delete this user"
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

export default DeleteUserModal;
