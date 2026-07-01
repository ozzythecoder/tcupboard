/**
 * Service method decorator - for all entries with `deleted_at` field, will redact `content` field.
 * Should only be used on service methods
 */
export function RedactDeletedEntries(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        const result = await original.apply(this, args);

        if (!Array.isArray(result)) return result;

        return result.map((item) => {
            if (item.deleted_at) {
                return { ...item, content: "[ This message has been deleted. ]" };
            }
            return item;
        });
    };

    return descriptor;
}
