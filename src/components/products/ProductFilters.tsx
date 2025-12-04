"use client";

import { useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category } from "@/generated/prisma";

interface ProductFiltersProps {
    allCategories: Category[];
}

export default function ProductFilters({ allCategories }: ProductFiltersProps) {
    const searchParams = useSearchParams();

    // Get current values from URL params or set defaults
    const currentCategory = searchParams.get("category") || "";
    const currentPriceRange = searchParams.get("priceRange") || "";

    const priceRanges = [
        { label: "جميع الأسعار", value: "all" },
        { label: "من 0 دج إلى 2500 دج", value: "0-2500" },
        { label: "من 2500 دج إلى 4000 دج", value: "2500-4000" },
        { label: "من 4000 دج إلى 7500 دج", value: "4000-7500" },
        { label: "من 7500 دج إلى 10000 دج", value: "7500-10000" },
        { label: "من 10000 دج فأكثر", value: "10000-max" },
    ];

    // Update search params when filters change
    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        history.pushState(null, "", `?${params.toString()}`);
    };

    return (
        <div className="flex max-md:flex-col gap-2 w-full">
            <div className="w-full">
                <Select
                    value={currentCategory}
                    onValueChange={(value) => updateFilters("category", value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">جميع التصنيفات</SelectItem>
                        {allCategories.map((category) => (
                            <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                            >
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* <div className="w-full">
                <Select
                    value={currentPriceRange}
                    onValueChange={(value) =>
                        updateFilters("priceRange", value)
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر نطاق السعر" />
                    </SelectTrigger>
                    <SelectContent>
                        {priceRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div> */}
        </div>
    );
}
