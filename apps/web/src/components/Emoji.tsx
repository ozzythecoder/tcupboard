/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: This value comes directly from a controlled database */
interface Props {
    /**
     * The hexadecimal UTF-8 code, without the leading 'U+', but WITH the initial 'x'.
     */
    code: string;
    className?: string;
}

export function Emoji({ code, className }: Props) {
    if (code === "love") code = "x1f499";
    const html = `&#${code};`;
    return (
        <span
            className={`font-mono _emoji ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
