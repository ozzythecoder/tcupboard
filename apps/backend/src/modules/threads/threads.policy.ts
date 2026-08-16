import type { Policy } from "@/access-control/types.js";
import type { ThreadsGateway } from "./threads.gateway.js";

export class ThreadsPolicy {
    constructor(
        private readonly threadsGateway: ThreadsGateway,
    ) {}

    /**
     * Authenticated users can delete their own threads.
     */
    delete() {
        return (async (req) => {
            const thread = await this.threadsGateway.getOne(req.params.id);
            return !!(thread && thread.length > 0 && thread[0].authorId === req.user.id);
        }) satisfies Policy<{ id: number }>;
    }
}
