import type { CreateThreadReplySchema, CreateThreadSchema, ImageMetadata} from '@repo/shared';
import type { JSONContent } from "@tiptap/react";

interface CreateThreadInput {
    auth0_id: string;
    author: string;
    title: string;
    doc: { content: JSONContent[] };
    images?: ImageMetadata[];
}

export function toCreateThreadRequest({
    auth0_id,
    author,
    doc,
    images,
    title,
}: CreateThreadInput): CreateThreadSchema {
    return {
        auth0_id,
        author,
        content: JSON.stringify(doc),
        images,
        title,
    };
}

// ################
//  REPLIES

interface CreateThreadReplyInput {
    auth0_id: string;
    parent_id: number;
    author: string;
    doc: { content: JSONContent[] };
    images?: ImageMetadata[];
}

export function toCreateReplyRequest({
    auth0_id,
    doc,
    author,
    images,
    parent_id,
}: CreateThreadReplyInput): CreateThreadReplySchema {
    return {
        auth0_id,
        content: JSON.stringify(doc),
        author,
        images,
        parent_id,
    };
}
