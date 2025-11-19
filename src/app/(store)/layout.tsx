import AuthModal from "@/components/auth/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export default function StoreLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense fallback={<Loader fullPage />}>
            <div lang="ar" dir="rtl">
                <AuthModal />
                <Header />
                <div className="w-full">{children}</div>
                <Footer />
            </div>
        </Suspense>
    );
}
