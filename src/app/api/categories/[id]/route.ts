import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = Number((await params).id);

        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            return Response.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        return Response.json({ category });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const id = Number((await params).id);

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "EDIT_CATEGORIES")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        const category = await prisma.category.update({
            where: { id },
            data: body,
        });

        if (!category) {
            return Response.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        revalidatePath("/");
        revalidatePath("/products");

        return Response.json({
            message: "Category updated successfully",
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

        if (
            !hasPermission(authSession?.user.role as Role, "DELETE_CATEGORIES")
        ) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        const assignedProductsCount = await prisma.product.count({
            where: {
                categories: {
                    some: {
                        categoryId: id,
                    },
                },
            },
        });

        if (assignedProductsCount > 0) {
            return Response.json(
                {
                    message: `This category is currently assigned to ${assignedProductsCount} product(s) and cannot be deleted.`,
                },
                { status: 400 }
            );
        }

        const category = await prisma.category.delete({
            where: { id },
        });

        // ! Prisma will throw an error anyway if thre's no product to delete, same for rest of similar ueries
        if (!category) {
            return Response.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        revalidatePath("/");
        revalidatePath("/products");

        return Response.json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}
