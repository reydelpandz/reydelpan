"use client";

import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";

const Award = () => {
    return (
        <section id="award">
            <link
                rel="stylesheet"
                href="https://awards.infcdn.net/delivery_takeaway/delivery_circ_large.css"
                precedence="default"
            />

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Text side */}
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-sm mb-6 bg-primary text-primary-foreground w-fit px-2 py-0.5 rounded-md"
                    >
                        تتويج 2026
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                        className="font-bold text-3xl md:text-5xl mb-6 leading-12 md:leading-16"
                    >
                        أفضل مأكولات جاهزة في البليدة
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="text-lg md:text-xl leading-relaxed mb-8"
                    >
                        توّجنا موقع Restaurant Guru بجائزة أفضل مأكولات جاهزة
                        لسنة 2026، تقديرًا لجودة خبزنا وبيتزاتنا ولمكوناتنا
                        الطبيعية الصحية.
                        <br />
                        شكرًا لثقتكم التي جعلت هذا التتويج ممكنًا.
                    </motion.p>

                    <motion.img
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        loading="lazy"
                        src="/images/award-banner.webp"
                        alt="Rey del Pan - Best takeaway food, Restaurant Guru 2026"
                        className="w-full rounded-lg mb-8"
                    />

                    <div className="flex flex-wrap items-center gap-6">
                        <div id="delivery_bage_circ" className="en" dir="ltr">
                            <div className="bage_wrapper">
                                <div
                                    className="bage_icon"
                                    style={{
                                        background:
                                            "url('https://restaurantguru.com/css/badge/img/takeaway_red.svg') no-repeat center center",
                                    }}
                                >
                                    &nbsp;
                                </div>
                                <a
                                    className="bage_header"
                                    href="https://restaurantguru.com/rey-del-pan-Blida-2"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    rey del pan
                                </a>
                                <div className="bage_city">
                                    <span>Best takeaway food</span>
                                    <span className="bage_city_name">
                                        in Blida
                                    </span>
                                </div>
                                <a
                                    className="bage_title"
                                    href="https://restaurantguru.com"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <span>on Restaurant Guru</span>
                                    <span>2026</span>
                                </a>
                            </div>
                        </div>

                        <a
                            className={buttonVariants({ className: "px-8" })}
                            href="https://restaurantguru.com/rey-del-pan-Blida-2"
                            target="_blank"
                            rel="noopener"
                        >
                            صفحتنا على Restaurant Guru
                        </a>
                    </div>
                </div>

                {/* Certificate side */}
                <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    loading="lazy"
                    src="/images/award-certificate.webp"
                    alt="شهادة Restaurant Guru 2026 - أفضل مأكولات جاهزة في البليدة"
                    className="w-full max-h-[700px] object-contain rounded-lg"
                />
            </div>
        </section>
    );
};

export default Award;
