import {
    type CreateConversation,
    type ImageMetadata,
    type TipTapContent,
    ZCreateConversationSchema,
} from "@repo/shared";
import { CharacterCount } from "@tiptap/extensions";
import { type JSONContent, useEditorState } from "@tiptap/react";
import { InternalServerError } from "#/config/error";
import { useBaseEditor } from "#/features/editor/hooks/use-editor";
import { useAppForm } from "#/form/use-form";
import { mapErrorsToFields } from "#/form/utils";

interface DirectMessageForm {
    recipient: number | undefined;
    initialMessage: {
        content: TipTapContent;
        images: ImageMetadata[];
    };
}

const initValues: DirectMessageForm = {
    recipient: undefined,
    initialMessage: {
        content: {} as TipTapContent,
        images: [],
    },
};

interface CreateConversationFormProps {
    submit: (value: CreateConversation) => Promise<void>;
}

export const useCreateConversationForm = ({ submit }: CreateConversationFormProps) => {
    const form = useAppForm({
        defaultValues: initValues,
        validators: {
            onSubmit: ({ value }) => {
                const participants = [value.recipient];
                const { error } = ZCreateConversationSchema.safeParse({
                    ...value,
                    participants,
                });
                return mapErrorsToFields(error);
            },
        },
        onSubmit: async ({ value }) => {
            const { data } = ZCreateConversationSchema.safeParse({
                ...value,
                participants: [value.recipient],
            });
            if (!data)
                throw new InternalServerError("useCreateConversationForm: Malformed form payload.");
            await submit(data);
        },
    });

    const CHAR_LIMIT = 2000;
    const editor = useBaseEditor({
        content: initValues.initialMessage.content as JSONContent,
        update: (json: any) => {
            form.setFieldValue("initialMessage.content", json);
        },
        extensions: [
            CharacterCount.configure({
                limit: CHAR_LIMIT,
            }),
        ],
    });

    const { characterCount } = useEditorState({
        editor,
        selector: (s) => ({ characterCount: s.editor.storage.characterCount.characters() }),
    });

    return {
        form,
        editor: {
            editor,
            characterCount,
            characterLimit: CHAR_LIMIT,
        },
    };
};
