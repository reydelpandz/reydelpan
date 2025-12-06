"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import PasswordInput from "@/components/ui/password-input";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

const loginSchema = z.object({
    email: z.string().email("Adresse e-mail invalide"),
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (values: LoginFormValues) => {
        setIsLoading(true);
        const result = await signIn.email({
            email: values.email,
            password: values.password,
            rememberMe: true,
        });

        setIsLoading(false);

        if (result.error) {
            toast.error(result.error.message);
        } else {
            router.replace("/administration/orders");
        }
    };

    return (
        <main className="min-h-screen flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto px-4 py-8 sm:px-6 md:px-8 bg-white rounded-lg shadow-md">
                <div className="mb-8 flex items-center gap-4 justify-center flex-col">
                    <Logo />
                    <h1 className="font-extrabold text-2xl sm:text-3xl text-center">
                        Sign in to Continue
                    </h1>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleLogin)}
                        className="space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="jean.dupont@email.com"
                                            type="email"
                                            autoComplete="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-1">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => toast("Contact Alaa :)")}
                                className="mt-2 inline-block w-fit text-sm font-medium text-primary hover:underline"
                            >
                                Forgot passowrd?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            Sign In
                        </Button>
                    </form>
                </Form>
            </div>
        </main>
    );
}
