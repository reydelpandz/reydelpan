"use client";

import MediaUpload from "./MediaUpload";

const MediaHeader = () => {
    return (
        <div className="flex items-center justify-between py-4">
            <div></div>

            <MediaUpload />
        </div>
    );
};

export default MediaHeader;
