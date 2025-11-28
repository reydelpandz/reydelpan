"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const FAQ = () => {
    const data = [
        {
            question: "ما الذي يميز مخبزكم عن غيره؟",
            answer: "نحن نركز على إعداد الخبز والمعجنات باستخدام مكونات طبيعية وصحية مع تقليل السكريات والدهون قدر الإمكان، مع الحفاظ على الطعم اللذيذ والجودة العالية.",
        },
        {
            question: "هل تستخدمون دقيقًا كاملًا في منتجاتكم؟",
            answer: "نعم، نعتمد في العديد من وصفاتنا على الدقيق الكامل الغني بالألياف لدعم نظام غذائي صحي ومتوازن.",
        },
        {
            question: "هل تقدمون خيارات لمرضى السكري؟",
            answer: "نعم، نوفر مجموعة من المنتجات الخالية من السكر المضاف والمناسبة لمرضى السكري أو لمن يتبعون نظامًا غذائيًا منخفض السكر.",
        },
        {
            question: "هل تحتوي منتجاتكم على مواد حافظة؟",
            answer: "لا، نحن لا نستخدم أي مواد حافظة صناعية. جميع منتجاتنا طازجة وتُحضّر يوميًا.",
        },
    ];

    return (
        <section className="max-w-5xl" id="faq">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="font-bold text-3xl md:text-5xl mb-12 text-center"
            >
                الأسئلة الشائعة
            </motion.h2>
            <Accordion
                type="single"
                collapsible
                className="w-full flex flex-col gap-6"
            >
                {data.map((qa, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.5,
                            delay: idx * 0.1,
                            ease: "easeOut",
                        }}
                    >
                        <AccordionItem value={qa.question}>
                            <AccordionTrigger className="font-bold text-base p-4 py-4 bg-card text-card-foreground border-1 border-primary">
                                {qa.question}
                            </AccordionTrigger>
                            <AccordionContent className="flex text-base bg-card text-card-foreground border-primary border-1 flex-col gap-4 text-balance">
                                {qa.answer}
                            </AccordionContent>
                        </AccordionItem>
                    </motion.div>
                ))}
            </Accordion>
        </section>
    );
};

export default FAQ;
