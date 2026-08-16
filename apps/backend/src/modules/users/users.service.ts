import type { CreateUser, UpdateUser } from "@repo/shared";
import { InternalServerError, NotFoundError } from "@/types/errors.js";
import type { UserGateway } from "./users.gateway.js";

export class UserService {
    constructor(private readonly userGateway: UserGateway) {}

    async getOneByAuth0Id(auth0Id: Auth0UserId) {
        const user = this.userGateway.getOneByAuth0Id(auth0Id);
        if (!user) throw new NotFoundError("No such user found.");
        return user;
    }

    async getOneById(id: DbUserId) {
        const user = this.userGateway.getOneById(id);
        if (!user) throw new NotFoundError("No such user found.");
        return user;
    }

    async edit(input: UpdateUser, userId: DbUserId) {
        return this.userGateway.edit(input, userId);
    }

    async create(input: CreateUser, auth0Id: Auth0UserId) {
        return this.userGateway.create(input, auth0Id);
    }

    async setEmail(email: string, userId: DbUserId) {
        const res = await this.userGateway.setEmail(email, userId);
        if (!res || res.length === 0) throw new InternalServerError("Failed to set email.");
        return res[0];
    }
}
