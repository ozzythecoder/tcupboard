import { useFieldContext } from "../context";

export function TextField({ label, className }: { label: string; className?: string }) {
    const field = useFieldContext<string>();
    return (
        <label>
            <span className="label-text">{label}</span>
            <input
                className={`input bg-surface-100-900 ${className}`}
                onChange={(e) => field.handleChange(e.target.value)}
                value={field.state.value ?? ""}
            />
        </label>
    );
}
