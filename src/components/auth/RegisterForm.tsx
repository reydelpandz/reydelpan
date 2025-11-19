"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import axios, { isAxiosError } from "axios";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

const registerFormSchema = z.object({
    fullName: z.string().min(2).max(48),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface RegisterFormProps {
    onLoginClick: () => void;
}

const RegisterForm = ({ onLoginClick }: RegisterFormProps) => {
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
    });

    const handleRegister = async (values: RegisterFormValues) => {
        const result = await signUp.email({
            email: values.email,
            password: values.password,
            name: values.fullName,
        });

        if (result.error) {
            toast.error(result.error.message);
        } else {
            onLoginClick();
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleRegister)}
                    className="space-y-4"
                    noValidate
                >
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="John"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="johndoe@example.com"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="●●●●●●●●●●"
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="w-full"
                        isLoading={form.formState.isSubmitting}
                    >
                        Sign Up
                    </Button>
                </form>
            </Form>
            <button
                className="hover:underline underline-offset-4 text-sm w-fit mx-auto"
                onClick={onLoginClick}
            >
                Already have an account?
            </button>
        </>
    );
};

export default RegisterForm;
