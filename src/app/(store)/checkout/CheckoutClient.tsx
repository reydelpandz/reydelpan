"use client";

import { useEffect, useState } from "react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { useCart } from "@/hooks/use-cart";
import { useRouter, useSearchParams } from "next/navigation";
import ThankYou from "@/components/checkout/ThankYou";
import { useIsMounted } from "@/hooks/use-is-mounted";

interface CheckoutProps {
    isUnderPressure: boolean;
}

export default function CheckoutClient({ isUnderPressure }: CheckoutProps) {
    const { isEmpty } = useCart();
    const [showThankYou, setShowThankYou] = useState(false);
    const router = useRouter();
    const isMounted = useIsMounted();

    useEffect(() => {
        if (isEmpty && isMounted() && !showThankYou) {
            router.push("/products");
        }
    }, [isMounted(), isEmpty]);

    useEffect(() => {
        if (showThankYou) {
            window.scrollTo(0, 0);
        }
    }, [showThankYou]);

    if (showThankYou) {
        return <ThankYou />;
    }

    return (
        <main className="w-full max-w-4xl mx-auto min-h-screen container">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                إتمام الطلب
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <CheckoutSummary />
                </div>
                <div className="lg:col-span-2">
                    <CheckoutForm
                        showThankYou={() => setShowThankYou(true)}
                        isUnderPressure={isUnderPressure}
                    />
                </div>
            </div>
        </main>
    );
}
