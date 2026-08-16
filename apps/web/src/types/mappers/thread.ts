import type { CreateThreadReplySchema, CreateThreadSchema } from "@repo/shared";

export function toCreateThreadRequest(item: CreateThreadSchema): CreateThreadSchema {
    return {
        ...item,
        content: JSON.stringify(item.content),
    };
}

export function toCreateReplyRequest(item: CreateThreadReplySchema): CreateThreadReplySchema {
    return {
        ...item,
        content: JSON.stringify(item.content),
    };
}
