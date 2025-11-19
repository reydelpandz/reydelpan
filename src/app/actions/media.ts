"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { Role } from "@/generated/prisma";

export async function uploadMedia(formData: FormData) {
    try {
        const authSession = await getServerSession();
        if (!hasPermission(authSession?.user.role as Role, "CREATE_MEDIA")) {
            return { success: false, message: "Unauthorized" };
        }

        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return { success: false, error: "No files provided" };
        }

        const mediaDir = path.join(process.cwd(), "public", "media");
        await fs.mkdir(mediaDir, { recursive: true });

        const uploadedFiles: string[] = [];

        for (const file of files) {
            if (file.size === 0) continue;

            // Validate file type
            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/webp",
                "image/svg+xml",
            ];
            if (!validTypes.includes(file.type)) {
                continue;
            }

            // Create unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 8);
            const ext = path.extname(file.name);
            const nameWithoutExt = path.basename(file.name, ext);
            const sanitizedName = nameWithoutExt.replace(
                /[^a-zA-Z0-9-_]/g,
                "-"
            );
            const uniqueFilename = `${sanitizedName}-${timestamp}-${randomString}${ext}`;

            const filepath = path.join(mediaDir, uniqueFilename);
            const buffer = Buffer.from(await file.arrayBuffer());

            await fs.writeFile(filepath, buffer);
            uploadedFiles.push(uniqueFilename);
        }

        // Revalidate the media page to show new uploads
        revalidatePath("/admin/media");

        return {
            success: true,
            files: uploadedFiles,
            message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
        };
    } catch (error) {
        console.error("Upload error:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to upload files",
        };
    }
}

export async function deleteMedia(filename: string) {
    try {
        const authSession = await getServerSession();
        if (!hasPermission(authSession?.user.role as Role, "DELETE_MEDIA")) {
            return { success: false, message: "Unauthorized" };
        }

        const mediaDir = path.join(process.cwd(), "public", "media");
        const filepath = path.join(mediaDir, filename);

        await fs.unlink(filepath);
        revalidatePath("/admin/media");

        return { success: true, message: "File deleted successfully" };
    } catch (error) {
        console.error("Delete error:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to delete file",
        };
    }
}
