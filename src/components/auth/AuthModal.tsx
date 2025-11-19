"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import RegisterForm from "./RegisterForm";
import { useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";

const AuthModal = () => {
    const { toggle, isOpen } = useModal();
    const [view, setView] = useState<
        "LOGIN" | "REGISTER" | "FORGOT_PASSWORD" | "RESET_PASSWORD"
    >("REGISTER");

    const searchParams = useSearchParams();

    useEffect(() => {
        const init = async () => {
            const resetPasswordToken = searchParams.get("rpt");
            const verificationToken = searchParams.get("vt");
            const reqAuth = searchParams.get("req_auth") === "true";
            const shouldOpen =
                resetPasswordToken || verificationToken || reqAuth;

            if (shouldOpen && !isOpen("auth")) {
                toggle("auth");

                if (resetPasswordToken) {
                    setView("RESET_PASSWORD");
                }

                if (verificationToken) {
                    try {
                        // await verifyEmail(verificationToken);
                        toast.success("Email verified successfully.");
                    } catch (error) {
                        toast("Invalid or expired token");
                    }
                }
            }
        };
        init();
    }, [searchParams]);

    return (
        <div dir="ltr">
            <Dialog open={isOpen("auth")} onOpenChange={() => toggle("auth")}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {view === "LOGIN"
                                ? "Sign In"
                                : view === "REGISTER"
                                ? "Sign Up"
                                : view === "FORGOT_PASSWORD"
                                ? "Reset Password"
                                : "Set New Password"}
                        </DialogTitle>
                    </DialogHeader>
                    {/* {view === "LOGIN" && (
                        <LoginForm
                            onRegisterClick={() => setView("REGISTER")}
                            onForgotPasswordClick={() => setView("FORGOT_PASSWORD")}
                        />
                    )} */}
                    {view === "REGISTER" && (
                        <RegisterForm
                            onLoginClick={() => {
                                // setView("LOGIN");
                                toggle("auth");
                            }}
                        />
                    )}
                    {/* {view === "FORGOT_PASSWORD" && (
                        <ForgotPasswordForm
                            onBackToLogin={() => setView("LOGIN")}
                        />
                    )}
                    {view === "RESET_PASSWORD" && (
                        <ResetPasswordForm onBackToLogin={() => setView("LOGIN")} />
                    )} */}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AuthModal;
