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
}
