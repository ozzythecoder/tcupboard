interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, className, ...props }: Props) {
    return (
        <button className={`btn ${className}`} {...props}>
            {children}
        </button>
    );
}
