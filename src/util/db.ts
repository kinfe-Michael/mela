import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";
import * as schema from "../db/schema";

const CERT_FILE_PATH = path.join(process.cwd(), "certs", "global-bundle.pem");

console.log("[App DB] Attempting to load CA cert from:", CERT_FILE_PATH);

let caContent: string;
try {
  caContent = fs.readFileSync(CERT_FILE_PATH).toString();
  console.log("[App DB] CA cert content length:", caContent.length);
  if (caContent.length === 0) {
    console.error("[App DB] WARNING: CA cert file is empty at", CERT_FILE_PATH);
    throw new Error("Empty CA cert file. Check: " + CERT_FILE_PATH);
  }
} catch (error: any) {
  console.error(
    "[App DB] ERROR: Failed to read CA cert file for app at",
    CERT_FILE_PATH,
    ":",
    error.message
  );

  throw new Error(
    `Failed to load DB SSL certificate. Ensure 'global-bundle.pem' is in 'certs/' folder at project root. Error: ${error.message}`
  );
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set for app connection."
  );
}
const parsedUrl = new URL(dbUrl);

const pool = new Pool({
  host: parsedUrl.hostname || "localhost",
  port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : 5432,
  user: parsedUrl.username,
  password: parsedUrl.password,
  database: parsedUrl.pathname ? parsedUrl.pathname.substring(1) : "postgres",
  ssl: {
    ca: caContent,
    rejectUnauthorized: true,
  },
});

export const db = drizzle(pool, { schema });
