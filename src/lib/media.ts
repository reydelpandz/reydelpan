import fs from "fs/promises";
import path from "path";

export interface MediaFile {
    name: string;
    url: string;
    size: number;
    createdAt: Date;
}

export async function getMediaFiles(): Promise<MediaFile[]> {
    const mediaDir = path.join(process.cwd(), "public", "media");

    try {
        // Ensure directory exists
        await fs.mkdir(mediaDir, { recursive: true });

        const files = await fs.readdir(mediaDir);

        const mediaFiles = await Promise.all(
            files
                .filter((file) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
                .map(async (file) => {
                    const filePath = path.join(mediaDir, file);
                    const stats = await fs.stat(filePath);

                    return {
                        name: file,
                        url: `/media/${file}`,
                        size: stats.size,
                        createdAt: stats.birthtime,
                    };
                })
        );

        // Sort by creation date, newest first
        return mediaFiles.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
    } catch (error) {
        console.error("Error reading media files:", error);
        return [];
    }
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
