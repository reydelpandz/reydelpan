"use client";

import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "../ui/skeleton";
import { useRef } from "react";
import { Product } from "@/generated/prisma";
import ProductCard from "./ProductCard";
import { RiArrowLeftLongLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

interface props {
    title?: string;
    hideControls?: boolean;
    products: Product[];
    isLoading?: boolean;
    autoPlay?: boolean;
}

const ProductsCarousel = ({
    title,
    hideControls = false,
    products,
    isLoading = false,
    autoPlay,
}: props) => {
    const plugin = useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: true,
        })
    );

    // Get styles based on the length of the products array
    const getStyles = (length: number) => {
        switch (length) {
            case 1:
                return "basis-1/2 sm:basis-1/3";
            case 2:
                return "basis-1/2 sm:basis-1/3";
            case 3:
                return "basis-1/2 sm:basis-1/3";
            default:
                return "basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/4";
        }
    };

    const styles = getStyles(products.length);

    const Comp = title ? "section" : "div";

    return (
        <Comp className={cn(title && "py-8")}>
            {title && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {title}
                    </h2>
                    <div className="relative">
                        <Link
                            href="/products"
                            className="flex gap-2 items-center peer"
                        >
                            المتجر <RiArrowLeftLongLine className="size-5" />
                        </Link>
                        <div className="absolute h-[2px] w-[0.01px] peer-hover:w-full bg-primary mt-1 transition-all duration-500"></div>
                    </div>
                </div>
            )}

            <Carousel
                dir="ltr"
                plugins={autoPlay ? [plugin.current] : []}
                opts={
                    {
                        // align: "center",
                    }
                }
                className="w-full"
            >
                {!isLoading ? (
                    <CarouselContent>
                        {products.map((product) => (
                            <CarouselItem key={product.id} className={styles}>
                                <ProductCard product={product} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                ) : (
                    <CarouselContent>
                        {[...new Array(6)].map((_, idx) => (
                            <CarouselItem
                                dir="rtl"
                                key={idx}
                                className="basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                            >
                                <div className="flex flex-col gap-1.5">
                                    <Skeleton className="aspect-1 rounded-md mb-1" />
                                    <Skeleton className="rounded-sm w-4/5 h-5" />
                                    <Skeleton className="rounded-sm w-2/5 h-5" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                )}
                {!hideControls && !isLoading && (
                    <div className="pt-8 px-1 flex justify-between">
                        <CarouselPrevious className="static" />
                        <CarouselNext className="static" />
                    </div>
                )}
            </Carousel>
        </Comp>
    );
};

export default ProductsCarousel;
