"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useRef } from "react";
import { buttonVariants } from "../ui/button";
import { motion } from "motion/react";

export const HeroBanners = () => {
    const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

    return (
        <Carousel
            opts={{ active: false }}
            className="w-full mb-4"
            plugins={[plugin.current]}
        >
            <CarouselContent>
                <CarouselItem>
                    <div className="w-full h-[calc(100dvh-96px)] flex items-center relative bg-[url(/images/banner1.jpg)] bg-cover bg-center">
                        <div className="container text-center mx-auto text-white z-3">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="font-black text-4xl md:text-7xl mb-8 md:mb-12"
                            >
                                حيث يجتمع الطعم و الصحة في كل قضمة
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.25 }}
                                className="text-lg sm:text-xl max-w-4xl font-medium mx-auto mb-8"
                            >
                                استمتع بمخبوزات Rey del Pan الصحية والطازجة
                                المصنوعة من مكونات طبيعية وبأعلى معايير الجودة
                                لنقدم لك نكهة أصيلة وتجربة غذائية متوازنة كل يوم
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                <Link
                                    href="/products"
                                    className={buttonVariants({
                                        size: "lg",
                                        className: "text-base!",
                                    })}
                                >
                                    تسوّق الآن
                                </Link>
                            </motion.div>
                        </div>
                        <div className="h-full w-full bg-black opacity-30 absolute inset-0 z-2" />
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
};

export default HeroBanners;
