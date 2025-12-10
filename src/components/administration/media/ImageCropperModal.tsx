"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg, CroppedArea, formatFileSize } from "@/lib/utils/media";
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
    {
        value: "1:1",
        label: "1:1",
        ratio: 1,
        description: "Best for products (600×600)",
        isRecommended: true,
    },
    {
        value: "free",
        label: "Free",
        ratio: undefined,
        description: "Custom crop",
    },
    { value: "4:3", label: "4:3", ratio: 4 / 3, description: "Standard" },
    { value: "16:9", label: "16:9", ratio: 16 / 9, description: "Widescreen" },
    { value: "3:4", label: "3:4", ratio: 3 / 4, description: "Portrait" },
    { value: "9:16", label: "9:16", ratio: 9 / 16, description: "Story" },
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

    // Preview state
    const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

    const currentAspect = aspectRatioOptions.find(
        (a) => a.value === selectedAspect
    );
    const aspectRatio = currentAspect?.ratio;

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

    // Generate preview when quality or crop changes
    useEffect(() => {
        if (!croppedAreaPixels || !isOpen) return;

        const timeout = setTimeout(async () => {
            setIsGeneratingPreview(true);
            try {
                const isSquareProduct = selectedAspect === "1:1";
                const blob = await getCroppedImg(imageSrc, croppedAreaPixels, {
                    isSquareProduct,
                    quality: quality / 100,
                });
                setPreviewBlob(blob);
            } catch (error) {
                console.error("Error generating preview:", error);
            } finally {
                setIsGeneratingPreview(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [quality, croppedAreaPixels, selectedAspect, imageSrc, isOpen]);

    const handleCrop = async () => {
        if (!croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const isSquareProduct = selectedAspect === "1:1";

            const croppedBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                {
                    isSquareProduct,
                    quality: quality / 100,
                }
            );

            const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
            const webpFileName = `${nameWithoutExt}.webp`;

            onCropComplete(croppedBlob, webpFileName);
            onClose();
        } catch (error) {
            console.error("Error cropping image:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAspectChange = (value: string) => {
        setSelectedAspect(value);
        setCrop({ x: 0, y: 0 });
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
                    <DialogTitle className="flex items-center gap-2">
                        Crop & Optimize Image
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
                    {/* Cropper Area */}
                    <div className="flex-1 relative bg-black/90 min-h-[300px] lg:min-h-[400px]">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={onCropCompleteCallback}
                        />
                    </div>

                    {/* Controls Sidebar */}
                    <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-background p-4 space-y-5 overflow-y-auto">
                        {/* Aspect Ratio */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Aspect Ratio
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
                                    {currentAspect.isRecommended &&
                                        " — Optimized for product images"}
                                </p>
                            )}
                        </div>

                        {/* Zoom Slider */}
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
                                onValueChange={(values) => setZoom(values[0])}
                                min={1}
                                max={3}
                                step={0.1}
                                className="w-full"
                            />
                        </div>

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
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                    Est. size:
                                </span>
                                <span
                                    className={cn(
                                        "font-medium",
                                        isGeneratingPreview && "opacity-50"
                                    )}
                                >
                                    {previewBlob
                                        ? formatFileSize(previewBlob.size)
                                        : "Calculating..."}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/30">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCrop}
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
