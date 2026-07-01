import type { Auth0Gateway } from "./auth0.gateway.js";

export class Auth0Service {
    constructor(private readonly authGateway: Auth0Gateway) {}

    async getToken() {
        return this.authGateway.getToken();
    }

    async setEmail(auth0Id: string, email: string, token: string) {
        return this.authGateway.setEmail(auth0Id, email, token);
    }

    async resetPassword(email: string) {
        return this.authGateway.resetPassword(email);
    }
}
