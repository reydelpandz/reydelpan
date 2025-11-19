import HeroBanners from "@/components/home/HeroBanners";
import { prisma } from "@/lib/db";
import AboutUs from "@/components/home/AboutUs";
import Reviews from "@/components/home/Reviews";
import OurLocations from "@/components/home/OurLocations";
import ProductsCarousel from "@/components/products/ProductsCarousel";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import FAQ from "@/components/home/FAQ";
import OurCategories from "@/components/home/OurCategories";

const Home = async () => {
    const featuredProducts = await prisma.product.findMany({
        where: { quantity: { gt: 0 } },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        take: 8,
    });

    const categories = await prisma.category.findMany({
        orderBy: { priority: "desc" },
        where: { priority: { gt: -1 } },
    });

    return (
        <main className="home">
            <HeroBanners />
            <div>
                <AboutUs />
                <div className="w-full bg-primary/5">
                    <OurCategories categories={categories} />
                </div>

                <section>
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="font-bold text-3xl md:text-5xl text-center mb-6">
                            منتجاتنا الأكثر طلبًا
                        </h2>
                        <Link
                            className={buttonVariants({
                                className: "px-8",
                            })}
                            href="/products"
                        >
                            كل المنتوجات
                        </Link>
                    </div>
                    <ProductsCarousel products={featuredProducts} />
                </section>

                <div className="w-full bg-primary/5">
                    <Reviews />
                </div>

                <FAQ />

                <div className="w-full bg-primary/5">
                    <OurLocations />
                </div>
            </div>
        </main>
    );
};

export default Home;
