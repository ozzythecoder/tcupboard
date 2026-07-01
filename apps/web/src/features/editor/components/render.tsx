import {
    type TipTapContent as ITipTapContent,
    ZThreadDraftJsJsonSchema,
    ZThreadTipTapJsonSchema,
} from "@repo/shared";
import type { JSONContent } from "@tiptap/react";
import { renderToReactElement } from "@tiptap/static-renderer";
import { convertFromRaw, type RawDraftContentState } from "draft-js";
import * as draftJsHtml from "draft-js-export-html";
import htmlToJsx, { Element, type HTMLReactParserOptions } from "html-react-parser";
import { baseExtensions } from "../hooks/use-editor";

const htmlToJsxOptions: HTMLReactParserOptions = {
    replace: (node) => {
        if (node instanceof Element && node.name === "a") {
            node.attribs = {
                ...node.attribs,
                target: "_blank",
                rel: "noopener noreferrer",
            };
        }
    },
};

/**
 * Renders content from Draft.js JSON format to JSX.
 */
export function DraftJsContent({ rawContent }: { rawContent: RawDraftContentState }) {
    const content = convertFromRaw(rawContent);
    let html = draftJsHtml.stateToHTML(content);

    html = replaceQuotes(html);

    return htmlToJsx(html, htmlToJsxOptions);
}

/**
 * Searches for quote blocks like `[QUOTE]content[/QUOTE]` and replaces them with a `<blockquote>` element.
 */
function replaceQuotes(html: string) {
    const quoteRegex = new RegExp(/(\[QUOTE="[^"]+"\]{1})(.*?)(\[\/QUOTE\])/gsu);
    if (quoteRegex.test(html)) {
        return html.replace(quoteRegex, (_match, _1, content) => {
            return `<blockquote>${content}</blockquote>`;
        });
    }
    return html;
}

export function TipTapContent({ doc }: { doc: { content: JSONContent[] } }) {
    return renderToReactElement({
        content: doc,
        extensions: baseExtensions,
    });
}

/**
 * Determines source of content (DraftJs, Tiptap, or simple string) and renders it accordingly.
 *
 * Returns null if passed invalid content.
 */
export function RichTextContent({ content }: { content: unknown }) {
    if (typeof content !== "string" && typeof content !== "object") {
        return null;
    }
    try {
        const parsed = typeof content === "string" ? JSON.parse(content) : content;
        if (isTipTap(parsed)) {
            return <TipTapContent doc={parsed} />;
        }
        if (isDraftJs(parsed)) {
            return <DraftJsContent rawContent={parsed} />;
        }
    } catch (_) {}
    console.warn("Could not parse rich text content. Returning as string.");
    const parsedContent = String(content).replace(/(\n){2,}/g, "\n"); // strip multiple newlines into just one
    return <div className="whitespace-pre-wrap">{parsedContent}</div>;
}

/**
 * Narrow and convert rich text content to a format that works for the initial
 * editor state. Will return JSON-parsed content if valid TipTap, otherwise
 * will return as a plain string. Returns null for invalid input.
 */
export function convertToEditorInitState(richText: unknown): string | ITipTapContent | null {
    if (!richText) return null;
    if (typeof richText !== "string" && typeof richText !== "object") {
        return null;
    }
    try {
        const content = JSON.parse(richText as string);
        if (isTipTap(content)) {
            return content;
        }
    } catch (_) {
        console.warn("Did not parse valid JSON from rich text content. Returning as plain text.");
    }
    return String(richText);
}

const isDraftJs = (content: unknown): content is RawDraftContentState => {
    const result = ZThreadDraftJsJsonSchema.safeParse(content);
    return result.success;
};

const isTipTap = (doc: unknown): doc is { type: "doc"; content: JSONContent[] } => {
    const result = ZThreadTipTapJsonSchema.safeParse(doc);
    return result.success;
};
