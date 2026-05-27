type NonNullishKey<T> = {
    [K in keyof T]: Exclude<T[K], null | undefined> extends string ? K : never
}[keyof T];

export function stripUndefined<T extends Record<string, string | null | undefined>>(obj: T) {
    const result = {} as Record<NonNullishKey<T>, string>;

    for (const [key, value] of Object.keys(obj)) {
        if (value !== null && value !== undefined) {
            result[key as NonNullishKey<T>] = value;
        }
    }

    return result;
}
