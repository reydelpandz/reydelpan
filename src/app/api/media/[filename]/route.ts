import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;

    // Determine the directory based on environment
    const mediaDir =
        process.env.NODE_ENV === "production"
            ? path.join("/app/media")
            : path.join(process.cwd(), "public", "media");

    const filePath = path.join(mediaDir, filename);

    try {
        const fileBuffer = await fs.readFile(filePath);
        
        // Determine content type
        const ext = path.extname(filename).toLowerCase();
        let contentType = "application/octet-stream";
        
        switch (ext) {
            case ".jpg":
            case ".jpeg":
                contentType = "image/jpeg";
                break;
            case ".png":
                contentType = "image/png";
                break;
            case ".gif":
                contentType = "image/gif";
                break;
            case ".webp":
                contentType = "image/webp";
                break;
            case ".svg":
                contentType = "image/svg+xml";
                break;
        }

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error serving media file:", error);
        return new NextResponse("File not found", { status: 404 });
    }
}
