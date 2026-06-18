import type { CreatePostReaction } from "@repo/shared";
import type { PostReactionGateway } from "./post-reactions.gateway.js";

export class PostReactionService {
    constructor(private readonly reactionGateway: PostReactionGateway) {}

    async getByPostId(postId: number) {
        return this.reactionGateway.getByPostId(postId);
    }

    async getAllByPostIds(postIDs: number[]) {
        return this.reactionGateway.getAllByPostIds(postIDs);
    }

    async create(userId: number, input: CreatePostReaction) {
        return this.reactionGateway.create({
            ...input,
            userId,
        });
    }

    async toggle(userId: number, input: CreatePostReaction) {
        return this.reactionGateway.toggle({ ...input, userId })
    }

    async delete(reactionId: number) {
        return this.reactionGateway.delete(reactionId);
    }
}
