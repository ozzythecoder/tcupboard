import type { Editor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import { Link2, TableOfContents } from "lucide-react";

const TEST_CONTENT = [
    {
        type: "bulletList",
        content: [
            {
                type: "listItem",
                content: [
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "let's have a toast to the " },
                            { type: "text", marks: [{ type: "italic" }], text: "dirtbags" },
                        ],
                    },
                ],
            },
            {
                type: "listItem",
                content: [
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "let's have a toast to the " },
                            { type: "text", marks: [{ type: "bold" }], text: "assholes" },
                        ],
                    },
                ],
            },
            {
                type: "listItem",
                content: [
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "let's have a toast to the " },
                            { type: "text", marks: [{ type: "strike" }], text: "scumbags" },
                        ],
                    },
                ],
            },
            {
                type: "listItem",
                content: [
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: "everyone of them that i know!!!!" }],
                    },
                ],
            },
        ],
    },
    { type: "paragraph" },
    {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "baby i got a plan..." }],
    },
    {
        type: "codeBlock",
        attrs: { language: null },
        content: [{ type: "text", text: "waeffawef\\n" }],
    },
    { type: "paragraph", content: [{ type: "text", text: "asd)faljf)asdjf)" }] },
];

export function EditorBubbleMenu({ editor }: { editor: Editor }) {
    return (
        <BubbleMenu editor={editor} className="grid grid-cols-4 place-content-center">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                type="button"
                className="font-serif w-8 bold text-sm border-surface-400-600 bg-surface-100-900 border rounded-sm"
            >
                B
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                type="button"
                className="font-serif w-8 italic text-sm border-surface-400-600 bg-surface-100-900 border rounded-sm"
            >
                I
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                type="button"
                className="font-serif w-8 underline text-sm border-surface-400-600 bg-surface-100-900 border rounded-sm"
            >
                U
            </button>
            <button
                type="button"
                className="w-8 border-surface-400-600 bg-surface-100-900 border rounded-sm text-center"
                onClick={() => editor.chain().focus().toggleLink().run()}
            >
                <Link2 className="size-4 mx-auto" />
            </button>
        </BubbleMenu>
    );
}

export function EditorFloatingMenu({ editor }: { editor: Editor }) {
    return (
        <FloatingMenu editor={editor} className="flex flex-row gap-2 _tiptap-floating-menu">
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
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <TableOfContents className="rotate-180 size-4" />
            </button>
            {import.meta.env.DEV && (
                <button type="button" onClick={() => editor.commands.setContent(TEST_CONTENT)}>
                    test
                </button>
            )}
        </FloatingMenu>
    );
}
