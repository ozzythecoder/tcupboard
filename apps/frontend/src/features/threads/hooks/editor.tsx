import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [
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
];

export const usePostEditor = () =>
    useEditor({
        content: `<p>New post</p>`,
        extensions,
    });

export const useReplyEditor = () =>
    useEditor({
        content: `<p>Reply</p>`,
        extensions,
    });
