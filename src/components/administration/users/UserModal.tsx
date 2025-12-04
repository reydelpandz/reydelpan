"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { useModal } from "@/hooks/use-modal";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { Role, User } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
    role: z.enum(["ADMIN", "MANAGER", "CUSTOMER"]),
});

type UserFormValues = z.infer<typeof formSchema>;

const UserModal = () => {
    const { isOpen, toggle, actionData: selectedUser } = useModal<User>();
    const router = useRouter();
    const isEditMode = selectedUser !== null;

    const form = useForm<UserFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: "MANAGER",
        },
    });

    const handleUpdate = async (values: UserFormValues) => {
        try {
            if (!selectedUser) return;

            await axios.put(`/api/users/${selectedUser.id}`, values);
            toggle("user");
            router.refresh();
            toast.success("User updated successfully");
        } catch (error) {
            isAxiosError(error) && toast.error(error.message);
        }
    };

    useEffect(() => {
        if (isEditMode && selectedUser) {
            form.setValue("role", selectedUser.role);
        } else {
            form.reset({
                role: "MANAGER" satisfies Role,
            });
        }
    }, [isOpen("user"), isEditMode, selectedUser]);

    return (
        <Sheet
            open={isOpen("user")}
            onOpenChange={() => {
                toggle("user", null);
            }}
        >
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>
                        {isEditMode ? "Edit User" : "Create User"}
                    </SheetTitle>
                </SheetHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(
                            isEditMode ? handleUpdate : () => {}
                        )}
                        className="space-y-6 p-4"
                        noValidate
                    >
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(
                                                [
                                                    "MANAGER",
                                                    "ADMIN",
                                                ] satisfies Role[]
                                            ).map((role) => (
                                                <SelectItem
                                                    key={role}
                                                    value={role}
                                                >
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            className="w-full"
                            isLoading={form.formState.isSubmitting}
                            type="submit"
                        >
                            {isEditMode ? "Update user" : "Create user"}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};

export default UserModal;
