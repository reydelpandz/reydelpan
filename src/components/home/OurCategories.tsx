import { Category } from "@/generated/prisma";
import Link from "next/link";

interface OurCategoriesProps {
    categories: Category[];
}

const OurCategories = ({ categories }: OurCategoriesProps) => {
    return (
        <section id="categories">
            <h2 className="font-bold text-3xl md:text-5xl mb-12 text-center">
                تصنيفات منتجاتنا
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                {categories.map((category) => (
                    <Link
                        href={`/products?category=${category.id}`}
                        key={category.id}
                        className="w-full relative h-60 md:h-72 group"
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
                ))}
            </div>
        </section>
    );
};

export default OurCategories;
