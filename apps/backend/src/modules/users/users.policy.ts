import type { Request } from "express";
import type { UserGateway } from "@/modules/users/users.gateway.js";
import type { Policy } from "../../access-control/types.js";
import { admin, everyone } from "@/access-control/policies/generic.js";

export class UserPolicy {
    constructor(private readonly userGwy: UserGateway) {}

    /**
     * - Anyone can read a user (all profiles are public)
     */
    read(): Policy {
        return everyone;
    }

    /**
     * - Authenticated users can edit their own profile.
     */
    editProfile(): Policy {
        return async (req) => {
            return req.user?.id === Number(req.params.userId);
        };
    }

    /**
     * - Authenticated users can change their own email.
     * - Administrators can change others' email.
     */
    changeEmail(): Policy {
        return async (req) => {
            if (await admin(req)) return true;
            if (!req.user?.id) return false;
            const existingUser = await this.userGwy.getOneById(req.user?.id);
            return existingUser?.email === req.body.email;
        };
    }

    /**
     * - Authenticated users can request a password reset.
     * - Administrators can request a password reset for another user.
     */
    resetPassword(): Policy {
        return async (req) => {
            if (await admin(req)) return true;
            if (!req.user?.id) return false;
            const existingUser = await this.userGwy.getOneById(req.user?.id);
            return existingUser?.email === req.body.email;
        };
    }

    /**
     * - Administrators can delete user profiles.
     * - Authenticated users can delete their own profiles.
     */
    async deleteAccount(req: Request) {
        return req.user?.id === Number(req.params.userId) || admin(req);
    }
}
