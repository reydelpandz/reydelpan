"use client";

import { useState, useRef, useMemo } from "react";
import { uploadMedia } from "@/app/actions/media";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
    RiAddLine,
    RiCloseLine,
    RiUploadCloud2Line,
    RiImageLine,
    RiCheckLine,
} from "@remixicon/react";
import { ImageCropperModal } from "./ImageCropperModal";
import { convertToWebP, formatFileSize } from "@/lib/utils/media";
import { cn } from "@/lib/utils";

interface ProcessedFile {
    file: File;
    preview: string;
    originalSize: number;
    compressedSize: number;
}

const MediaUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState<ProcessedFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [cropperOpen, setCropperOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [fileNameToCrop, setFileNameToCrop] = useState<string>("");
    const [originalSizeToCrop, setOriginalSizeToCrop] = useState<number>(0);

    const totalOriginalSize = useMemo(
        () => selectedFiles.reduce((acc, f) => acc + f.originalSize, 0),
        [selectedFiles]
    );

    const totalCompressedSize = useMemo(
        () => selectedFiles.reduce((acc, f) => acc + f.compressedSize, 0),
        [selectedFiles]
    );

    const compressionRatio =
        totalOriginalSize > 0
            ? Math.round((1 - totalCompressedSize / totalOriginalSize) * 100)
            : 0;

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        if (files.length === 1 && files[0].type.startsWith("image/")) {
            const file = files[0];
            const imageUrl = URL.createObjectURL(file);
            setImageToCrop(imageUrl);
            setFileNameToCrop(file.name);
            setOriginalSizeToCrop(file.size);
            setCropperOpen(true);
        } else {
            for (const file of files) {
                if (file.type.startsWith("image/")) {
                    try {
                        const webpBlob = await convertToWebP(file);
                        const nameWithoutExt = file.name.replace(
                            /\.[^/.]+$/,
                            ""
                        );
                        const webpFile = new File(
                            [webpBlob],
                            `${nameWithoutExt}.webp`,
                            {
                                type: "image/webp",
                            }
                        );
                        const preview = URL.createObjectURL(webpFile);
                        setSelectedFiles((prev) => [
                            ...prev,
                            {
                                file: webpFile,
                                preview,
                                originalSize: file.size,
                                compressedSize: webpFile.size,
                            },
                        ]);
                    } catch (error) {
                        console.error("Error converting to WebP:", error);
                    }
                }
            }
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCropComplete = (croppedBlob: Blob, fileName: string) => {
        const croppedFile = new File([croppedBlob], fileName, {
            type: "image/webp",
        });
        const preview = URL.createObjectURL(croppedFile);
        setSelectedFiles((prev) => [
            ...prev,
            {
                file: croppedFile,
                preview,
                originalSize: originalSizeToCrop,
                compressedSize: croppedFile.size,
            },
        ]);

        if (imageToCrop) {
            URL.revokeObjectURL(imageToCrop);
        }
        setImageToCrop(null);
        setFileNameToCrop("");
        setOriginalSizeToCrop(0);
    };

    const handleCropperClose = () => {
        if (imageToCrop) {
            URL.revokeObjectURL(imageToCrop);
        }
        setImageToCrop(null);
        setFileNameToCrop("");
        setOriginalSizeToCrop(0);
        setCropperOpen(false);
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => {
            const file = prev[index];
            URL.revokeObjectURL(file.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const clearAll = () => {
        selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
        setSelectedFiles([]);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        selectedFiles.forEach((f) => formData.append("files", f.file));

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const result = await uploadMedia(formData);

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (result.success) {
                toast.success(result.message);
                clearAll();
                setTimeout(() => {
                    location.reload();
                }, 500);
            } else {
                toast.error(result.error);
                setUploadProgress(0);
            }
        } catch (error) {
            toast.error("Failed to upload files");
            setUploadProgress(0);
        } finally {
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
            }, 500);
        }
    };

    return (
        <>
            <div className="space-y-4">
                {/* Upload Button */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <RiAddLine className="size-6" />
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* Preview Area */}
                {selectedFiles.length > 0 && (
                    <Card className="overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 bg-muted/50 border-b flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <RiImageLine className="size-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        {selectedFiles.length} image
                                        {selectedFiles.length > 1 ? "s" : ""}{" "}
                                        ready
                                    </span>
                                </div>
                                {compressionRatio > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-full">
                                        <RiCheckLine className="size-3" />
                                        <span>{compressionRatio}% smaller</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAll}
                                    disabled={uploading}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    Clear All
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    size="sm"
                                    className="min-w-[100px]"
                                >
                                    {uploading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Uploading
                                        </span>
                                    ) : (
                                        <>
                                            <RiUploadCloud2Line className="size-4 mr-1" />
                                            Upload
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {uploading && uploadProgress > 0 && (
                            <div className="px-4 py-2 bg-primary/5 border-b">
                                <div className="flex items-center gap-3">
                                    <Progress
                                        value={uploadProgress}
                                        className="flex-1 h-2"
                                    />
                                    <span className="text-xs font-medium text-primary min-w-[40px]">
                                        {uploadProgress}%
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* File Grid */}
                        <div className="p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {selectedFiles.map((item, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-muted rounded-lg overflow-hidden"
                                    >
                                        <div className="aspect-square">
                                            <img
                                                src={item.preview}
                                                alt={item.file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Overlay */}
                                        <div
                                            className={cn(
                                                "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity",
                                                uploading
                                                    ? "opacity-0"
                                                    : "opacity-0 group-hover:opacity-100"
                                            )}
                                        >
                                            <button
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                                className="bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors"
                                                disabled={uploading}
                                            >
                                                <RiCloseLine className="size-4" />
                                            </button>
                                        </div>

                                        {/* Info Bar */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                            <p className="text-[10px] text-white/90 truncate font-medium">
                                                {item.file.name}
                                            </p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className="text-[10px] text-white/60 line-through">
                                                    {formatFileSize(
                                                        item.originalSize
                                                    )}
                                                </span>
                                                <span className="text-[10px] text-emerald-400">
                                                    {formatFileSize(
                                                        item.compressedSize
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add More Button */}
                                <button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={uploading}
                                    className={cn(
                                        "aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30",
                                        "flex flex-col items-center justify-center gap-1 transition-colors",
                                        "hover:border-primary hover:bg-primary/5",
                                        uploading &&
                                            "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <RiAddLine className="size-6 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        Add More
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Footer Stats */}
                        <div className="px-4 py-2 bg-muted/30 border-t text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
                            <span>
                                Total: {formatFileSize(totalCompressedSize)}{" "}
                                (was {formatFileSize(totalOriginalSize)})
                            </span>
                            <span>WebP format • Optimized for web</span>
                        </div>
                    </Card>
                )}
            </div>

            {imageToCrop && (
                <ImageCropperModal
                    isOpen={cropperOpen}
                    onClose={handleCropperClose}
                    imageSrc={imageToCrop}
                    fileName={fileNameToCrop}
                    onCropComplete={handleCropComplete}
                />
            )}
        </>
    );
};

export default MediaUpload;
