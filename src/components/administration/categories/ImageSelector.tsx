import type { MediaFile } from "@/lib/media";
import { cn } from "@/lib/utils";
import { RiImageLine } from "@remixicon/react";

interface ImageSelectorProps {
    image: string | undefined;
    setImage: (imageUrl: string | undefined) => void;
    mediaFiles: MediaFile[];
}

const ImageSelector = ({ mediaFiles, image, setImage }: ImageSelectorProps) => {
    const handleClick = (mediaUrl: string, isSelected: boolean) => {
        if (isSelected) {
            setImage(undefined);
        } else {
            setImage(mediaUrl);
        }
    };

    return (
        <div className="space-y-4 max-h-50 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
                {mediaFiles.map((media) => {
                    const isSelected = image === media.url;
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
                            {isSelected && (
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
