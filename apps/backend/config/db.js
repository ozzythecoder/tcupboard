// db.js
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.DB_SSL_CERT ?? false,
});

// Whenever a brand-new connection is created, set the search_path
pool.on("connect", (client) => {
    const schema = process.env.DB_SCHEMA || "public";
    client
        .query(`SET search_path TO ${schema}, public`)
        .then(() => {
            console.log(`search_path set to ${schema}, public`);
        })
        .catch((err) => {
            console.error("Error setting search_path:", err);
        });
});

export default pool;
