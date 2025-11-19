interface PackPreviewOptions {
    bgColor?: string;
    size?: number;
}

interface Layout {
    positions: [number, number][];
    sizes: number[];
    rotations: number[]; // Degrees of rotation for each image
}

/**
 * Generate a pack preview image from 2-6 product images
 * @param imageUrls - Array of 2-6 image URLs
 * @param options - Optional configuration
 * @returns Base64 data URL that can be used in <img src="">
 */
export async function generatePackPreview(
    imageUrls: string[],
    options: PackPreviewOptions = {}
): Promise<string> {
    const { bgColor = "#f8f9fa", size = 800 } = options;

    // Validate input
    if (
        !Array.isArray(imageUrls) ||
        imageUrls.length < 2 ||
        imageUrls.length > 6
    ) {
        throw new Error("Must provide 2-6 image URLs");
    }

    // Stylish layout configurations with overlapping and rotation
    const layouts: Record<number, Layout> = {
        2: {
            // Two images: diagonal overlap, slight rotation
            positions: [
                [0.38, 0.45],
                [0.62, 0.55],
            ],
            sizes: [0.48, 0.48],
            rotations: [-8, 8],
        },
        3: {
            // Three images: staggered pyramid with rotation
            positions: [
                [0.5, 0.35],
                [0.32, 0.62],
                [0.68, 0.62],
            ],
            sizes: [0.42, 0.38, 0.38],
            rotations: [0, -12, 12],
        },
        4: {
            // Four images: scattered grid with varied angles
            positions: [
                [0.35, 0.38],
                [0.68, 0.35],
                [0.32, 0.68],
                [0.65, 0.65],
            ],
            sizes: [0.4, 0.38, 0.38, 0.4],
            rotations: [-6, 8, 10, -4],
        },
        5: {
            // Five images: dynamic scatter with center focus
            positions: [
                [0.5, 0.32],
                [0.28, 0.48],
                [0.72, 0.48],
                [0.35, 0.72],
                [0.65, 0.72],
            ],
            sizes: [0.4, 0.34, 0.34, 0.36, 0.36],
            rotations: [0, -15, 15, -8, 8],
        },
        6: {
            // Six images: organic scatter pattern
            positions: [
                [0.3, 0.28],
                [0.7, 0.28],
                [0.28, 0.52],
                [0.72, 0.52],
                [0.3, 0.76],
                [0.7, 0.76],
            ],
            sizes: [0.36, 0.36, 0.34, 0.34, 0.36, 0.36],
            rotations: [-5, 7, 12, -10, 6, -8],
        },
    };

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get canvas 2D context");
    }

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Get layout for image count
    const layout = layouts[imageUrls.length];

    if (!layout) {
        throw new Error(`No layout found for ${imageUrls.length} images`);
    }

    // Load all images
    const loadedImages = await Promise.all(
        imageUrls.map((url) => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = () => {
                    // Try without CORS if it fails
                    const img2 = new Image();
                    img2.onload = () => resolve(img2);
                    img2.onerror = () =>
                        reject(new Error(`Failed to load image: ${url}`));
                    img2.src = url;
                };
                img.src = url;
            });
        })
    );

    // Draw each image with rotation and enhanced shadows
    loadedImages.forEach((img, idx) => {
        const pos = layout.positions[idx];
        const imgSize = size * layout.sizes[idx];
        const rotation = layout.rotations[idx];
        const centerX = pos[0] * size;
        const centerY = pos[1] * size;
        const radius = 16;

        ctx.save();

        // Translate to center point and rotate
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);

        // Enhanced layered shadow for depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 12;

        // Draw white background with rounded corners
        ctx.beginPath();
        ctx.roundRect(-imgSize / 2, -imgSize / 2, imgSize, imgSize, radius);
        ctx.fillStyle = "#fff";
        ctx.fill();

        // Add subtle inner border for polish
        ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Reset shadow
        ctx.shadowColor = "transparent";

        // Clip to rounded rectangle and draw image
        ctx.beginPath();
        ctx.roundRect(-imgSize / 2, -imgSize / 2, imgSize, imgSize, radius);
        ctx.clip();

        // Scale image to cover square (maintain aspect ratio)
        const scale = Math.max(imgSize / img.width, imgSize / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (imgSize - scaledWidth) / 2;
        const offsetY = (imgSize - scaledHeight) / 2;

        ctx.drawImage(
            img,
            -imgSize / 2 + offsetX,
            -imgSize / 2 + offsetY,
            scaledWidth,
            scaledHeight
        );

        ctx.restore();
    });

    // Return base64 data URL
    return canvas.toDataURL("image/png");
}
