"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useModal } from "@/hooks/use-modal";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { Category } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import ImageSelector from "./ImageSelector";
import type { MediaFile } from "@/lib/media";

const formSchema = z.object({
    label: z.string().min(1, "Category name is required"),
    priority: z.number().int(),
    image: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryModal = ({ mediaFiles }: { mediaFiles: MediaFile[] }) => {
    const {
        isOpen,
        toggle,
        actionData: selectedCategory,
    } = useModal<Category>();
    const router = useRouter();
    const isEditMode = selectedCategory !== null;

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
            priority: 0,
            image: undefined,
        },
    });

    const handleCreate = async (values: CategoryFormValues) => {
        try {
            const categoryData = {
                label: values.label,
                priority: values.priority,
                image: values.image,
            };
            await axios.post("/api/categories", categoryData);
            toggle("category");
            router.refresh();
            toast.success("Category created successfully");
        } catch (error) {
            isAxiosError(error) && toast.error(error.message);
        }
    };

    const handleUpdate = async (values: CategoryFormValues) => {
        try {
            if (!selectedCategory) return;

            await axios.put(`/api/categories/${selectedCategory.id}`, values);
            toggle("category");
            router.refresh();
            toast.success("Category updated successfully");
        } catch (error) {
            isAxiosError(error) && toast.error(error.message);
        }
    };

    useEffect(() => {
        if (isEditMode && selectedCategory) {
            form.setValue("label", selectedCategory.label);
            form.setValue("priority", selectedCategory.priority);
            form.setValue("image", selectedCategory.image);
        } else {
            form.reset({
                label: "",
                priority: 0,
                image: undefined,
            });
        }
    }, [isOpen("category"), isEditMode, selectedCategory]);

    return (
        <Sheet
            open={isOpen("category")}
            onOpenChange={() => {
                toggle("category", null);
            }}
        >
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>
                        {isEditMode ? "Edit Category" : "Create Category"}
                    </SheetTitle>
                </SheetHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(
                            isEditMode ? handleUpdate : handleCreate
                        )}
                        className="space-y-6 p-4"
                        noValidate
                    >
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Category name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <ImageSelector
                                        mediaFiles={mediaFiles}
                                        image={field.value}
                                        setImage={(newImage) =>
                                            form.setValue("image", newImage)
                                        }
                                    />

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            className="w-full"
                            isLoading={form.formState.isSubmitting}
                            type="submit"
                        >
                            {isEditMode ? "Update category" : "Create category"}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};

export default CategoryModal;
