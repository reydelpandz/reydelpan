import ProductModal from "@/components/administration/products/ProductModal";
import ProductsTable from "@/components/administration/products/ProductsTable";
import ProductsHeader from "@/components/administration/products/ProductsHeader";
import DeleteProductModal from "@/components/administration/products/DeleteProductModal";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { Role } from "@/generated/prisma";
import { getMediaFiles } from "@/lib/media";

const ProductsPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const session = await getServerSession();

    if (!hasPermission(session?.user.role as Role, "VIEW_PRODUCTS")) {
        redirect("/administration/login");
    }

    const page = parseInt((await searchParams).page || "1");
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [products, totalProducts] = await Promise.all([
        prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                categories: true,
            },
            skip,
            take: pageSize,
        }),
        prisma.product.count(),
    ]);

    const totalPages = Math.ceil(totalProducts / pageSize);

    const categories = await prisma.category.findMany();
    const mediaFiles = await getMediaFiles();

    return (
        <>
            <ProductModal mediaFiles={mediaFiles} allCategories={categories} />
            <DeleteProductModal />

            <h1 className="page-title">Products</h1>
            <div className="container mx-auto px-4 py-2">
                <ProductsHeader />
                <ProductsTable
                    products={products}
                    currentPage={page}
                    totalPages={totalPages}
                />
            </div>
        </>
    );
};

export default ProductsPage;
