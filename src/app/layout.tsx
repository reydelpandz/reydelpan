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
    description: "حيث يجتمع الطعم و الصحة في كل قضمة",
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
