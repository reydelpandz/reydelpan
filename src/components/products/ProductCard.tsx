"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { calcDiscountPercentage, formatPrice } from "@/lib/utils";

import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import type { Product } from "@/generated/prisma";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { generatePackPreview } from "@/lib/utils/pack";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { inCart, addItem, removeItem } = useCart();
    const hasDiscount = Number(product.discountedPrice) > 0;
    const [packImage, setPackImage] = useState<string | null>(null);

    useEffect(() => {
        async function init() {
            if (product.isPack) {
                const pack = await generatePackPreview(product.images, {
                    bgColor: product.packPreviewImageBackground,
                    size: 500,
                });
                setPackImage(pack);
            }
        }

        init();
    }, []);

    const relevantImage =
        product.isPack && packImage ? packImage : product.images[0];

    return (
        <Link href={`/products/${product.slug}`}>
            <Card className="h-full pt-0 overflow-hidden transition-all shadow-none hover:shadow-md">
                <div className="relative ">
                    <img
                        loading="lazy"
                        src={relevantImage || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover aspect-square size-full"
                    />
                    {hasDiscount && (
                        <Badge
                            variant="destructive"
                            className="absolute top-2 right-2"
                        >
                            {calcDiscountPercentage({
                                price: product.price,
                                discountedPrice: product.discountedPrice,
                            })}
                            %-
                        </Badge>
                    )}
                </div>
                <CardContent className="px-1.5 text-right sm:px-4 sm:pt-3">
                    <h3 className="font-semibold line-clamp-1 text-center text-sm leading-tight sm:text-sm md:text-base lg:text-lg">
                        {product.name}
                    </h3>

                    <p className="text-xs text-muted-foreground text-right line-clamp-2 mt-1 leading-tight sm:text-sm sm:mt-2">
                        {product.shortDescription}
                    </p>
                </CardContent>
                <CardFooter className="p-2 pb-0 pt-0 flex flex-col gap-2 sm:p-4 sm:pt-0 mt-auto">
                    <div className="text-center">
                        {hasDiscount ? (
                            <div className="flex flex-col items-end gap-0 min-w-fit sm:items-center sm:gap-1.5">
                                <span className="font-semibold text-xs whitespace-nowrap sm:text-sm md:text-base">
                                    {formatPrice(product.discountedPrice!)}
                                </span>
                                {product.discountedPrice! < product.price && (
                                    <span className="text-xs font-medium text-destructive line-through whitespace-nowrap sm:text-sm">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="font-semibold text-xs whitespace-nowrap min-w-fit sm:text-sm md:text-base">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    <Button
                        variant={inCart(product.id) ? "destructive" : "default"}
                        className="w-full h-8 text-[10px] px-2 sm:h-9 sm:text-xs md:h-10 md:text-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (inCart(product.id)) {
                                removeItem(product.id);
                            } else {
                                addItem(product);
                            }
                        }}
                    >
                        {inCart(product.id)
                            ? "إزالة من السلة"
                            : "أضف إلى السلة"}
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}
