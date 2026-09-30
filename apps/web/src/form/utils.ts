import type { z } from "zod";

export const mapErrorsToFields = (error: z.ZodError | undefined) => {
    if (!error) return undefined;
    const fieldErrors: Record<string, string> = {};
    error.issues.forEach((e) => {
        const path = e.path.join(".");
        fieldErrors[path] = e.message;
    });
    return {
        fields: fieldErrors,
    };
};
