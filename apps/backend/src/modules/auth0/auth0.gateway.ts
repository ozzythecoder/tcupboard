import type { AxiosInstance } from "axios";
import type { Database, Schema } from "@/db/index.js";
import { env } from "@/config/env.js";

export class Auth0Gateway {
    constructor(private readonly api: AxiosInstance) {}

    getToken() {
        return this.api.post(`${env.auth0.domain}/oauth/token`, {
            client_id: env.auth0.clientId,
            client_secret: env.auth0.clientSecret,
            audience: env.auth0.apiIdentifier,
            grant_type: "client_credentials",
        });
    }

    setEmail(auth0Id: string, email: string, token: string) {
        return this.api.patch(
            `${env.auth0.apiIdentifier}users/${auth0Id}`,
            {
                email: email,
                connection: "Username-Password-Authentication",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
        );
    }

    resetPassword(email: string) {
        return this.api.post(`${env.auth0.domain}/dbconnections/change_password`, {
            email: email,
            connection: "Username-Password-Authentication",
            client_id: env.auth0.clientId,
        });
    }
}
