import SettingsPanel from "@/components/administration/settings/SettingsPanel";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { Role } from "@/generated/prisma";

const SettingsPage = async () => {
    const authSession = await getServerSession();

    if (!hasPermission(authSession?.user.role as Role, "VIEW_SETTINGS")) {
        redirect("/administration/login");
    }

    // Get or create settings
    let settings = await prisma.settings.findFirst();

    if (!settings) {
        settings = await prisma.settings.create({
            data: {
                isUnderPressure: false,
            },
        });
    }

    return (
        <>
            <h1 className="page-title">Settings</h1>
            <div className="container mx-auto px-4 py-2">
                <SettingsPanel settings={settings} />
            </div>
        </>
    );
};

export default SettingsPage;
