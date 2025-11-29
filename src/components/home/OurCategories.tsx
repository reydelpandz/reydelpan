"use client";

import { Category } from "@/generated/prisma";
import Link from "next/link";
import { motion } from "motion/react";

interface OurCategoriesProps {
    categories: Category[];
}

const OurCategories = ({ categories }: OurCategoriesProps) => {
    return (
        <section id="categories" className="overflow-x-hidden">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="font-bold text-3xl md:text-5xl mb-12 text-center"
            >
                تصنيفات منتجاتنا
            </motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                        transition={{
                            duration: 0.7,
                            delay: index * 0.15,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    >
                        <Link
                            href={`/products?category=${category.id}`}
                            className="w-full relative h-60 md:h-72 group block"
                        >
                            <img
                                className="size-full object-cover rounded-md "
                                src={category.image ?? "/placeholder.svg"}
                                alt={category.label}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-primary/20 transition duration-300 rounded-md size-full" />
                            <h4 className="absolute text-center font-black text-3xl md:text-4xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white group-hover:text-primary-foreground transition duration-300">
                                {category.label}
                            </h4>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default OurCategories;
