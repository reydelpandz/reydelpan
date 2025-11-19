import { formatPrice } from "@/lib/utils";
import parseHTML from "html-react-parser";
import ImagesCarousel from "@/components/products/ImagesCarousel";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import AddToCart from "@/components/products/AddToCart";
import { prisma } from "@/lib/db";
import ProductsCarousel from "@/components/products/ProductsCarousel";
import { RiStarFill, RiTruckLine } from "@remixicon/react";

const ProductPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}) => {
    const slug = decodeURIComponent((await params).slug);

    const product = await prisma.product.findUnique({
        where: { slug, isHidden: false },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
        },
    });

    const hasDiscount = Number(product?.discountedPrice) > 0;

    if (!product) {
        redirect("/products");
    }

    const productCategoryIds = product.categories.map((cat) => cat.categoryId);

    const similarProducts = await prisma.product.findMany({
        take: 8,
        where: {
            categories: {
                some: {
                    categoryId: {
                        in: productCategoryIds,
                    },
                },
            },
            isHidden: false,
            id: { not: product.id },
        },
        orderBy: { price: "asc" },
    });

    return (
        <main className="container mx-auto pb-8">
            <div className="px-4 pb-8 flex items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
                    {/* Product Images */}
                    <ImagesCarousel product={product} />
                    {/* Product Details */}
                    <div className="flex flex-col gap-6 mt-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">
                                {product.name}
                            </h1>
                            {/* Categories */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {product.categories.map(
                                    ({ category }, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-muted/50 hover:bg-muted"
                                        >
                                            {category.label}
                                        </Badge>
                                    )
                                )}
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <RiStarFill
                                            key={star}
                                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    (0 تقييمات)
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                {/* Replace the price section with this updated version */}
                                <div className="flex items-center gap-3 mb-4">
                                    {hasDiscount ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-primary">
                                                {formatPrice(
                                                    product.discountedPrice!
                                                )}
                                            </span>
                                            {product.discountedPrice! <
                                                product.price && (
                                                <span className="text-base text-muted-foreground line-through">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-primary">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Separator />
                        {/* Shipping Info */}
                        <Card className="bg-secondary-foreground border-none p-4">
                            <div className="flex items-center gap-2">
                                <RiTruckLine className="h-5 w-5 text-secondary" />
                                <span className="text-sm text-secondary">
                                    تكاليف الشحن غير مدرجة في السعر الظاهر
                                </span>
                            </div>
                        </Card>
                        {/* Product Description */}
                        <div>
                            <h2 className="text-xl font-bold mb-2">
                                مواصفات المنتج:
                            </h2>

                            <div className="md:max-h-64 prose md:overflow-y-auto pr-2 text-muted-foreground text-sm leading-relaxed">
                                {parseHTML(product.longDescription)}
                            </div>
                        </div>
                        <Separator />
                        {/* Add to Cart Section */}
                        <AddToCart product={product} />
                    </div>
                </div>
            </div>
            {similarProducts.length > 0 && (
                <ProductsCarousel
                    autoPlay
                    title="منتجات مشابهة"
                    products={similarProducts}
                />
            )}
        </main>
    );
};

export default ProductPage;

export async function generateStaticParams() {
    const products = await prisma.product.findMany({
        where: { isHidden: false },
        select: { slug: true },
    });

    return products;
}
