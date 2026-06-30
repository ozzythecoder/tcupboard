import { useFieldContext } from "../use-form";

export function TextField({ label, className }: { label: string; className?: string }) {
    const field = useFieldContext<string>();
    return (
        <label>
            <span className="label-text">{label}</span>
            <input
                className={`input bg-surface-100-900 ${className}`}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
            />
        </label>
    );
}
