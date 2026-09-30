import { Button } from "#/components/form/Button";
import { useFormContext } from "../context";

export function SubmitButton({ label, className }: { label?: string; className?: string }) {
    const form = useFormContext();

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button
                    className={className}
                    disabled={isSubmitting}
                    onClick={() => form.handleSubmit()}
                    type="button"
                >
                    {label ?? "Submit"}
                </Button>
            )}
        </form.Subscribe>
    );
}
