"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { RiAddLine } from "@remixicon/react";
import React from "react";

const ProductsHeader = () => {
    const { toggle } = useModal();
    return (
        <div className="flex items-center justify-between py-4">
            <div></div>

            <Button onClick={() => toggle("product")}>
                <RiAddLine className="size-6" />
            </Button>
        </div>
    );
};

export default ProductsHeader;
