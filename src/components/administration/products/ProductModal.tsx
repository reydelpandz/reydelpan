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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import TextEditor from "./TextEditor";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { Category } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { ProductWithCategories } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { generatePackPreview } from "@/lib/utils/pack";
import { slugify } from "@/lib/utils";
import type { MediaFile } from "@/lib/media";
import ImageSelector from "./ImageSelector";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    shortDescription: z.string().min(1, "Short description is required"),
    longDescription: z.string().min(1, "Long description is required"),
    price: z.coerce.number().nonnegative("Price must be positive"),
    discountedPrice: z.coerce
        .number()
        .nonnegative("Discounted price must be positive")
        .optional(),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative("Quantity must be a positive integer"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    categories: z.array(z.string()),
    isHidden: z.boolean(),
    isFeatured: z.boolean(),
    isPack: z.boolean(),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    packPreviewImageBackground: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductModal = ({
    allCategories,
    mediaFiles,
}: {
    allCategories: Category[];
    mediaFiles: MediaFile[];
}) => {
    const {
        isOpen,
        toggle,
        actionData: selectedProduct,
    } = useModal<ProductWithCategories | null>();

    const router = useRouter();
    const isEditMode = selectedProduct !== null;

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            shortDescription: "",
            longDescription: "",
            price: 0,
            discountedPrice: 0,
            quantity: 1,
            categories: [],
            images: [],
            colors: [],
            sizes: [],
            isHidden: false,
            isFeatured: false,
            isPack: false,
            packPreviewImageBackground: "#d6e4f0",
        },
    });

    const name = form.watch("name");
    const longDescription = form.watch("longDescription");
    const isPack = form.watch("isPack");
    const images = form.watch("images");
    const packPreviewImageBackgroundColor = form.watch(
        "packPreviewImageBackground"
    );
    const slug = isEditMode ? selectedProduct.slug : slugify(name);

    const [packImage, setPackImage] = useState<string | null>(null);

    const handleCreate = async (values: ProductFormValues) => {
        try {
            const productData = {
                name: values.name,
                shortDescription: values.shortDescription,
                longDescription: values.longDescription,
                price: values.price,
                discountedPrice: values.discountedPrice,
                categories: values.categories.map((id) => ({
                    categoryId: Number(id),
                })),
                quantity: values.quantity,
                images: values.images,
                colors: values.colors,
                sizes: values.sizes,
                isHidden: values.isHidden,
                isFeatured: values.isFeatured,
                isPack: values.isPack,
            };
            await axios.post("/api/products", productData);
            toggle("product");
            router.refresh();
        } catch (error) {
            isAxiosError(error) && toast.error(error.message);
        }
    };

    const handleUpdate = async (values: ProductFormValues) => {
        try {
            const productData = {
                name: values.name,
                shortDescription: values.shortDescription,
                longDescription: values.longDescription,
                price: values.price,
                discountedPrice: values.discountedPrice,
                categories: values.categories.map((id) => ({
                    categoryId: Number(id),
                })),
                quantity: values.quantity,
                images: values.images,
                colors: values.colors,
                sizes: values.sizes,
                isHidden: values.isHidden,
                isFeatured: values.isFeatured,
                isPack: values.isPack,
                packPreviewImageBackground: values.packPreviewImageBackground,
            };
            await axios.put(
                `/api/products/${selectedProduct!.id}`,
                productData
            );
            toggle("product");
            router.refresh();
        } catch (error) {
            isAxiosError(error) && toast.error(error.message);
        }
    };

    useEffect(() => {
        if (isEditMode && selectedProduct) {
            form.setValue("name", selectedProduct.name);
            form.setValue("price", selectedProduct.price);
            form.setValue(
                "discountedPrice",
                selectedProduct.discountedPrice ?? 0
            );
            form.setValue(
                "categories",
                selectedProduct.categories.map((category) =>
                    category.categoryId.toString()
                )
            );

            form.setValue("quantity", selectedProduct.quantity);
            form.setValue("shortDescription", selectedProduct.shortDescription);
            form.setValue("longDescription", selectedProduct.longDescription);
            form.setValue("images", selectedProduct.images);
            form.setValue("colors", selectedProduct.colors);
            form.setValue("sizes", selectedProduct.sizes);
            form.setValue("isHidden", selectedProduct.isHidden);
            form.setValue("isFeatured", selectedProduct.isFeatured);
            form.setValue("isPack", selectedProduct.isPack);
            form.setValue(
                "packPreviewImageBackground",
                selectedProduct.packPreviewImageBackground
            );
        } else {
            form.reset({
                name: "",
                shortDescription: "",
                longDescription: "",
                price: 0,
                discountedPrice: 0,
                quantity: 1,
                images: [],
                categories: [],
                colors: [],
                sizes: [],
                isHidden: false,
                isFeatured: false,
                isPack: false,
                packPreviewImageBackground: "#d6e4f0",
            });
        }
    }, [isOpen("product"), isEditMode, selectedProduct]);

    useEffect(() => {
        if (isPack && images.length >= 2) {
            generatePackPreview(images, {
                bgColor: packPreviewImageBackgroundColor,
                size: 500,
            }).then((pack) => setPackImage(pack));
        }
    }, [images.length, isPack, packPreviewImageBackgroundColor]);

    useEffect(() => {
        if (isPack) {
            form.setValue(
                "longDescription",
                "تضم هذه المجموعة المنتجات التالية:"
            );
        }
    }, [isPack]);

    return (
        <Sheet
            open={isOpen("product")}
            onOpenChange={() => {
                toggle("product", null);
            }}
        >
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>
                        {isEditMode ? "Edit Product" : "Create Product"}
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Product name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This product will be available at:{" "}
                                        <span className="font-semibold">
                                            {window.location.origin}/products/
                                            {slug}
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discountedPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discounted Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categories</FormLabel>

                                    <FormControl>
                                        <MultiSelect
                                            options={allCategories.map(
                                                (category) => ({
                                                    value: category.id.toString(),
                                                    label: category.label,
                                                })
                                            )}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            defaultValue={selectedProduct?.categories.map(
                                                (category) =>
                                                    category.categoryId.toString()
                                            )}
                                            placeholder="Choose categories..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="shortDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Brief description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <TextEditor
                            text={longDescription}
                            onChange={(text) =>
                                form.setValue("longDescription", text)
                            }
                        />

                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <ImageSelector
                                        mediaFiles={mediaFiles}
                                        images={field.value ?? []}
                                        setImages={(newImages) =>
                                            form.setValue("images", newImages)
                                        }
                                    />
                                    <FormDescription>
                                        The first image you select will be used
                                        as the preview
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Mark as Featured
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isHidden"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Mark as Hidden
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isPack"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Mark as Pack
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {isPack && packImage && (
                            <div className="space-y-4">
                                <img
                                    src={packImage}
                                    className="rounded-md w-full"
                                    alt="Pack Preview Image"
                                />
                                <FormField
                                    control={form.control}
                                    name="packPreviewImageBackground"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Input
                                                    type="color"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Pack Preview Image Background
                                                Color
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <Button
                            className="w-full"
                            isLoading={form.formState.isSubmitting}
                            type="submit"
                        >
                            {isEditMode ? "Update product" : "Create product"}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};

export default ProductModal;
