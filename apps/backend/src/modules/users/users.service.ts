import type { UpdateUser } from "@repo/shared";
import type { UserGateway } from "./users.gateway.js";

export class UserService {
    constructor(private readonly userGateway: UserGateway) {}

    async getOneByAuth0Id(auth0Id: string) {
        return this.userGateway.getOneByAuth0Id(auth0Id);
    }

    async getOneById(id: number) {
        return this.userGateway.getOneById(id);
    }

    async edit(input: UpdateUser, userId: string) {
        return this.userGateway.edit(input, Number(userId));
    }

    async setEmail(email: string, userId: number) {
        return this.userGateway.setEmail(email, userId);
    }
}
