import { type Editor as IEditor, Tiptap } from "@tiptap/react";
import { Fragment } from "react/jsx-runtime";
import { EditorBubbleMenu } from "./menus";

interface Props {
    editor: IEditor;
}

export function Editor({ editor }: Props) {
    return (
        <Fragment>
            <Tiptap editor={editor}>
                <Tiptap.Content />
                <EditorBubbleMenu editor={editor} />
            </Tiptap>
            <p className="text-xs text-right">
                <a
                    className="anchor underline"
                    href="https://www.markdownlang.com/cheatsheet/"
                    rel="noopener noreferer"
                    target="_blank"
                >
                    Markdown format
                </a>{" "}
                is supported.
            </p>
        </Fragment>
    );
}
