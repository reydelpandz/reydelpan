import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const id = Number((await params).id);

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "EDIT_PRODUCTS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        const { categories, optionChoices, ...productData } = body;

        const choices: { label: string; price: number }[] = (
            optionChoices || []
        ).map((choice: { label: string; price: number }) => ({
            label: String(choice.label),
            price: Number(choice.price),
        }));

        // Keep the base price coherent with the choices so listings/sorting
        // (which use product.price) show the cheapest choice
        if (choices.length > 0) {
            productData.price = Math.min(...choices.map((c) => c.price));
            productData.discountedPrice = 0;
        } else {
            productData.optionName = null;
        }

        await prisma.productCategory.deleteMany({
            where: { productId: id },
        });

        await prisma.productOptionChoice.deleteMany({
            where: { productId: id },
        });

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...productData,

                categories: {
                    create: categories || [],
                },
                optionChoices: {
                    create: choices,
                },
            },
            include: {
                categories: true,
            },
        });

        if (!product) {
            return Response.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath("/(store)/products/[slug]", "page");

        return Response.json({
            message: "Product updated successfully",
        });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = Number((await params).id);

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "DELETE_PRODUCTS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        const product = await prisma.product.delete({
            where: { id },
            include: {
                categories: true,
            },
        });

        if (!product) {
            return Response.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath("/(store)/products/[slug]", "page");

        return Response.json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}
