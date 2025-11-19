"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface BlurImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    unoptimized?: boolean;
    quality?: number;
    className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

const BlurImage = ({
    src,
    alt,
    fill,
    width,
    height,
    className,
    unoptimized,
    quality,
}: BlurImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <Image
            alt={alt}
            src={src}
            width={width}
            height={height}
            fill={fill}
            unoptimized={unoptimized}
            quality={quality}
            className={cn(
                "duration-700 ease-in-out md:group-hover:opacity-75 object-cover",
                className,
                isLoading
                    ? "scale-110 blur-2xl grayscale"
                    : "scale-100 blur-0 grayscale-0"
            )}
            onLoad={() => setIsLoading(false)}
        />
    );
};

export default BlurImage;
