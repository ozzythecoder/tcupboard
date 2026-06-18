import type { UpdateUser } from "@repo/shared";
import { eq } from "drizzle-orm";
import type { Database, Schema } from "@/db/index.js";

export class UserGateway {
    constructor(
        private readonly db: Database,
        private readonly s: Schema,
    ) {}

    async getOneById(id: number) {
        return this.db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, id),
        });
    }

    async getOneByAuth0Id(auth0Id: string) {
        return this.db.query.users.findFirst({
            where: (u, { eq }) => eq(u.auth0Id, auth0Id),
        });
    }

    async edit(input: UpdateUser, userId: number) {
        return this.db
            .update(this.s.users)
            .set(input)
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
