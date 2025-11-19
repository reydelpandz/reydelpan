"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import ProductCard from "./ProductCard";
import { Product } from "@/generated/prisma";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { ProductWithCategories } from "@/lib/types";

interface ProductsListProps {
    products: ProductWithCategories[];
}

const ProductsList = ({ products }: ProductsListProps) => {
    const [animationParent] = useAutoAnimate();
    const searchParams = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);

    // Intersection observer for lazy loading
    const { ref, isIntersecting } = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: "150px",
    });

    // Filter products based on URL parameters
    useEffect(() => {
        const category = searchParams.get("category");
        const priceRange = searchParams.get("priceRange");

        let filtered = [...products];

        // Apply category filter
        if (category && category !== "all") {
            const categoryId = Number(category);
            filtered = filtered.filter((product) =>
                product.categories.some((cat) => cat.categoryId === categoryId)
            );
        }

        // Apply price range filter
        if (priceRange && priceRange !== "all") {
            const [min, max] = priceRange.split("-");
            const minPrice = Number(min);
            const maxPrice = max === "max" ? Infinity : Number(max);

            filtered = filtered.filter((product) => {
                const effectivePrice =
                    product.discountedPrice > 0
                        ? product.discountedPrice
                        : product.price;
                return effectivePrice >= minPrice && effectivePrice <= maxPrice;
            });
        }

        setFilteredProducts(filtered);
        // Reset visible products when filters change
        setVisibleProducts(filtered.slice(0, 8));
    }, [searchParams, products]);

    // Load more products when scrolling
    useEffect(() => {
        if (
            isIntersecting &&
            visibleProducts.length < filteredProducts.length
        ) {
            const nextBatch = filteredProducts.slice(
                visibleProducts.length,
                visibleProducts.length + 8
            );
            setVisibleProducts((prev) => [...prev, ...nextBatch]);
        }
    }, [isIntersecting, filteredProducts, visibleProducts]);

    if (filteredProducts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">
                    لم نعثر على منتجات تطابق بحثك
                </p>
            </div>
        );
    }

    return (
        <>
            <ul
                ref={animationParent}
                className="grid grid-cols-1 min-[310px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-4"
            >
                {visibleProducts.map((product) => (
                    <li key={product.id}>
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>
            {/* Intersection observer target */}
            {visibleProducts.length < filteredProducts.length && (
                <div ref={ref} className="h-10 w-full my-4" />
            )}
        </>
    );
};

export default ProductsList;
