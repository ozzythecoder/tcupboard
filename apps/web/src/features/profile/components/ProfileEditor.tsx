import {
    type ProfileUpdate,
    type TipTapContent,
    toUpdateUser,
    type User,
    ZProfileUpdateSchema,
} from "@repo/shared";
import { formOptions } from "@tanstack/react-form";
import { CharacterCount } from "@tiptap/extensions";
import { useEditorState } from "@tiptap/react";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";
import { convertToEditorInitState, Editor } from "#/features/editor";
import { useBaseEditor } from "#/features/editor/hooks/use-editor";
import { useAppForm } from "#/form/use-form";
import { ZProfileUpdateSchemaStripped } from "../api/validation";
import { mapErrorsToFields } from '#/form/utils'

interface Props {
    me: User;
    save: (input: ProfileUpdate) => Promise<unknown>;
    submissionError?: string;
}

export function ProfileEditor({ me, save, submissionError }: Props) {
    const [imgPreview, setImgPreview] = useState<string | undefined>();
    const [resetKey, setUploadFieldResetKey] = useState(0);

    const initState: z.input<typeof ZProfileUpdateSchemaStripped> & {
        bio: TipTapContent | string | null;
    } = {
        ...toUpdateUser(me),
        avatarFile: null,
        bio: convertToEditorInitState(me.bio),
    };

    const formOpts = formOptions({
        defaultValues: initState,
        validators: {
            onSubmit: ({ value }) => {
                const { error } = ZProfileUpdateSchemaStripped.safeParse(value);
                return mapErrorsToFields(error)
            },
        },
        onSubmit: async ({ value }) => {
            const v = ZProfileUpdateSchemaStripped.safeParse(value);
            console.log("submission successful");
            if (v.data) await save(v.data);
        },
    });

    const form = useAppForm(formOpts);

    const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.reset();
        let ogBio: string | TipTapContent | null;
        try {
            ogBio = JSON.parse(me.bio as string);
        } catch (_) {
            ogBio = me.bio;
        }
        bioEditor.commands.setContent(ogBio, { emitUpdate: true });
        setUploadFieldResetKey((k) => k + 1);
    };

    const BIO_CHARACTER_LIMIT = 400;
    const bioEditor = useBaseEditor({
        // editorClass: "input bg-surface-100-900",
        placeholderText: me.bio ?? "Tell us about yourself!",
        update: (json) => {
            form.setFieldValue("bio", json);
        },
        content: initState.bio as TipTapContent | string | null,
        extensions: [
            CharacterCount.configure({
                limit: BIO_CHARACTER_LIMIT,
            }),
        ],
    });

    const { characterCount } = useEditorState({
        editor: bioEditor,
        selector: ({ editor }) => ({
            characterCount: editor.storage.characterCount.characters(),
        }),
    });

    return (
        <div className="mt-4">
            <form
                className="mt-8 flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                <form.AppField
                    children={(field) => <field.TextField label="Username" />}
                    name="username"
                />
                <form.AppField
                    children={(field) => <field.TextField label="Tagline" />}
                    name="tagline"
                />
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 mb-4">
                    <form.AppField
                        children={(field) => (
                            <div>
                                <field.UploadField
                                    key={resetKey}
                                    label="Profile Picture"
                                    setObjectUrl={setImgPreview}
                                />
                                <span className="text-xs block text-surface-700-300">
                                    This option overrides the Profile Picture URL.
                                </span>
                            </div>
                        )}
                        name="avatarFile"
                    />
                    {imgPreview && (
                        <div>
                            <span className="text-xs">Preview</span>
                            <img
                                alt=""
                                className="mx-auto my-2 max-h-48 max-w-48 md:mx-0 border border-black"
                                src={imgPreview}
                            />
                            <button
                                className="btn-sm preset-filled-error-500 rounded-md"
                                onClick={() => {
                                    form.setFieldValue("avatarFile", undefined);
                                    setImgPreview(undefined);
                                    setUploadFieldResetKey((k) => k + 1);
                                }}
                                type="button"
                            >
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>
                <form.AppField
                    children={(field) => {
                        const hasUpload = form.getFieldValue("avatarFile");
                        const className = hasUpload ? "text-xs disabled" : "text-xs";
                        const label = hasUpload
                            ? "Profile Picture URL (overridden by uploaded image)"
                            : "Profile Picture URL";
                        return <field.TextField className={className} label={label} />;
                    }}
                    name="avatarUrl"
                />
                <form.AppField
                    children={(field) => (
                        <div>
                            <div className="flex flex-row justify-between">
                                <span className="label-text">Bio</span>
                                <span className="text-xs text-surface-600-400 -pt-4 ">
                                    {characterCount} / {BIO_CHARACTER_LIMIT} characters
                                </span>
                            </div>
                            <Editor editor={bioEditor} />
                            <field.FieldError />
                        </div>
                    )}
                    name="bio"
                    validators={{
                        onChange: ({ value }) => {
                            const res = ZProfileUpdateSchema.pick({ bio: true }).safeParse(value);
                            return res.error?.issues.map((e) => e.message).join(",");
                        },
                    }}
                />
                {submissionError && <div className="text-error-500">{submissionError}</div>}
                <div className="flex flex-col md:flex-row gap-2 w-full">
                    <button
                        className="btn bg-success-700 text-success-50 dark:bg-success-900 grow"
                        disabled={!form.state.canSubmit}
                        type="submit"
                    >
                        {form.state.isSubmitting ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            "Submit Changes"
                        )}
                    </button>
                    <button
                        className="btn preset-outlined-error-500 hover:bg-error-500/20 grow"
                        disabled={form.state.isSubmitting || form.state.isPristine}
                        onClick={handleReset}
                        type="reset"
                    >
                        Reset Form
                    </button>
                </div>
            </form>
        </div>
    );
}
