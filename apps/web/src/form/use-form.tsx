import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FieldError } from "./components/field-error";
import { TextField } from "./components/text-field";
import { UploadField } from "./components/upload-field";

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        UploadField,
        FieldError,
    },
    formComponents: {},
});
