"use client";

import { useState, useRef } from "react";
import { uploadMedia } from "@/app/actions/media";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RiAddLine } from "@remixicon/react";

const MediaUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        try {
            const result = await uploadMedia(formData);
            
            if (result.success) {
                toast.success(result.message);
                setSelectedFiles([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                location.reload();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to upload files");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    <RiAddLine className="size-6" />
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.gif"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {selectedFiles.length > 0 && (
                    <Button onClick={handleUpload} disabled={uploading}>
                        {uploading
                            ? "Uploading..."
                            : `Upload ${selectedFiles.length} file(s)`}
                    </Button>
                )}
            </div>

            {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <p className="text-xs truncate mt-1">{file.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaUpload;
