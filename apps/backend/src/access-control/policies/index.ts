import type { PolicyDeps } from "../types.js";
import { directMessagePolicy } from "./direct-message.js";
import { admin, everyone } from "./generic.js";
import { threadPolicy } from "./thread.js";

export * from "./generic.js";

/**
 * Composition root for access-control policies. Called once on route startup with the route's services.
 */
export function buildPolicies(deps: PolicyDeps) {
    return {
        admin,
        everyone,
        dm: {
            create: directMessagePolicy.create(deps),
            readOne: directMessagePolicy.readOne(deps),
            delete: directMessagePolicy.delete(deps),
        },
        thread: {
            edit: threadPolicy.edit,
            delete: threadPolicy.delete,
        },
    } as const;
}

export type Policies = ReturnType<typeof buildPolicies>;
