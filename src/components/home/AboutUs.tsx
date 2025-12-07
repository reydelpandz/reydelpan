"use client";

import { motion } from "motion/react";

const AboutUs = () => {
    return (
        <section className="" id="about">
            {/* Header */}
            <div className="mb-4">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-sm mb-6 bg-primary text-primary-foreground w-fit px-2 py-0.5 rounded-md"
                >
                    ذوق الخبز الحقيقي
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                    className="text-3xl md:text-5xl mb-12 leading-12 md:leading-16"
                >
                    مخبز صحي متميز يقدم تجربة فريدة، حيث الجودة والنكهات
                    الطبيعية تلتقي لتقديم أفضل تجربة طعام صحية ولذيذة
                </motion.h2>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Right Content */}
                <div className="flex flex-col h-full">
                    {/* Top Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 0.6,
                            delay: 0.2,
                            ease: "easeOut",
                        }}
                        className="w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden mb-4"
                    >
                        <img
                            src="/images/photo2.webp"
                            alt="Fresh bread display"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 0.6,
                            delay: 0.35,
                            ease: "easeOut",
                        }}
                        className="text-lg md:text-xl leading-relaxed"
                    >
                        مخبزنا يسعى لتقديم أفضل المخبوزات الصحية والمغذية، مع
                        التركيز على المكونات الطبيعية والخالية من المواد
                        الحافظة.
                        <br /> نقدم خبزًا طازجًا وكعكًا صحيًا مصنوعًا بأيدي
                        خبازين محترفين يهتمون بالتفاصيل والجودة في كل منتج.
                        منتجاتنا متوازنة غذائيًا، غنية بالعناصر المفيدة، طازجة
                        ولذيذة، لتجربة غذاء ممتعة وصحية تضمن التميز في الطعم
                        والفائدة الغذائية مع كل قضمة.
                    </motion.p>
                </div>

                {/* Left Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden"
                >
                    <img
                        src="/images/photo1.webp"
                        alt="Artisan bread"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default AboutUs;
