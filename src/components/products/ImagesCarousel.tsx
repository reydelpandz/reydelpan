"use client";

import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Badge } from "../ui/badge";
import { Product } from "@/generated/prisma";
import { calcDiscountPercentage } from "@/lib/utils";
import { generatePackPreview } from "@/lib/utils/pack";

interface ImagesCarouselProps {
    product: Product;
}

const ImagesCarousel = ({ product }: ImagesCarouselProps) => {
    const { images, price, discountedPrice, name } = product;
    const hasDiscount = Number(product?.discountedPrice) > 0;
    const [packImage, setPackImage] = useState<string | null>(null);

    useEffect(() => {
        async function init() {
            if (product.isPack) {
                const pack = await generatePackPreview(product.images, {
                    bgColor: product.packPreviewImageBackground,
                });
                setPackImage(pack);
            }
        }

        init();
    }, []);

    const relevantImages =
        product.isPack && packImage ? [packImage, ...images] : images;

    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 2500,
                }),
            ]}
            opts={{ active: images.length > 1 }}
            dir="ltr"
            className="w-full max-w-[600px] rounded-lg"
        >
            <CarouselContent>
                {relevantImages.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="aspect-square relative rounded-lg overflow-hidden">
                            <img
                                src={image}
                                alt={`${name} - Image ${index + 1}`}
                                className="object-cover size-full"
                            />
                            {hasDiscount && (
                                <Badge
                                    variant="destructive"
                                    className="absolute top-2 right-2 sm:text-base"
                                >
                                    -
                                    {calcDiscountPercentage({
                                        price: price,
                                        discountedPrice: discountedPrice,
                                    })}
                                    %
                                </Badge>
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
};

export default ImagesCarousel;
