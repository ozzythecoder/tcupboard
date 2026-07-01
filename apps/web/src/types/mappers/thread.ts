import type { CreateThreadReplySchema, CreateThreadSchema, ImageMetadata } from "@repo/shared";
import type { JSONContent } from "@tiptap/react";

interface CreateThreadInput {
    id: string;
    author: string;
    title: string;
    doc: { content: JSONContent[] };
    images?: ImageMetadata[];
}

export function toCreateThreadRequest({
    id,
    author,
    doc,
    images,
    title,
}: CreateThreadInput): CreateThreadSchema {
    return {
        id,
        author,
        content: JSON.stringify(doc),
        images,
        title,
    };
}

// ################
//  REPLIES

interface CreateThreadReplyInput {
    id: string;
    parent_id: number;
    author: string;
    doc: { content: JSONContent[] };
    images?: ImageMetadata[];
}

export function toCreateReplyRequest({
    id,
    doc,
    author,
    images,
    parent_id,
}: CreateThreadReplyInput): CreateThreadReplySchema {
    return {
        id,
        content: JSON.stringify(doc),
        author,
        images,
        parent_id,
    };
}
