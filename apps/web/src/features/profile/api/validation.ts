import { ZProfileUpdateSchema } from "@repo/shared";
import { utils } from "#/utils/utils";

/**
 * {@link ZProfileUpdateSchema} with undefined values stripped.
 */
export const ZProfileUpdateSchemaStripped = ZProfileUpdateSchema.transform((ctx) => {
    if (ctx.avatarFile) {
        delete ctx.avatarUrl;
    }
    return utils.stripUndefined(ctx);
});
