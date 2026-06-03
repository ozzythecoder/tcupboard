import { Fragment } from "react/jsx-runtime";
import { Tiptap } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import { Link2, TableOfContents } from "lucide-react";

import { useReplyEditor } from "../hooks/editor";
import "./Editor.css";
import { useNewReplyMutation } from "../api";
import { useNavigate } from "@tanstack/react-router";

export function Editor() {
    const editor = useReplyEditor();
    const replier = useNewReplyMutation();
    const navigate = useNavigate();

    const handleReply = async () => {
        const content = editor.getJSON();
        const res = replier.mutate(content, {
            onError: (e) => {
                console.error(e);
            },
            onSuccess: () => {
                console.log("NICE!!!");
            },
        });
    };

    return (
        <Fragment>
            <Tiptap editor={editor}>
                <Tiptap.Content />
                <BubbleMenu
                    editor={editor}
                    className="bg-surface-100-900 grid grid-cols-4 place-content-center"
                >
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        type="button"
                        className="font-serif w-8 bold text-sm border-surface-400-600 border rounded-sm"
                    >
                        B
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        type="button"
                        className="font-serif w-8 italic text-sm border-surface-400-600 border rounded-sm"
                    >
                        I
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        type="button"
                        className="font-serif w-8 underline text-sm border-surface-400-600 border rounded-sm"
                    >
                        U
                    </button>
                    <button
                        type="button"
                        className="w-8 border-surface-400-600 border rounded-sm text-center"
                        onClick={() => editor.chain().focus().toggleLink().run()}
                    >
                        <Link2 className="size-4 mx-auto" />
                    </button>
                </BubbleMenu>

                <FloatingMenu editor={editor} className="flex flex-row gap-2">
                    <button
                        type="button"
                        className="text-xs"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        className="text-xs"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    >
                        H3
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <TableOfContents className="rotate-180 size-4" />
                    </button>
                </FloatingMenu>
            </Tiptap>
            <div className="flex flex-row-reverse pr-2 pt-2">
                <button type="button" className="btn preset-tonal-primary" onClick={handleReply}>
                    Reply
                </button>
            </div>
        </Fragment>
    );
}
