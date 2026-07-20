"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Plus, Trash2 } from "lucide-react";
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
    name: z.string().min(1, "الاسم مطلوب"),
    shortDescription: z.string().min(1, "الوصف القصير مطلوب"),
    longDescription: z.string().min(1, "الوصف الطويل مطلوب"),
    price: z.coerce.number().nonnegative("يجب أن يكون السعر رقمًا موجبًا"),
    discountedPrice: z.coerce
        .number()
        .nonnegative("يجب أن يكون السعر بعد التخفيض رقمًا موجبًا")
        .optional(),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative("يجب أن تكون الكمية عددًا صحيحًا موجبًا"),
    images: z.array(z.string()).min(1, "مطلوب صورة واحدة على الأقل"),
    categories: z.array(z.string()),
    isHidden: z.boolean(),
    isFeatured: z.boolean(),
    isPack: z.boolean(),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    packPreviewImageBackground: z.string().optional(),
    optionName: z.string().optional(),
    optionChoices: z.array(
        z.object({
            label: z.string().min(1, "التسمية مطلوبة"),
            price: z.coerce.number().positive("يجب أن يكون السعر رقمًا موجبًا"),
        })
    ),
}).superRefine((data, ctx) => {
    if (data.optionName?.trim() && data.optionChoices.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["optionName"],
            message: "أضف خيارًا واحدًا على الأقل، أو امسح اسم الخيار",
        });
    }
    if (!data.optionName?.trim() && data.optionChoices.length > 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["optionName"],
            message: "اسم الخيار مطلوب عند وجود خيارات",
        });
    }
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
            optionName: "",
            optionChoices: [],
        },
    });

    const {
        fields: choiceFields,
        append: appendChoice,
        remove: removeChoice,
    } = useFieldArray({
        control: form.control,
        name: "optionChoices",
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
                optionName: values.optionName?.trim() || null,
                optionChoices: values.optionChoices,
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
                optionName: values.optionName?.trim() || null,
                optionChoices: values.optionChoices,
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
            form.setValue("optionName", selectedProduct.optionName ?? "");
            form.setValue(
                "optionChoices",
                selectedProduct.optionChoices.map((choice) => ({
                    label: choice.label,
                    price: choice.price,
                }))
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
                optionName: "",
                optionChoices: [],
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
                    <SheetTitle dir="rtl">
                        {isEditMode ? "تعديل المنتج" : "إضافة منتج"}
                    </SheetTitle>
                </SheetHeader>

                <Form {...form}>
                    <form
                        dir="rtl"
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
                                    <FormLabel>الاسم</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="اسم المنتج"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        سيكون هذا المنتج متاحًا على:{" "}
                                        <span
                                            className="font-semibold"
                                            dir="ltr"
                                        >
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
                                        <FormLabel>السعر</FormLabel>
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
                                        <FormLabel>السعر بعد التخفيض</FormLabel>
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
                                    <FormLabel>الكمية</FormLabel>
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

                        <div className="space-y-3 rounded-md border p-3">
                            <FormField
                                control={form.control}
                                name="optionName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            خيار المنتج (اختياري)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="مثال: الوزن"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            يجب على العميل اختيار واحد من
                                            الخيارات. لكل خيار سعره الكامل الخاص
                                            (يحل محل سعر المنتج).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {choiceFields.map((choiceField, index) => (
                                <div
                                    className="flex items-start gap-2"
                                    key={choiceField.id}
                                >
                                    <FormField
                                        control={form.control}
                                        name={`optionChoices.${index}.label`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="مثال: 1 كغ"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`optionChoices.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem className="w-28">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="السعر"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeChoice(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    appendChoice({ label: "", price: 0 })
                                }
                            >
                                <Plus className="me-1 h-4 w-4" />
                                إضافة خيار
                            </Button>
                        </div>

                        <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الفئات</FormLabel>

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
                                            placeholder="اختر الفئات..."
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
                                    <FormLabel>وصف قصير</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="وصف مختصر"
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
                                    <FormLabel>الصور</FormLabel>
                                    <ImageSelector
                                        mediaFiles={mediaFiles}
                                        images={field.value ?? []}
                                        setImages={(newImages) =>
                                            form.setValue("images", newImages)
                                        }
                                    />
                                    <FormDescription>
                                        ستُستخدم أول صورة تختارها كصورة للمعاينة
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
                                    <FormItem className="flex flex-row items-start gap-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            منتج مميّز
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isHidden"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start gap-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            إخفاء المنتج
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isPack"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start gap-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            تعيين كباقة
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
                                    alt="صورة معاينة الباقة"
                                />
                                <FormField
                                    control={form.control}
                                    name="packPreviewImageBackground"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start gap-3 space-y-0">
                                            <FormControl>
                                                <Input
                                                    type="color"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                لون خلفية صورة معاينة الباقة
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
                            {isEditMode ? "تحديث المنتج" : "إضافة المنتج"}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};

export default ProductModal;
