import CategoryModal from "@/components/administration/categories/CategoryModal";
import CategoriesTable from "@/components/administration/categories/CategoriesTable";
import CategoriesHeader from "@/components/administration/categories/CategoriesHeader";
import DeleteCategoryModal from "@/components/administration/categories/DeleteCategoryModal";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { Role } from "@/generated/prisma";
import { getMediaFiles } from "@/lib/media";

const CategoriesPage = async () => {
    const authSession = await getServerSession();

    if (!hasPermission(authSession?.user.role as Role, "VIEW_CATEGORIES")) {
        redirect("/administration/login");
    }

    const categories = await prisma.category.findMany({
        orderBy: { label: "asc" },
    });

    const mediaFiles = await getMediaFiles();

    return (
        <>
            <CategoryModal mediaFiles={mediaFiles} />
            <DeleteCategoryModal />

            <h1 className="page-title">Categories</h1>
            <div className="container mx-auto px-4 py-2">
                <CategoriesHeader />
                <CategoriesTable categories={categories} />
            </div>
        </>
    );
};

export default CategoriesPage;
