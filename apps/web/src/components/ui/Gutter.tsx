interface Props {
    children: React.ReactNode;
    width?: 80 | 60;
}
export function Gutter({ children, width = 80 }: Props) {
    const widthClass = {
        80: "max-w-[80ch]",
        60: "max-w-[60ch]"
    }[width];
    
    return <div className={`mx-auto ${widthClass} px-4`}>{children}</div>;
}
