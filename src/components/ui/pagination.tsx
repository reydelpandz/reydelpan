"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total pages are less than or equal to maxPagesToShow
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of the middle section
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near the beginning
            if (currentPage <= 3) {
                endPage = 4;
            }

            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push(-1); // -1 represents ellipsis
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push(-2); // -2 represents ellipsis
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div
            className={cn("flex items-center justify-center gap-1", className)}
        >
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <RiArrowLeftSLine className="h-4 w-4" />
            </Button>

            {pageNumbers.map((pageNumber, index) => {
                if (pageNumber < 0) {
                    // Render ellipsis
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                        >
                            ...
                        </span>
                    );
                }

                return (
                    <Button
                        key={pageNumber}
                        variant={
                            pageNumber === currentPage ? "default" : "outline"
                        }
                        size="icon"
                        onClick={() => onPageChange(pageNumber)}
                        aria-label={`Page ${pageNumber}`}
                        aria-current={
                            pageNumber === currentPage ? "page" : undefined
                        }
                        className="h-9 w-9"
                    >
                        {pageNumber}
                    </Button>
                );
            })}

            <Button
                variant="outline"
                size="icon"
                onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <RiArrowRightSLine className="h-4 w-4" />
            </Button>
        </div>
    );
}
