import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat("ar-DZ", {
        style: "currency",
        currency: "DZD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export const slugify = (str: string) => {
    return (
        String(str)
            .normalize("NFKD") // split accented characters into their base characters and diacritical marks
            .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
            .trim() // trim leading or trailing whitespace
            .toLowerCase() // convert to lowercase
            // .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
            .replace(/[^a-z0-9\u0600-\u06FF -]/g, "") // same as line before but keeps arabic chars
            .replace(/\s+/g, "-") // replace spaces with hyphens
            .replace(/-+/g, "-")
    ); // remove consecutive hyphens
};

export function calcDiscountPercentage({
    price,
    discountedPrice,
}: {
    price: number;
    discountedPrice: number;
}) {
    const salePercentage =
        discountedPrice > 0 ? ((price - discountedPrice) / price) * 100 : null;

    return salePercentage != null
        ? Math.round(salePercentage * 100) / 100
        : null; // Round to 2 decimal places
}
