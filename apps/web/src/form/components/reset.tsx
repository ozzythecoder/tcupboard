import { Button } from "#/components/form/Button";
import { useFormContext } from "../context";

export function ResetButton({
    label,
    className,
    onClick,
}: {
    label?: string;
    className?: string;
    onClick?: () => void;
}) {
    const form = useFormContext();

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button
                    className={`btn preset-filled-error-400-600 ${className}`}
                    disabled={isSubmitting}
                    onClick={() => {
                        form.reset();
                        if (onClick) onClick();
                    }}
                    type="reset"
                >
                    {label ?? "Reset"}
                </Button>
            )}
        </form.Subscribe>
    );
}
