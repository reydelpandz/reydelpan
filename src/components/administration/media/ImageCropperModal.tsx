"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import {
    getCroppedImg,
    CroppedArea,
    formatFileSize,
    convertToWebPWithQuality,
} from "@/lib/utils/media";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ImageCropperModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    fileName: string;
    onCropComplete: (croppedBlob: Blob, fileName: string) => void;
}

type AspectRatioOption = {
    value: string;
    label: string;
    ratio: number | undefined;
    description?: string;
    isRecommended?: boolean;
};

const aspectRatioOptions: AspectRatioOption[] = [
    // No crop
    {
        value: "none",
        label: "None",
        ratio: undefined,
        description: "No cropping, keep original dimensions",
    },

    // Square - recommended for products
    {
        value: "1:1",
        label: "1:1",
        ratio: 1,
        description: "Best for products (600×600)",
        isRecommended: true,
    },

    // Landscape options
    {
        value: "4:3",
        label: "4:3",
        ratio: 4 / 3,
        description: "Standard landscape",
    },
    { value: "3:2", label: "3:2", ratio: 3 / 2, description: "Classic photo" },
    {
        value: "16:9",
        label: "16:9",
        ratio: 16 / 9,
        description: "Widescreen / Banner",
    },
    { value: "2:1", label: "2:1", ratio: 2 / 1, description: "Panoramic" },

    // Portrait options
    { value: "3:4", label: "3:4", ratio: 3 / 4, description: "Portrait" },
    {
        value: "2:3",
        label: "2:3",
        ratio: 2 / 3,
        description: "Classic portrait",
    },
    {
        value: "9:16",
        label: "9:16",
        ratio: 9 / 16,
        description: "Mobile / Story",
    },
];

export function ImageCropperModal({
    isOpen,
    onClose,
    imageSrc,
    fileName,
    onCropComplete,
}: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [quality, setQuality] = useState(80);
    const [selectedAspect, setSelectedAspect] = useState("1:1");
    const [croppedAreaPixels, setCroppedAreaPixels] =
        useState<CroppedArea | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [previewSize, setPreviewSize] = useState<number | null>(null);

    const isNoCrop = selectedAspect === "none";
    const currentAspect = aspectRatioOptions.find(
        (a) => a.value === selectedAspect
    );
    const aspectRatio = isNoCrop ? undefined : currentAspect?.ratio;

    const onCropChange = useCallback((crop: { x: number; y: number }) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom: number) => {
        setZoom(zoom);
    }, []);

    const onCropCompleteCallback = useCallback(
        (_: any, croppedAreaPixels: CroppedArea) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    // Generate size estimate when crop changes
    useEffect(() => {
        if (!isOpen) return;
        if (isNoCrop) {
            setPreviewSize(null);
            return;
        }
        if (!croppedAreaPixels) return;

        const timeout = setTimeout(async () => {
            try {
                const isSquareProduct = selectedAspect === "1:1";
                const blob = await getCroppedImg(imageSrc, croppedAreaPixels, {
                    isSquareProduct,
                    quality: quality / 100,
                });
                setPreviewSize(blob.size);
            } catch (error) {
                console.error("Error generating preview:", error);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [
        quality,
        croppedAreaPixels,
        selectedAspect,
        imageSrc,
        isOpen,
        isNoCrop,
    ]);

    const handleApply = async () => {
        setIsProcessing(true);
        try {
            let blob: Blob;

            if (isNoCrop) {
                blob = await convertToWebPWithQuality(imageSrc, quality / 100);
            } else if (croppedAreaPixels) {
                const isSquareProduct = selectedAspect === "1:1";
                blob = await getCroppedImg(imageSrc, croppedAreaPixels, {
                    isSquareProduct,
                    quality: quality / 100,
                });
            } else {
                setIsProcessing(false);
                return;
            }

            const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
            const webpFileName = `${nameWithoutExt}.webp`;

            onCropComplete(blob, webpFileName);
            onClose();
        } catch (error) {
            console.error("Error processing image:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAspectChange = (value: string) => {
        setSelectedAspect(value);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setPreviewSize(null);
    };

    const getQualityLabel = (q: number) => {
        if (q >= 90) return "Maximum";
        if (q >= 75) return "High";
        if (q >= 50) return "Medium";
        return "Low";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-muted/30">
                    <DialogTitle>Crop & Optimize Image</DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
                    {/* Image Area */}
                    <div className="flex-1 relative bg-black/90 min-h-[300px] lg:min-h-[400px]">
                        {isNoCrop ? (
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        ) : (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={onCropChange}
                                onZoomChange={onZoomChange}
                                onCropComplete={onCropCompleteCallback}
                            />
                        )}
                    </div>

                    {/* Controls Sidebar */}
                    <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-background p-4 space-y-5 overflow-y-auto">
                        {/* Crop Mode */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Crop Ratio
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                {aspectRatioOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() =>
                                            handleAspectChange(option.value)
                                        }
                                        className={cn(
                                            "relative flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all",
                                            selectedAspect === option.value
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                                        )}
                                    >
                                        {option.isRecommended && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                                ★
                                            </span>
                                        )}
                                        <span className="font-semibold text-sm">
                                            {option.label}
                                        </span>
                                        {selectedAspect === option.value && (
                                            <Check className="h-3 w-3 text-primary mt-0.5" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {currentAspect?.description && (
                                <p
                                    className={cn(
                                        "text-xs text-center py-2 px-3 rounded-md",
                                        currentAspect.isRecommended
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {currentAspect.description}
                                </p>
                            )}
                        </div>

                        {/* Zoom Slider - only show when cropping */}
                        {!isNoCrop && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        Zoom
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        {zoom.toFixed(1)}x
                                    </span>
                                </div>
                                <Slider
                                    value={[zoom]}
                                    onValueChange={(values) =>
                                        setZoom(values[0])
                                    }
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    className="w-full"
                                />
                            </div>
                        )}

                        {/* Quality Slider */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                    Quality
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    {quality}% ({getQualityLabel(quality)})
                                </span>
                            </div>
                            <Slider
                                value={[quality]}
                                onValueChange={(values) =>
                                    setQuality(values[0])
                                }
                                min={20}
                                max={100}
                                step={5}
                                className="w-full"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                <span>Smaller file</span>
                                <span>Better quality</span>
                            </div>
                        </div>

                        {/* Output Info */}
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                    Format:
                                </span>
                                <span className="font-medium">WebP</span>
                            </div>
                            {selectedAspect === "1:1" && (
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">
                                        Dimensions:
                                    </span>
                                    <span className="font-medium text-primary">
                                        600×600 px
                                    </span>
                                </div>
                            )}
                            {previewSize && (
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">
                                        Est. size:
                                    </span>
                                    <span className="font-medium">
                                        {formatFileSize(previewSize)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/30">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={isProcessing}
                        className="min-w-[140px]"
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            "Apply & Continue"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
