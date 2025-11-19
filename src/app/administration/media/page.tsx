import { getMediaFiles } from "@/lib/media";
import { MediaGrid } from "@/components/administration/media/MediaGrid";
import { getServerSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma";
import MediaHeader from "@/components/administration/media/MediaHeader";
import DeleteMediaModal from "@/components/administration/media/DeleteMediaModal";

const MediaPage = async () => {
    const session = await getServerSession();

    if (!hasPermission(session?.user.role as Role, "VIEW_MEDIA")) {
        redirect("/administration/login");
    }
    const files = await getMediaFiles();

    return (
        <>
            <h1 className="page-title">Media</h1>
            <div className="container mx-auto px-4 py-2">
                <MediaHeader />
                <MediaGrid files={files} />
            </div>
            <DeleteMediaModal />
        </>
    );
};

export default MediaPage;
