import type { CreatePostReaction } from "@repo/shared";
import type { KyInstance } from "ky";
import { createContext, use } from "react";

export interface IPostReactionContext {
    reactToPost: (
        input: CreatePostReaction,
        metadata: { id: number; username: string }[],
    ) => Promise<unknown>;
    userId: number;
    authApi: KyInstance;
    isMutating: boolean;
}

export const PostReactionContext = createContext<IPostReactionContext | undefined>(undefined);

export const usePostReactionContext = () => {
    const ctx = use(PostReactionContext);
    if (!ctx) throw new Error("ReactionContext cannot be used outside of its provider");
    return ctx;
};
