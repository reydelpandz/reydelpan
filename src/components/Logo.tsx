import { cn } from "@/lib/utils";

const Logo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return (
        <img
            {...props}
            className={cn("w-40 sm:w-48", props.className)}
            src="/logo.svg"
            alt="Rey del Pan"
        />
    );
};

export default Logo;
