import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    async rewrites() {
        return [
            {
                source: "/media/:path*",
                destination: "/api/media/:path*",
            },
        ];
    },
};

export default nextConfig;
