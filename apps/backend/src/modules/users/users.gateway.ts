import type { CreateUser, UpdateUser } from "@repo/shared";
import { eq } from "drizzle-orm";
import type { Database, Schema } from "@/db/index.js";

export class UserGateway {
    constructor(
        private readonly db: Database,
        private readonly s: Schema,
    ) {}

    async getOneById(id: number) {
        return this.db.query.users.findFirst({
            where: {
                id: { eq: id },
            },
        });
    }

    async getOneByAuth0Id(auth0Id: string) {
        return this.db.query.users.findFirst({
            where: {
                auth0Id: { eq: auth0Id },
            },
        });
    }

    async create(input: CreateUser, auth0Id: string) {
        return this.db
            .insert(this.s.users)
            .values({
                ...input,
                auth0Id,
            })
            .returning();
    }

    async edit(input: UpdateUser, userId: number) {
        return this.db
            .update(this.s.users)
            .set({
                ...input,
                bio: typeof input.bio === "string" ? input.bio : JSON.stringify(input.bio),
            })
            .where(eq(this.s.users.id, userId))
            .returning();
    }

    async setEmail(email: string, userId: number) {
        return this.db
            .update(this.s.users)
            .set({ email })
            .where(eq(this.s.users.id, userId))
            .returning();
    }
}
