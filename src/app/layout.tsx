import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/context/ReactQueryProvider";
import CartContextProvider from "@/components/context/CartContext";
import { Toaster } from "sonner";
import CartLink from "@/components/CartLink";

const tajawal = Tajawal({
    variable: "--font-tajawal",
    weight: ["200", "300", "400", "500", "700", "800", "900"],
    subsets: ["arabic"],
});

export const metadata: Metadata = {
    title: "Rey del Pan",
    metadataBase: new URL("https://www.rey-del-pan.com"),
    openGraph: {
        images: [
            {
                url: "/social-logo.png",
                width: 1280,
                height: 470,
                alt: "Rey del Pan",
            },
        ],
    },
    description:
        "مخبز متميز يسعى لتقديم أفضل تجربة مخبوزات صحية ولذيذة. نحن نهتم بصحة عملائنا ونقدم مجموعة واسعة من الخبز الطازج والكعك الصحي المصنوع بأيدي خبازين محترفين",
    keywords: ["خبز", "صحي", "Healthy", "القمح الكامل"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body className={`${tajawal.className} antialiased`}>
                <ReactQueryProvider>
                    <CartContextProvider>
                        <div>
                            {children}
                            <CartLink />
                        </div>
                        <Toaster richColors />
                    </CartContextProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
