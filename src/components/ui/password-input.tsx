import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import React from "react";
import { Input } from "./input";

const PasswordInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
        <div className="relative">
            <Input
                placeholder="●●●●●●●●●"
                ref={ref}
                type={showPassword ? "text" : "password"}
                className={className}
                {...props}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 -translate-y-1/2 hover:opacity-90"
            >
                {showPassword ? (
                    <RiEyeOffLine className="size-5" />
                ) : (
                    <RiEyeLine className="size-5" />
                )}
            </button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
