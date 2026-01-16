import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RiThumbUpFill, RiCheckboxFill } from "@remixicon/react";

const ThankYou = () => {
    return (
        <div
            className="flex min-h-screen items-center justify-center p-4 bg-muted/30"
            dir="rtl"
        >
            <Card className="max-w-2xl w-full shadow-lg">
                <CardHeader className="flex flex-col items-center space-y-4 pb-2">
                    <div className="p-3">
                        <RiThumbUpFill className="size-16 text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">
                        شكراً جزيلاً على ثقتكم
                    </h1>
                    <div className="bg-green-400 text-white px-6 py-2 rounded-full text-sm font-semibold">
                        تم استلام الطلب بنجاح!
                    </div>
                </CardHeader>

                <CardContent className="text-center space-y-6 pb-8 px-6">
                    <div className="text-right space-y-2">
                        <p className="leading-relaxed">
                            <RiCheckboxFill className="inline size-5 text-primary ml-1" />
                            <span className="text-primary font-semibold">
                                أُقرّ بأنني سوف أرد على الهاتف وأستلم الطلب
                            </span>{" "}
                            وأعلم أن عدم استلامي له{" "}
                            <span className="text-destructive font-semibold">
                                يسبب لكم خسائر كبيرة
                            </span>
                            ،
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            سيتم الإتصال بك بهذا الرقم{" "}
                            <span
                                dir="ltr"
                                className="text-primary font-semibold"
                            >
                                0664578369
                            </span>{" "}
                            لتأكيد طلبك في الساعات القليلة القادمة.
                        </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 text-right space-y-2">
                        <p className="leading-relaxed">
                            <span className="font-bold text-foreground">
                                ملاحظة مهمة :
                            </span>{" "}
                            <span className="text-muted-foreground">
                                يرجى إبقاء هاتفك مفتوح والرد على الإتصالات حتى
                                نتمكن من تأكيد طلبك
                            </span>{" "}
                            <span className="text-primary font-semibold">
                                (لن يتم إرسال الطلب بدون تأكيده هاتفياً)
                            </span>
                        </p>
                    </div>

                    <div className="space-y-2 pt-2">
                        <p className="text-2xl font-bold text-foreground tracking-wide">
                            06 64 57 83 69
                        </p>
                        <p className="text-primary font-semibold">
                            السبت .. الخميس / 9 صباحاً .. 6 مساءً
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ThankYou;
