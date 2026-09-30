import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useProtectedApiContext } from "#/config/api";
import { Editor } from "#/features/editor";
import { useError } from "#/utils/hooks";
import { conversationMutations } from "../direct-messages.api";
import { useCreateConversationForm } from "./create.form";
import { UserSearch } from "./user-search";

export function CreateNewConversationForm({ userId }: { userId: number }) {
    const { ErrorMessage, setError, clearError } = useError();
    const navigate = useNavigate();

    const api = useProtectedApiContext().getApi();
    const mut = useMutation(conversationMutations.createConversation(api));

    const { form, editor } = useCreateConversationForm({
        submit: async (data) => {
            data.participants.push(userId);
            mut.mutateAsync(data, {
                onError: (e) => {
                    setError(e.message);
                },
                onSuccess: (res) => {
                    console.log(res)
                    navigate({ to: "/messages/conversation/$id", params: { id: res } });
                },
            });
        },
    });

    const charWarningThreshold = editor.characterLimit - 400;
    const isWarning = editor.characterCount > charWarningThreshold;

    const resetForm = () => {
        clearError();
        editor.editor.commands.clearContent();
    };

    return (
        <form className="flex flex-col gap-4">
            <form.AppForm>
                <form.AppField
                    children={(field) => (
                        <div className="flex flex-row items-center gap-4 w-full">
                            <span className="label-text shrink">To:</span>
                            <UserSearch
                                handleChange={(userId) => {
                                    const id = userId ? parseInt(userId, 10) : undefined;
                                    if (Number.isNaN(id)) {
                                        field.setValue(undefined);
                                    } else {
                                        field.setValue(id);
                                    }
                                }}
                            />
                        </div>
                    )}
                    name="recipient"
                />
                <form.AppField
                    children={(field) => (
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                                <span className="label-text">Message</span>
                                {isWarning ? (
                                    <span
                                        className="text-xs text-surface-600-400 -pt-4 data-[full='true']:text-error-600-400"
                                        data-full={
                                            editor.characterCount > editor.characterLimit - 100
                                        }
                                    >
                                        {editor.characterCount} / {editor.characterLimit} characters
                                    </span>
                                ) : null}
                            </div>
                            <Editor editor={editor.editor} />
                            <field.FieldError />
                        </div>
                    )}
                    name="initialMessage.content"
                />
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:px-20">
                    <form.SubmitButton className="md:w-fit md:self-right preset-tonal-primary" />
                    <form.ResetButton className="md:w-fit" onClick={resetForm} />
                </div>
                <ErrorMessage />
            </form.AppForm>
        </form>
    );
}
