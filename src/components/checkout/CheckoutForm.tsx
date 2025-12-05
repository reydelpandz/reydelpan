"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { wilayas } from "@/data/wilayas";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { RiTruckLine } from "@remixicon/react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { formatPrice } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { stopDesks } from "@/data/stop-desks";

const formSchema = z.object({
    fullName: z.string().min(3, {
        message: "الاسم الكامل يجب أن يحتوي على الأقل على 3 أحرف.",
    }),

    phoneNumber: z.string().min(10, {
        message: "رقم الهاتف يجب أن يحتوي على الأقل على 10 أرقام.",
    }),
    // address: z.string().min(5, {
    //     message: "العنوان يجب أن يحتوي على الأقل على 5 أحرف.",
    // }),
    wilaya: z.string({}),
    commune: z.string({}).optional(),
    deliveryMethod: z.enum(["home", "stop-desk"]),
    note: z.string().max(300).optional(),
});

export type CheckoutFormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
    showThankYou: () => void;
}

export default function CheckoutForm({ showThankYou }: CheckoutFormProps) {
    const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
    const [communes, setCommunes] = useState<string[]>([]);
    const { cartItems, emptyCart, setShippingFee, shippingFee, isEmpty } =
        useCart();
    const [isDeliverableToStopDesk, setIsDeliverableToStopDesk] =
        useState(true);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            // address: "",
            wilaya: "",
            commune: "",
            deliveryMethod: "home",
            note: "",
        },
    });

    const wilaya = form.watch("wilaya");
    const commune = form.watch("commune");
    const deliveryMethod = form.watch("deliveryMethod");

    useEffect(() => {
        if (wilaya) {
            const selectedWilayaData = wilayas.find((w) => w.name === wilaya);
            if (selectedWilayaData) {
                setSelectedWilaya(wilaya);
                setCommunes(selectedWilayaData.communes);
                setIsDeliverableToStopDesk(
                    // selectedWilayaData.deliveryFees["stop-desk"] > 0
                    stopDesks.some((sd) => sd.wilayaName === wilaya)
                );
                form.setValue("commune", "");
                setShippingFee(null);
            }
        }
    }, [wilaya]);

    useEffect(() => {
        const condition =
            deliveryMethod === "stop-desk" ? wilaya : wilaya && commune;
        if (condition) {
            const selectedWilayaData = wilayas.find((w) => w.name === wilaya);
            if (selectedWilayaData) {
                setShippingFee(selectedWilayaData.deliveryFees[deliveryMethod]);
            }
        }
    }, [wilaya, commune, deliveryMethod]);

    // Form submission handler
    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            const orderData = {
                customerAddress: "لم يتم ذكر العنوان",
                customerFullName: values.fullName,
                customerPhone: values.phoneNumber,
                customerWilaya: values.wilaya,
                customerCommune:
                    deliveryMethod === "home"
                        ? values.commune
                        : "لم يتم ذكر البلدية",
                deliveryMethod: values.deliveryMethod,
                deliveryCost: shippingFee,
                products: cartItems.map((product) => ({
                    id: product.id,
                    quantityInCart: product.quantityInCart,
                })),
                note: values.note,
            };

            await axios.post("/api/checkout", orderData);
            emptyCart();
            showThankYou();
            window.scrollTo({
                top: 0,
                left: 0,
            });
        } catch (error) {
            isAxiosError(error) && toast.error(error.response?.data.message);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiTruckLine className="size-6" />
                    <span>معلومات التوصيل</span>
                </CardTitle>
                <CardDescription>
                    أدخل معلوماتك الشخصية لإكمال الطلب
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        الاسم الكامل
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="الاسم الكامل"
                                            {...field}
                                            className="h-10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        رقم الهاتف
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="0XXXXXXXXX"
                                            {...field}
                                            className="h-10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="wilaya"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        الولاية
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="اختر الولاية" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {wilayas.map((wilaya) => (
                                                <SelectItem
                                                    key={wilaya.code}
                                                    value={wilaya.name}
                                                >
                                                    {wilaya.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {deliveryMethod === "home" && (
                            <FormField
                                control={form.control}
                                name="commune"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="required">
                                            البلدية
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!selectedWilaya}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="اختر البلدية" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {communes.map((commune) => (
                                                    <SelectItem
                                                        key={commune}
                                                        value={commune}
                                                    >
                                                        {commune}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="deliveryMethod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="required">
                                        طريقة التوصيل
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col"
                                        >
                                            {[
                                                {
                                                    label: "التوصيل للمنزل",
                                                    value: "home",
                                                    isEnabled: true,
                                                },
                                                {
                                                    label: "التوصيل للمكتب ",
                                                    value: "stop-desk",
                                                    isEnabled:
                                                        isDeliverableToStopDesk,
                                                },
                                            ]
                                                .filter((m) => m.isEnabled)
                                                .map((method) => (
                                                    <FormItem
                                                        className="flex items-center gap-3"
                                                        key={method.value}
                                                    >
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value={
                                                                    method.value
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {method.label}{" "}
                                                            {!!shippingFee &&
                                                                deliveryMethod ===
                                                                    method.value && (
                                                                    <span>
                                                                        (
                                                                        {formatPrice(
                                                                            shippingFee
                                                                        )}
                                                                        )
                                                                    </span>
                                                                )}
                                                        </FormLabel>
                                                    </FormItem>
                                                ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {!isDeliverableToStopDesk && (
                            <Alert>
                                <AlertDescription>
                                    التوصيل لمكتب البريد غير متوفر لولايتك.
                                </AlertDescription>
                            </Alert>
                        )}

                        {deliveryMethod === "stop-desk" && wilaya && (
                            <Alert>
                                <AlertTitle>مكاتب التوصيل</AlertTitle>
                                <AlertDescription>
                                    <ul
                                        className="flex flex-col gap-1.5 list-inside list-disc"
                                        dir="ltr"
                                    >
                                        {stopDesks
                                            .find(
                                                (sd) => sd.wilayaName === wilaya
                                            )
                                            ?.addresses.map((address) => (
                                                <li>{address}</li>
                                            ))}
                                    </ul>
                                    <p className="text-destructive text-sm">
                                        يرجى التأكد من أن مكتب التوصيل قريب بما
                                        يكفي منك.
                                    </p>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Alert variant="destructive">
                            <AlertTitle>تنبيه</AlertTitle>
                            <AlertDescription>
                                إذا تجاوز وزن الطلبية 5 كغ، يتم احتساب 50 دج
                                إضافية عن كل كيلوغرام زائد، وهذا من طرف شركة
                                التوصيل.
                            </AlertDescription>
                        </Alert>

                        <Button
                            disabled={isEmpty}
                            isLoading={form.formState.isSubmitting}
                            type="submit"
                            className="w-full mt-4"
                        >
                            تأكيد الطلب
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
