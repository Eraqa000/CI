import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: { rejectUnauthorized: false }, // для Render Postgres

});

export async function testDbConnection(){
    try{
        const res = await pool.query("SELECT NOW()");
        console.log("✅ PostgreSQL connected, time:", res.rows[0].now);
    } catch (err) {
        console.error("❌ PostgreSQL connection error:", err.message);
        process.exit(1);
    }
}