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
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import { deleteMedia } from "@/app/actions/media";

const DeleteMediaModal = () => {
    const { isOpen, toggle, actionData: fileName } = useModal<string>();

    const handleDelete = async () => {
        const result = await deleteMedia(fileName);

        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <AlertDialog
            open={isOpen("deleteMedia")}
            onOpenChange={() => {
                toggle("deleteMedia");
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this file.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleDelete} variant="destructive">
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteMediaModal;
