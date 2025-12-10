"use client";

import { useState } from "react";
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
import { RiAlertLine, RiImageLine, RiFolderLine } from "@remixicon/react";

interface DeleteResult {
    success: boolean;
    message?: string;
    error?: string;
    inUse?: boolean;
    products?: string[];
    categories?: string[];
}

const DeleteMediaModal = () => {
    const { isOpen, toggle, actionData: fileName } = useModal<string>();
    const [isDeleting, setIsDeleting] = useState(false);
    const [usageInfo, setUsageInfo] = useState<{
        products: string[];
        categories: string[];
    } | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = (await deleteMedia(fileName)) as DeleteResult;
        setIsDeleting(false);

        if (result.success) {
            toast.success(result.message);
            setUsageInfo(null);
            toggle("deleteMedia");
            location.reload();
        } else if (result.inUse) {
            setUsageInfo({
                products: result.products || [],
                categories: result.categories || [],
            });
        } else {
            toast.error(result.error);
        }
    };

    const handleClose = () => {
        setUsageInfo(null);
        toggle("deleteMedia");
    };

    return (
        <AlertDialog open={isOpen("deleteMedia")} onOpenChange={handleClose}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    {usageInfo ? (
                        <>
                            <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                <RiAlertLine className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            </div>
                            <AlertDialogTitle className="text-center">
                                Cannot Delete Media
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                                This file is currently being used and cannot be
                                deleted.
                            </AlertDialogDescription>
                        </>
                    ) : (
                        <>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this file.
                            </AlertDialogDescription>
                        </>
                    )}
                </AlertDialogHeader>

                {usageInfo && (
                    <div className="space-y-3 my-2">
                        {usageInfo.products.length > 0 && (
                            <div className="bg-muted rounded-lg p-3">
                                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                    <RiImageLine className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        Used by {usageInfo.products.length}{" "}
                                        product
                                        {usageInfo.products.length > 1
                                            ? "s"
                                            : ""}
                                    </span>
                                </div>
                                <ul className="space-y-1 list-disc list-inside">
                                    {usageInfo.products.map((name, i) => (
                                        <li key={i} className=" pl-6">
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {usageInfo.categories.length > 0 && (
                            <div className="bg-muted rounded-lg p-3">
                                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                    <RiFolderLine className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        Used by {usageInfo.categories.length}{" "}
                                        categor
                                        {usageInfo.categories.length > 1
                                            ? "ies"
                                            : "y"}
                                    </span>
                                </div>
                                <ul className="space-y-1 list-disc list-inside">
                                    {usageInfo.categories.map((name, i) => (
                                        <li key={i} className="pl-6">
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <AlertDialogFooter>
                    {usageInfo ? (
                        <Button onClick={handleClose}>Got it</Button>
                    ) : (
                        <>
                            <AlertDialogCancel disabled={isDeleting}>
                                Cancel
                            </AlertDialogCancel>
                            <Button
                                onClick={handleDelete}
                                variant="destructive"
                                isLoading={isDeleting}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteMediaModal;
