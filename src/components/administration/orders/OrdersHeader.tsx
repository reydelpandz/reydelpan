"use client";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiAddLine, RiErrorWarningFill, RiSearchLine } from "@remixicon/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ORDER_STATUSES } from "@/lib/constants";

const OrdersHeader = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchType, setSearchType] = useState<string>("name");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const statusFilter =
        searchParams.get("status") ??
        (searchParams.get("showAllOrders") === "true" ? "ALL" : "ACTIVE");

    const handleStatusChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        // Reset pagination when filtering
        params.delete("page");
        params.delete("status");
        params.delete("showAllOrders");
        if (value === "ALL") {
            params.set("showAllOrders", "true");
        } else if (value !== "ACTIVE") {
            params.set("status", value);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    // Initialize search values from URL params
    useEffect(() => {
        const type = searchParams.get("searchType") || "name";
        const query = searchParams.get("query") || "";
        setSearchType(type);
        setSearchQuery(query);
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Reset pagination when searching
        params.delete("page");

        if (searchQuery) {
            params.set("searchType", searchType);
            params.set("query", searchQuery);
        } else {
            params.delete("searchType");
            params.delete("query");
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4">
                <div className="flex w-full md:max-w-md gap-2">
                    <Select value={searchType} onValueChange={setSearchType}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Search by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="id">Order ID</SelectItem>
                            <SelectItem value="name">Customer Name</SelectItem>
                            <SelectItem value="phone">Phone Number</SelectItem>
                            <SelectItem value="confirmedBy">
                                Confirmed By
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex flex-1 gap-2">
                        <Input
                            placeholder={`Search by ${searchType}...`}
                            className="flex-1"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button onClick={handleSearch} variant="secondary">
                            <RiSearchLine className="size-5" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Select
                        value={statusFilter}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Show" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">
                                Active orders
                            </SelectItem>
                            {ORDER_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.replaceAll("_", " ")} only
                                </SelectItem>
                            ))}
                            <SelectItem value="ALL">All orders</SelectItem>
                        </SelectContent>
                    </Select>
                    <Link
                        href="/products"
                        className={buttonVariants()}
                        target="_blank"
                    >
                        <RiAddLine className="size-6" />
                    </Link>
                </div>
            </div>
            <Alert variant="default" className="mb-6">
                <RiErrorWarningFill className="size-5" />
                <AlertTitle>
                    تكلفة التوصيل مشمولة في المجموع الموضح أدناه.
                </AlertTitle>
            </Alert>
        </div>
    );
};

export default OrdersHeader;
