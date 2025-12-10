import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Get settings
export async function GET() {
    try {
        // Get or create the settings record (there should only be one)
        let settings = await prisma.settings.findFirst();

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    isUnderPressure: false,
                },
            });
        }

        return Response.json({ settings });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}

// Update settings
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "EDIT_SETTINGS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        // Get or create the settings record
        let settings = await prisma.settings.findFirst();

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    isUnderPressure: body.isUnderPressure ?? false,
                },
            });
        } else {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: {
                    isUnderPressure: body.isUnderPressure ?? settings.isUnderPressure,
                },
            });
        }

        revalidatePath("/");
        revalidatePath("/checkout");

        return Response.json(
            { message: "Settings updated successfully", settings },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}
