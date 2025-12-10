export interface CroppedArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ProcessImageOptions {
    targetWidth?: number;
    targetHeight?: number;
    quality?: number;
    isSquareProduct?: boolean;
}

/**
 * Creates a cropped, resized, and compressed image from the source image
 */
export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: CroppedArea,
    options: ProcessImageOptions = {}
): Promise<Blob> {
    const {
        targetWidth,
        targetHeight,
        quality = 0.85,
        isSquareProduct = false,
    } = options;

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }

    // For 1:1 product images, always use 600x600
    let finalWidth = pixelCrop.width;
    let finalHeight = pixelCrop.height;

    if (isSquareProduct) {
        finalWidth = 600;
        finalHeight = 600;
    } else if (targetWidth && targetHeight) {
        finalWidth = targetWidth;
        finalHeight = targetHeight;
    } else if (targetWidth) {
        const ratio = targetWidth / pixelCrop.width;
        finalWidth = targetWidth;
        finalHeight = Math.round(pixelCrop.height * ratio);
    } else if (targetHeight) {
        const ratio = targetHeight / pixelCrop.height;
        finalHeight = targetHeight;
        finalWidth = Math.round(pixelCrop.width * ratio);
    }

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Enable high-quality image scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the cropped and resized image
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        finalWidth,
        finalHeight
    );

    // Convert to WebP blob with compression
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                resolve(blob);
            },
            "image/webp",
            quality
        );
    });
}

/**
 * Converts and compresses any image to WebP format
 */
export async function convertToWebP(
    file: File,
    maxWidth = 1920
): Promise<Blob> {
    const imageSrc = URL.createObjectURL(file);
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }

    // Resize if larger than maxWidth while maintaining aspect ratio
    let width = image.width;
    let height = image.height;

    if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = Math.round(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, width, height);

    URL.revokeObjectURL(imageSrc);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                resolve(blob);
            },
            "image/webp",
            0.85
        );
    });
}

/**
 * Helper function to create an image element from a source
 */
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Converts image to WebP with custom quality (for skip crop)
 */
export async function convertToWebPWithQuality(
    imageSrc: string,
    quality: number = 0.8
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }

    // Keep original dimensions but cap at 1920px width
    let width = image.width;
    let height = image.height;

    if (width > 1920) {
        const ratio = 1920 / width;
        width = 1920;
        height = Math.round(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, width, height);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                resolve(blob);
            },
            "image/webp",
            quality
        );
    });
}
