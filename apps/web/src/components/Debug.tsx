export function Debug({ content }: { content: any }) {
    return import.meta.env.DEV ? (
        <pre className="pre text-xs">{JSON.stringify(content, null, 2)}</pre>
    ) : null;
}
