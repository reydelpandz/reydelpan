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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const OrdersHeader = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchType, setSearchType] = useState<string>("name");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showAll, setShowAll] = useState<boolean>(false);

    // Initialize search values from URL params
    useEffect(() => {
        const type = searchParams.get("searchType") || "name";
        const query = searchParams.get("query") || "";
        const showAllOrders = searchParams.get("showAll") === "true";
        setSearchType(type);
        setSearchQuery(query);
        setShowAll(showAllOrders);
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Reset pagination when searching
        params.delete("page");

        if (searchQuery) {
            params.set("searchType", searchType);
            params.set("query", searchQuery);
            params.set("showAll", `${showAll}`);
        } else {
            params.delete("searchType");
            params.delete("query");
            params.delete("showAll");
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
                            <SelectItem value="confirmed by">
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
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={showAll}
                            onCheckedChange={setShowAll}
                            id="show-all"
                        />
                        <Label htmlFor="show-all">Show All</Label>
                    </div>
                </div>
                <Link
                    href="/products"
                    className={buttonVariants()}
                    target="_blank"
                >
                    <RiAddLine className="size-6" />
                </Link>
            </div>
            <Alert variant="destructive" className="mb-6">
                <RiErrorWarningFill className="size-5" />
                <AlertTitle>
                    The delivery cost is not included in the total shown below.
                </AlertTitle>
            </Alert>
        </div>
    );
};

export default OrdersHeader;
