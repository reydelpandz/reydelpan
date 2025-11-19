"use client";

import { useState, createContext, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import { usePathname } from "next/navigation";
import axios, { isAxiosError } from "axios";
import { Product } from "@/generated/prisma";
import { toast } from "sonner";

type CartContext = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    cartItems: CartItem[];
    getItemQuantity: (itemID: Product["id"]) => number;
    addItem: (item: Product, selectedValues?: Record<string, string>) => void;
    removeItem: (itemID: Product["id"]) => void;
    emptyCart: () => void;
    isEmpty: boolean;
    itemsCount: number;
    inCart: (itemID: Product["id"]) => boolean;
    signalCart: boolean;
    updateItemQuantity: (item: Product, by: 1 | -1) => void;
    subTotal: number;
    total: number;
    shippingFee: number | null;
    setShippingFee: React.Dispatch<React.SetStateAction<number | null>>;
};

export type CartItem = Product & {
    quantityInCart: number;
    finalPrice: number;
    selectedValues: Record<string, string>;
};

export const CartContext = createContext<CartContext>({} as CartContext);

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    // Cart modal
    const [showCart, setShowCart] = useState(false);
    const [shippingFee, setShippingFee] = useState<number | null>(null);
    const [signalCart, setSignalCart] = useState(false);

    const close = () => setShowCart(false);
    const open = () => setShowCart(true);
    const toggle = () => setShowCart((prev) => !prev);

    useEffect(close, [pathname]);

    const [cartItems, setCartItems] = useLocalStorageState("khottwah-cart", {
        defaultValue: [] as CartItem[],
    });

    const inCart = (itemID: Product["id"]) => {
        return cartItems.findIndex((item) => item.id === itemID) !== -1;
    };

    const getItemQuantity = (itemID: Product["id"]) => {
        // To be used when you can't access the quantityInCart prop
        return (
            cartItems.find((item) => item.id === itemID)?.quantityInCart ?? 0
        );
    };

    const updateItemQuantity = (product: Product, by: 1 | -1) => {
        const qtyInCart = getItemQuantity(product.id);

        if (by === 1 && qtyInCart >= product.quantity) {
            toast.error("لا توجد كمية كافية في المخزون");
            return;
        }

        if (by === -1 && qtyInCart <= 1) {
            return;
        }

        setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
                item.id === product.id
                    ? { ...item, quantityInCart: item.quantityInCart + by }
                    : item
            )
        );
    };

    const addItem = (
        item: Product,
        selectedValues: Record<string, string> = {}
    ) => {
        const qtyInCart = getItemQuantity(item.id);

        if (qtyInCart >= item.quantity) {
            toast.error("لا توجد كمية كافية في المخزون");
            return;
        }

        setCartItems([
            ...cartItems,
            {
                ...item,
                quantityInCart: 1,
                finalPrice: item.discountedPrice || item.price,
                selectedValues: selectedValues,
            },
        ]);
        toast.success("تم إضافة المنتج إلى السلة");
        setSignalCart(true);
    };

    const removeItem = (itemID: Product["id"]) => {
        setCartItems([...cartItems].filter((item) => item.id !== itemID));
    };

    const emptyCart = () => {
        setCartItems([]);
    };

    const isEmpty = cartItems.length === 0;

    const itemsCount = cartItems.length;

    const getSubtotal = () => {
        let subtotal = 0;
        cartItems.forEach((item) => {
            subtotal += item.finalPrice * item.quantityInCart;
        });
        return subtotal;
    };

    const getTotal = () => {
        const subtotal = getSubtotal();
        const shippingAmount = shippingFee || 0;
        const discountAmount = 0;

        return subtotal + shippingAmount - discountAmount;
    };

    return (
        <CartContext.Provider
            value={{
                toggle,
                close,
                open,
                isOpen: showCart,
                cartItems,
                getItemQuantity,
                addItem,
                removeItem,
                emptyCart,
                isEmpty,
                inCart,
                itemsCount,
                signalCart: !isEmpty && signalCart,
                updateItemQuantity,
                subTotal: getSubtotal(),
                total: getTotal(),
                shippingFee,
                setShippingFee,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContextProvider;
