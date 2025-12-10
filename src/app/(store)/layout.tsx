import AuthModal from "@/components/auth/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import UnderPressureModal from "@/components/UnderPressureModal";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

export default async function StoreLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetch settings for under pressure status
    const settings = await prisma.settings.findFirst();
    const isUnderPressure = settings?.isUnderPressure ?? false;

    return (
        <Suspense fallback={<Loader fullPage />}>
            <div lang="ar" dir="rtl">
                <AuthModal />
                <UnderPressureModal isUnderPressure={isUnderPressure} />
                <Header />
                <div className="w-full">{children}</div>
                <Footer />
            </div>
        </Suspense>
    );
}
