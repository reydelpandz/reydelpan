import { prisma } from "@/lib/db";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
    // Fetch settings for under pressure status
    const settings = await prisma.settings.findFirst();
    const isUnderPressure = settings?.isUnderPressure ?? false;

    return <CheckoutClient isUnderPressure={isUnderPressure} />;
}
