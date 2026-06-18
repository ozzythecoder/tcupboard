// db.js
import pkg from "pg";
import { env } from "./env.js";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.PROD_SUPABASE_URL,
    ssl: false,
});

// Whenever a brand-new connection is created, set the search_path
pool.on("connect", () => {
    console.log('Connected to postgres.')
});

pool.on('error', error => {
    console.error('Postgres error:', error)
})

export default pool;
