"use client";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { RiShoppingCart2Line } from "@remixicon/react";

export default function CheckoutSummary() {
    const {
        cartItems,
        itemsCount,
        subTotal,
        total,
        updateItemQuantity,
        removeItem,
        shippingFee,
    } = useCart();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiShoppingCart2Line className="h-5 w-5" />
                    <span>سلة التسوق</span>
                </CardTitle>
                <CardDescription>
                    {itemsCount} {itemsCount === 1 ? "منتج" : "منتجات"} في سلة
                    التسوق
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-5">
                    {cartItems.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-start space-x-4"
                        >
                            <div className="h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
                                <img
                                    src={
                                        product.images[0] || "/placeholder.svg"
                                    }
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-medium">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {formatPrice(product.finalPrice)}
                                </p>
                                <div className="flex items-center mt-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            updateItemQuantity(product, -1)
                                        }
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="mx-3 w-8 text-center">
                                        {product.quantityInCart}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            updateItemQuantity(product, 1)
                                        }
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">
                                    {formatPrice(
                                        product.finalPrice *
                                            product.quantityInCart
                                    )}
                                </p>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 mt-2"
                                    onClick={() => removeItem(product.id)}
                                >
                                    <Trash2 className="h-4 w-4 " />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col">
                <div className="w-full space-y-2">
                    <div className="flex justify-between">
                        <span>المجموع الجزئي</span>
                        <span>{formatPrice(subTotal)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>تكلفة الشحن</span>
                        <span>
                            {shippingFee !== null
                                ? formatPrice(shippingFee)
                                : "(إختر المكان أولا)"}
                        </span>
                    </div>

                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                        <span>المجموع الكلي</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
