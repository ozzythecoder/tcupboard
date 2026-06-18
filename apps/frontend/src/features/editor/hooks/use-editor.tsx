import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { type Extension, useEditor } from "@tiptap/react";
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

interface UseThreadEditorParams {
    mode: "compose" | "reply";
    extensionOverrides?: Array<Extension>;
}

export const useThreadEditor = ({ mode, extensionOverrides = [] }: UseThreadEditorParams) => {
    const postEditor = useEditor({
        extensions: extensionOverrides.length > 0 ? extensionOverrides : baseExtensions,
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
