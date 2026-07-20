"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import QuantitySelector from "./QuantitySelector";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

import { RiShoppingCart2Line } from "@remixicon/react";
import { cn, formatPrice } from "@/lib/utils";
import type { ProductWithChoices } from "@/lib/types";

const AddToCart = ({ product }: { product: ProductWithChoices }) => {
    const { inCart, addItem, removeItem, cartItems } = useCart();
    const isProductInCart = inCart(product.id);

    const hasOptions =
        !!product.optionName && product.optionChoices.length > 0;

    const itemInCart = cartItems.find((item) => item.id === product.id);

    const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(
        itemInCart?.optionChoiceId ??
            (hasOptions ? product.optionChoices[0].id : null)
    );

    const selectedChoice = hasOptions
        ? product.optionChoices.find(
              (choice) => choice.id === selectedChoiceId
          ) ?? product.optionChoices[0]
        : null;

    return (
        <div className="mt-2 space-y-4">
            {hasOptions && (
                <div className="space-y-3">
                    <p className="font-semibold">{product.optionName}:</p>
                    <RadioGroup
                        value={String(selectedChoice!.id)}
                        onValueChange={(value) =>
                            setSelectedChoiceId(Number(value))
                        }
                        disabled={isProductInCart}
                        className="flex flex-wrap gap-2"
                    >
                        {product.optionChoices.map((choice) => (
                            <Label
                                key={choice.id}
                                className={cn(
                                    "flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2.5",
                                    selectedChoice!.id === choice.id &&
                                        "border-primary bg-primary/5"
                                )}
                            >
                                <RadioGroupItem value={String(choice.id)} />
                                <span>{choice.label}</span>
                                <span className="text-sm text-muted-foreground">
                                    ({formatPrice(choice.price)})
                                </span>
                            </Label>
                        ))}
                    </RadioGroup>
                    <p className="text-xl font-bold text-primary">
                        {formatPrice(
                            itemInCart?.finalPrice ?? selectedChoice!.price
                        )}
                    </p>
                </div>
            )}
            <div className="flex items-center gap-4">
                {isProductInCart && (
                    <div className="w-1/3">
                        <QuantitySelector product={product} />
                    </div>
                )}
                <div className={cn(isProductInCart ? "w-2/3" : "w-full")}>
                    <Button
                        variant={isProductInCart ? "destructive" : "default"}
                        className="w-full"
                        onClick={() => {
                            if (isProductInCart) {
                                removeItem(product.id);
                            } else {
                                addItem(
                                    product,
                                    selectedChoice
                                        ? {
                                              id: selectedChoice.id,
                                              label: selectedChoice.label,
                                              price: selectedChoice.price,
                                          }
                                        : undefined
                                );
                            }
                        }}
                    >
                        <RiShoppingCart2Line className="mr-2 h-5 w-5" />
                        {isProductInCart ? "إزالة من السلة" : "أضف إلى السلة"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddToCart;
