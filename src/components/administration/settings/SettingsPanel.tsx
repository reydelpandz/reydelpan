"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "@/generated/prisma";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";

interface SettingsPanelProps {
    settings: Settings;
}

export default function SettingsPanel({ settings }: SettingsPanelProps) {
    const [isUnderPressure, setIsUnderPressure] = useState(settings.isUnderPressure);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async (checked: boolean) => {
        setIsLoading(true);
        try {
            await axios.put("/api/settings", { isUnderPressure: checked });
            setIsUnderPressure(checked);
            toast.success("Settings updated successfully");
            router.refresh();
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || "Failed to update settings");
            }
            // Revert the toggle if the request failed
            setIsUnderPressure(!checked);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="size-5 text-amber-500" />
                        Under Pressure Mode
                    </CardTitle>
                    <CardDescription>
                        When enabled, customers will see a warning modal informing them that the site is under heavy load.
                        The checkout form will also be disabled.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="under-pressure" className="text-base font-medium">
                                Enable Under Pressure Mode
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {isUnderPressure
                                    ? "Site is currently showing the pressure warning"
                                    : "Site is operating normally"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {isLoading && <Loader2 className="size-4 animate-spin" />}
                            <Switch
                                id="under-pressure"
                                checked={isUnderPressure}
                                onCheckedChange={handleToggle}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status indicator */}
            <Card className={isUnderPressure ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "border-green-500 bg-green-50 dark:bg-green-950/20"}>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <div className={`size-3 rounded-full ${isUnderPressure ? "bg-amber-500 animate-pulse" : "bg-green-500"}`} />
                        <span className={`font-medium ${isUnderPressure ? "text-amber-700 dark:text-amber-400" : "text-green-700 dark:text-green-400"}`}>
                            {isUnderPressure
                                ? "Under Pressure Mode is ACTIVE"
                                : "Normal Operation Mode"}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
