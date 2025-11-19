import { cn } from "@/lib/utils";
import { RiLoader4Line } from "@remixicon/react";

interface LoaderProps {
    size?: number;
    className?: HTMLElement["className"];
    fullPage?: boolean;
}

const Loader = ({ size = 24, className, fullPage }: LoaderProps) => {
    if (fullPage) {
        return (
            <div className="h-dvh w-dvw flex items-center justify-center">
                <RiLoader4Line
                    className={cn(
                        "animate-spin duration-1000 size-12 md:size-16",
                        className
                    )}
                />
            </div>
        );
    }

    return (
        <RiLoader4Line
            size={size}
            className={cn("animate-spin duration-1000", className)}
        />
    );
};

export default Loader;
