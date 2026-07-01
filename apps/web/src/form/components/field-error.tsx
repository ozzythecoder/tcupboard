import { useFieldContext } from "../use-form";

export function FieldError() {
    const field = useFieldContext();

    return <em className="text-error-600-400">{field.state.meta.errors}</em>;
}
