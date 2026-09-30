import type { CreateUser, UpdateUser } from "@repo/shared";
import { eq, sql } from "drizzle-orm";
import type { Database, Schema } from "@/db/index.js";

export class UserGateway {
    constructor(
        private readonly db: Database,
        private readonly s: Schema,
    ) {}

    async getOneById(id: DbUserId) {
        return this.db.query.users.findFirst({
            where: {
                id: { eq: id },
            },
        });
    }

    async getManyByIds(ids: DbUserId[]) {
        return this.db.query.users.findMany({
            where: {
                id: { in: ids },
            },
        });
    }

    async getOneByAuth0Id(auth0Id: Auth0UserId) {
        return this.db.query.users.findFirst({
            where: {
                auth0Id: { eq: auth0Id },
            },
        });
    }

    async searchByUsername(username: string) {
        const term = username.trim().replace(/\W/g, "");
        if (!term) return []

        return this.db
            .select({
                id: this.s.users.id,
                username: this.s.users.username,
                avatarUrl: this.s.users.avatarUrl,
            })
            .from(this.s.users)
            .where(sql`${this.s.users.username} LIKE ${`${term}%`}`)
            .orderBy(sql`${this.s.users.username}`);
    }

    async create(input: CreateUser, auth0Id: Auth0UserId) {
        return this.db
            .insert(this.s.users)
            .values({
                ...input,
                auth0Id,
            })
            .returning();
    }

    async edit(input: UpdateUser, userId: DbUserId) {
        return this.db
            .update(this.s.users)
            .set({
                ...input,
                bio: typeof input.bio === "string" ? input.bio : JSON.stringify(input.bio),
            })
            .where(eq(this.s.users.id, userId))
            .returning();
    }

    async setEmail(email: string, userId: DbUserId) {
        return this.db
            .update(this.s.users)
            .set({ email })
            .where(eq(this.s.users.id, userId))
            .returning();
    }
}
