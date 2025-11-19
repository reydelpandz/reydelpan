import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { buttonVariants } from "../ui/button";
import { RiCheckboxCircleLine } from "@remixicon/react";
import Link from "next/link";

const ThankYou = () => {
    return (
        <div
            className="flex min-h-screen items-center justify-center p-4"
            dir="rtl"
        >
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                    <div className="p-3 mb-2">
                        <RiCheckboxCircleLine className="h-12 w-12 text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">
                        شكراً لطلبك!
                    </h1>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground pb-4 space-y-3">
                    <p>
                        .نشكرك على شرائك. تمت معالجة طلبك بنجاح وسيتم شحنه
                        قريباً.
                    </p>
                    <p>
                        يرجى الحفاظ على هاتفكم{" "}
                        <span className="font-semibold">مسموعاً</span> لتلقي
                        تحديثات الطلب.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                    <Link className={buttonVariants()} href="/">
                        العودة إلى الصفحة الرئيسية
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ThankYou;
