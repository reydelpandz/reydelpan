import { Badge } from "@/components/ui/badge";
import type { MediaFile } from "@/lib/media";
import { cn } from "@/lib/utils";
import { RiCheckLine, RiImageLine } from "@remixicon/react";

interface ImageSelectorProps {
    images: string[];
    setImages: (newImages: string[]) => void;
    mediaFiles: MediaFile[];
}

const ImageSelector = ({
    mediaFiles,
    images,
    setImages,
}: ImageSelectorProps) => {
    const handleClick = (mediaUrl: string, isSelected: boolean) => {
        if (isSelected) {
            setImages(images.filter((imgUrl) => imgUrl !== mediaUrl));
        } else {
            setImages([...images, mediaUrl]);
        }
    };

    return (
        <div className="space-y-4 max-h-50 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
                {mediaFiles.map((media) => {
                    const isSelected = images.some(
                        (imgUrl) => imgUrl === media.url
                    );
                    const isMain = images[0] === media.url;
                    return (
                        <button
                            key={media.name}
                            type="button"
                            className={cn(
                                "relative aspect-square rounded-md overflow-hidden border-3 transition-all",
                                isSelected
                                    ? "border-primary "
                                    : "border-transparent hover:border-primary"
                            )}
                            onClick={() => handleClick(media.url, isSelected)}
                        >
                            <img
                                src={media.url}
                                alt={media.name}
                                className="w-full h-full object-cover"
                            />
                            {isMain && (
                                <div className="absolute inset-0 bg-primary/20 text-primary-foreground flex items-center justify-center">
                                    <RiImageLine />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ImageSelector;
