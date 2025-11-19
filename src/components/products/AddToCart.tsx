"use client";

import { useCart } from "@/hooks/use-cart";
import QuantitySelector from "./QuantitySelector";
import { Button } from "../ui/button";

import { RiShoppingCart2Line } from "@remixicon/react";
import { Product } from "@/generated/prisma";
import { cn } from "@/lib/utils";

const AddToCart = ({ product }: { product: Product }) => {
    const { inCart, addItem, removeItem } = useCart();
    const isProductInCart = inCart(product.id);
    return (
        <div className="mt-2 space-y-4">
            <div className="flex items-center gap-4">
                {isProductInCart && (
                    <div className="w-1/3">
                        <QuantitySelector product={product} />
                    </div>
                )}
                <div className={cn(isProductInCart ? "w-2/3" : "w-full")}>
                    <Button
                        variant={inCart(product.id) ? "destructive" : "default"}
                        className="w-full"
                        onClick={() => {
                            if (isProductInCart) {
                                removeItem(product.id);
                            } else {
                                addItem(product);
                            }
                        }}
                    >
                        <RiShoppingCart2Line className="mr-2 h-5 w-5" />
                        {inCart(product.id)
                            ? "إزالة من السلة"
                            : "أضف إلى السلة"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddToCart;
