import { Button } from "@/components/ui/button";
import { Product } from "@/generated/prisma";
import { useCart } from "@/hooks/use-cart";
import { RiAddFill, RiSubtractFill } from "@remixicon/react";

export default function QuantitySelector({ product }: { product: Product }) {
    const { getItemQuantity, updateItemQuantity } = useCart();

    return (
        <div className="flex items-center h-11 rounded-md border border-input">
            <Button
                onClick={() => updateItemQuantity(product, 1)}
                variant="ghost"
                size="icon"
                className="h-full rounded-none rounded-r-md border-l border-input"
                aria-label="Increase quantity"
            >
                <RiAddFill className="h-4 w-4" />
            </Button>
            <div className="h-full border-0 rounded-none text-center w-full flex items-center justify-center bg-white">
                {getItemQuantity(product.id)}
            </div>
            <Button
                onClick={() => updateItemQuantity(product, -1)}
                variant="ghost"
                size="icon"
                className="h-full rounded-none rounded-l-md border-r border-input"
                aria-label="Decrease quantity"
            >
                <RiSubtractFill className="h-4 w-4" />
            </Button>
        </div>
    );
}
