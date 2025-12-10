"use client";

import { useState } from "react";
import { MediaFile } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import NoResults from "../NoResults";
import { useModal } from "@/hooks/use-modal";
import { Pagination } from "@/components/ui/pagination";

interface MediaGridProps {
    files: MediaFile[];
}

const ITEMS_PER_PAGE = 10;

export function MediaGrid({ files }: MediaGridProps) {
    const { toggle } = useModal();
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(files.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentFiles = files.slice(startIndex, endIndex);

    const copyUrl = async (url: string) => {
        try {
            const fullUrl = `${window.location.origin}${url}`;
            await navigator.clipboard.writeText(fullUrl);
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000);
            toast.success("URL copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy URL");
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (files.length === 0) {
        return <NoResults />;
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentFiles.map((file) => (
                    <Card key={file.name} className="overflow-hidden p-0 group">
                        <div className="aspect-square relative">
                            <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => copyUrl(file.url)}
                                >
                                    {copiedUrl === file.url ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                        toggle("deleteMedia", file.name)
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-3">
                            <p
                                className="text-sm font-medium truncate"
                                title={file.name}
                            >
                                {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Intl.NumberFormat("en-US", {
                                    style: "unit",
                                    unit: "kilobyte",
                                    maximumFractionDigits: 0,
                                }).format(file.size / 1024)}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />

                    <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1}-
                        {Math.min(endIndex, files.length)} of {files.length}{" "}
                        files
                    </p>
                </div>
            )}
        </>
    );
}
