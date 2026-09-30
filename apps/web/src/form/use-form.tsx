import { createFormHook } from "@tanstack/react-form";
import { FieldError } from "./components/field-error";
import { ResetButton } from "./components/reset";
import { SubmitButton } from "./components/submit";
import { TextField } from "./components/text-field";
import { UploadField } from "./components/upload-field";
import { fieldContext, formContext } from "./context";

export const { useAppForm, withForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        UploadField,
        FieldError,
    },
    formComponents: {
        SubmitButton,
        ResetButton,
    },
});
