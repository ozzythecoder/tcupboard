import type { CreateThreadReplySchema, CreateThreadSchema, User } from "@repo/shared";
import { Tiptap } from "@tiptap/react";
import { LoaderCircle } from "lucide-react";
import { type ChangeEvent, Fragment, useState } from "react";
import { isAppError } from "#/config/error";
import { useThreadEditor } from "#/features/editor/hooks/use-editor";
import { toCreateReplyRequest, toCreateThreadRequest } from "#/types/mappers/thread";
import { useError } from "#/utils/hooks";
import { EditorBubbleMenu, EditorFloatingMenu } from "./menus";

import "./Editor.css";

type EditorMode =
    | {
          mode: "compose";
          onSave: (json: CreateThreadSchema) => Promise<unknown>;
          metadata: {
              parentThreadId?: never;
          };
      }
    | {
          mode: "reply";
          onSave: (json: CreateThreadReplySchema) => Promise<unknown>;
          metadata: {
              parentThreadId: number;
          };
      };

type EditorProps = EditorMode & {
    isSaving: boolean;
    metadata: {
        user: User;
    };
};

export const editorOptions = (props: EditorProps): EditorProps => {
    return props;
};

export function ThreadEditor({ metadata, mode, onSave, isSaving }: EditorProps) {
    const [title, setTitle] = useState<string>("");
    const { setError, clearError, ErrorMessage } = useError();
    const editor = useThreadEditor({ mode });
    editor.on("update", clearError);

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleReply = async () => {
        const doc = editor.getJSON();
        const mapped =
            mode === "compose"
                ? toCreateThreadRequest({
                      id: String(metadata.user.id),
                      author: metadata.user.username,
                      doc,
                      title,
                  })
                : toCreateReplyRequest({
                      id: String(metadata.user.id),
                      author: metadata.user.username,
                      doc,
                      parent_id: metadata.parentThreadId,
                  });

        try {
            await onSave(mapped);
            editor.commands.clearContent();
        } catch (e) {
            console.error(e);
            setError(getErrorMessage(e));
        }
    };

    return (
        <Fragment>
            <Tiptap editor={editor}>
                {mode === "compose" && (
                    <input
                        type="text"
                        value={title}
                        onChange={changeTitle}
                        className="input drop-shadow-2xl bg-surface-50-950 focus:ring-surface-800-200 focus:outline-none h3 text-lg py-2 my-6"
                    />
                )}
                <Tiptap.Content />
                <EditorBubbleMenu editor={editor} />
                <EditorFloatingMenu editor={editor} />
            </Tiptap>
            <div className="flex flex-row-reverse pr-2 pt-2">
                <button
                    disabled={isSaving}
                    type="button"
                    className="btn preset-tonal-primary"
                    onClick={handleReply}
                >
                    {isSaving ? <LoaderCircle className="animate-spin" /> : "Reply"}
                </button>
            </div>
            <ErrorMessage />
        </Fragment>
    );
}

function getErrorMessage(e: unknown): string {
    if (isAppError(e)) {
        switch (e._tag) {
            case "UNAUTHORIZED":
                return "Unauthorized. Are you logged in?";
            case "BAD_REQUEST":
            case "NETWORK_ERROR":
                return e.message;
            // case "NOT_FOUND":
            // case "INTERNAL_SERVER_ERROR":
            // default:
        }
    }
    return "Something went wrong during your request. Please try again later (or yell at ozzy about it!)";
}
