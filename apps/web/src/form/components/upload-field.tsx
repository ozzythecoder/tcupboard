import { useFieldContext } from "../context";

export function UploadField({
    label,
    setObjectUrl,
}: {
    label: string;
    setObjectUrl: (u: string) => void;
}) {
    const field = useFieldContext<File>();

    return (
        <label>
            <span className="label-text">{label}</span>
            <input
                accept=".png,.jpg,.jpeg"
                capture="user"
                className="file:btn-sm file:preset-glass-surface-950-50 file:rounded-md text-sm "
                onBlur={field.handleBlur}
                onChange={(e) => {
                    field.handleChange(e.target.files?.[0]);
                    const file = e.target.files?.[0];
                    if (file) {
                        const url = URL.createObjectURL(file);
                        setObjectUrl(url);
                    }
                }}
                type="file"
            />
        </label>
    );
}
