interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: Props) {
    return (
        <input
            {...props}
            className={`input drop-shadow-2xl bg-surface-50-950 focus:ring-surface-800-200 focus:outline-none py-2 my-6 ${className}`}
        />
    );
}
