import { convertFromRaw, type RawDraftContentState } from "draft-js";
import htmlToJsx, { type HTMLReactParserOptions, Element } from "html-react-parser";
import * as draftJsHtml from "draft-js-export-html";

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
export function DraftJsContent({ rawContent }: { rawContent: string }) {
    let contentIn: RawDraftContentState;
    try {
        contentIn = JSON.parse(rawContent) as RawDraftContentState;
    } catch (_) {
        return <p>{rawContent}</p>;
    }
    const content = convertFromRaw(contentIn);
    let html = draftJsHtml.stateToHTML(content);

    html = replaceQuotes(html);

    return htmlToJsx(html, htmlToJsxOptions);
}

/**
 * Searches for quote blocks like `[QUOTE]content[/QUOTE]` and replaces them with a `<blockquote>` element.
 */
function replaceQuotes(html: string) {
    const quoteRegex = new RegExp(/(\[QUOTE\S*\]{1})(.*?)(\[\/QUOTE\])/gs);
    if (quoteRegex.test(html)) {
        return html.replace(quoteRegex, (_match, _1, content) => {
            return `<blockquote>${content}</blockquote>`;
        });
    }
    return html;
}

export function TipTapContent() {}

export function convertToTipTap() {}
