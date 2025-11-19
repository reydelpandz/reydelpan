"use client";
import { RiDoubleQuotesR } from "@remixicon/react";
import Marquee from "react-fast-marquee";

const Reviews = () => {
    const reviews = [
        {
            customerPhoto: "/illustrations/avatar.png",
            customerName: "Sid Ahmed",
            review: "أكل رائع وصحي، الجو العام جد رائع اصحاب المحل مهذبين واستقبال في المستوى بالابتسامة واحترافية وللمهتمين بالاكل الصحي هذه المفروض وجهة في هرم الاولويات",
        },
        {
            customerPhoto: "/illustrations/avatar.png",
            customerName: "Amar Nadder",
            review: "فوق الخيال. بارك الله لكم في المشروع.",
        },
        {
            customerPhoto: "/illustrations/avatar.png",
            customerName: "Houda Bassi",
            review: "خبز صحي رائع من أروع ماتذوقت. بارك الله فيكم فرع الشراقة. استقبال حفاوة توجيه و إجابة على التساؤلات بصدر رحب",
        },
        {
            customerPhoto: "/illustrations/avatar.png",
            customerName: "Leb Bilel",
            review: "تجربة ممتازة! الخبز الصحي لذيذ للغاية، وأعجبني اهتمامهم باستخدام مكونات طبيعية. أوصي به بشدة لكل من يبحث عن خيارات صحية ولذيذة في نفس الوقت.",
        },
        {
            customerPhoto: "/illustrations/avatar.png",
            customerName: "Mourad Kha",
            review: "من دواعي الغبطة والسرور أن تجد مثل هذا الإنسان الرائع الذي يقدم منتجات صحية طبيعية 100 ٪ وفي نفس الوقت لذيذة الطعم.. عمل احترافي بأتم معنى الكلمة.",
        },
        {
            customerPhoto: "/illustrations/avatar.png",
            customerName: "Hakim Mokhtari",
            review: "ملك الخبز بجدارة بارك الله فيك وبارك الله لك في مالك جزاكم الله خيرا",
        },
    ];

    return (
        <section className="">
            <h2 className="font-bold text-3xl md:text-5xl mb-12 text-center">
                ماذا يقول عنا زبائننا
            </h2>
            <div dir="ltr">
                <Marquee className="pb-24">
                    {reviews.map((review) => (
                        <div
                            className="bg-card border-primary overflow-visible relative border-1 rounded-md flex flex-col gap-4 items-center justify-start mx-8 h-80 w-96 p-7"
                            dir="rtl"
                        >
                            <RiDoubleQuotesR className="size-16 text-primary" />
                            <p className="text-center text-lg leading-7">
                                {review.review}
                            </p>
                            <div className="absolute z-10 -bottom-[70px] flex flex-col gap-2 items-center left-1/2 -translate-x-1/2">
                                <img
                                    className="rounded-full size-20"
                                    src={review.customerPhoto}
                                    alt={review.customerName}
                                />
                                <span className="font-bold">
                                    {review.customerName}
                                </span>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default Reviews;
