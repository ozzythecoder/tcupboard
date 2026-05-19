import db from "../config/db.js";

type UserIn = {
    auth0Id: string;
    email: string;
    username: string;
};

export const userService = {
    getByAuthId: async (auth_id: string) => {
        const res = await db.query("select * from users where auth0_id = $1", [auth_id]);
        return res.rows[0];
    },
    getAll: async () => {
        const res = await db.query("select * from users");
        return res.rows;
    },
    create: async (user: UserIn) => {
        const res = await db.query(
            `
      insert into users (auth0_id, email, username)
      values ($1 $2 $3) returning *
      `,
            [user.auth0Id, user.email, user.username],
        );
        return res;
    },
    updateEmail: async (email: string, auth_id: string) => {
        const res = await db.query(
            `
      update users
      set email = $1 where auth0_id = $2
      returning *
      `,
            [email, auth_id],
        );
        return res.rows[0];
    },
};
