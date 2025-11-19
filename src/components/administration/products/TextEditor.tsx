"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./tiptap.css";
import { useEffect } from "react";
import {
    RiListUnordered,
    RiListOrdered,
    RiBold,
    RiH3,
    RiH4,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";

interface Props {
    text: string;
    onChange: (richText: string) => void;
}

const TextEditor = ({ onChange, text }: Props) => {
    const editor = useEditor({
        extensions: [StarterKit.configure()],
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "min-h-[250px] rounded-md border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition",
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    const togglesData = [
        {
            icon: RiH3,
            action: () =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor?.isActive("heading", { level: 3 }),
        },
        {
            icon: RiH4,
            action: () =>
                editor?.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: () => editor?.isActive("heading", { level: 4 }),
        },
        {
            icon: RiBold,
            action: () => editor?.chain().focus().toggleBold().run(),
            isActive: () => editor?.isActive("bold"),
        },
        {
            icon: RiListUnordered,
            action: () => editor?.chain().focus().toggleBulletList().run(),
            isActive: () => editor?.isActive("bulletList"),
        },
        {
            icon: RiListOrdered,
            action: () => editor?.chain().focus().toggleOrderedList().run(),
            isActive: () => editor?.isActive("orderedList"),
        },
    ];

    useEffect(() => {
        if (editor && editor.getHTML() !== text) {
            editor.commands.setContent(text);
        }
    }, [text, editor]);

    return (
        <div className="flex flex-col justify-stretch gap-1.5">
            <div className="flex gap-1 rounded-md border border-input bg-white p-1.5">
                {togglesData.map((toggle, idx) => (
                    <Button
                        type="button"
                        size="icon"
                        variant={toggle.isActive?.() ? "default" : "outline"}
                        key={idx}
                        onClick={toggle.action}
                    >
                        <toggle.icon style={{ width: 18, height: 18 }} />
                    </Button>
                ))}
            </div>
            <EditorContent className="tiptap" editor={editor} />
        </div>
    );
};

export default TextEditor;
