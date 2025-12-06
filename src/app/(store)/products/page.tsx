import ProductFilters from "@/components/products/ProductFilters";
import ProductsList from "@/components/products/ProductsList";
import { prisma } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "قائمة المنتجات",
};

const ProductsPage = async () => {
    const products = await prisma.product.findMany({
        where: {
            isHidden: false,
        },
        include: {
            categories: true,
        },
    });

    const categories = await prisma.category.findMany({});

    return (
        <main className="container mx-auto px-2 sm:px-4 pb-6">
            <h1 className="text-2xl font-bold mb-6">قائمة المنتجات</h1>
            <ProductFilters allCategories={categories} />
            <div className="mt-4">
                <ProductsList products={products} />
            </div>
        </main>
    );
};

export default ProductsPage;
