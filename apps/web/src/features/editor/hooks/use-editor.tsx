import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { type Extension, type Content as TipTapContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const baseExtensions = [
    StarterKit.configure({
        heading: {
            levels: [2, 3],
        },
        link: {
            openOnClick: false,
            enableClickSelection: true,
            autolink: true,
            defaultProtocol: "https",
            isAllowedUri: (url, ctx) => {
                try {
                    const parsedUrl = url.includes(":")
                        ? new URL(url)
                        : new URL(`${ctx.defaultProtocol}://${url}`);

                    const allowedProtocols = ["http", "https"];
                    const protocol = parsedUrl.protocol.replace(":", "");

                    if (!ctx.defaultValidate(parsedUrl.href)) {
                        return false;
                    }

                    if (!allowedProtocols.includes(protocol)) {
                        return false;
                    }
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            },
        },
    }),
    Placeholder.configure({
        placeholder: "Write something...",
    }),
    Image.configure({
        resize: {
            enabled: true,
            directions: ["top", "bottom", "left", "right"],
            alwaysPreserveAspectRatio: true,
            minHeight: 50,
            minWidth: 50,
        },
        HTMLAttributes: {
            class: "max-w-5",
        },
    }),
];

interface BaseEditorProps {
    placeholderText?: string;
    headings?: boolean;
    editorClass?: string;
    update?: (json: any) => void;
    content: TipTapContent;
    extensions?: Array<Extension>;
}

export const useBaseEditor = (
    { placeholderText, headings, update, content, editorClass, extensions }: BaseEditorProps = {
        placeholderText: "Write something...",
        headings: false,
        content: null,
    },
) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: headings ? { levels: [1, 2, 3] } : false,
            }),
            Placeholder.configure({
                placeholder: placeholderText,
            }),
            ...(extensions ?? []),
        ],
        onUpdate: ({ editor }) => {
            if (update) {
                const j = editor.getJSON();
                update(j);
            }
        },
        editorProps: {
            attributes: {
                class: editorClass ?? "preset-glass-surface-200-800",
            },
        },
        content,
    });

    return editor;
};

interface UseThreadEditorParams {
    mode: "compose" | "reply";
    extensionOverrides?: Array<Extension>;
}

export const useThreadEditor = ({ mode, extensionOverrides = [] }: UseThreadEditorParams) => {
    const postEditor = useEditor({
        extensions: extensionOverrides.length > 0 ? extensionOverrides : baseExtensions,
        editorProps: {
            attributes: {
                class: "preset-glass-surface-200-800",
            },
        },
    });

    const replyEditor = postEditor; // until I need something else

    switch (mode) {
        case "compose": {
            return postEditor;
        }
        case "reply": {
            return replyEditor;
        }
    }
};
