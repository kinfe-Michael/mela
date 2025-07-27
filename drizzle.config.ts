
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import * as fs from "fs";

const CERT_FILE_PATH =
  "/home/kinfemichael/Desktop/ec/mela/certs/global-bundle.pem";


let caContentDrizzleKit: string | undefined;
try {
  caContentDrizzleKit = fs.readFileSync(CERT_FILE_PATH).toString();
  console.log("[DrizzleKit Debug] CA cert content length:", caContentDrizzleKit.length);
  if (caContentDrizzleKit.length === 0) {
    console.error("[DrizzleKit Debug] WARNING: CA cert file is empty!");
    process.exit(1);
  }
} catch (error: any) {
  console.error("[DrizzleKit Debug] ERROR: Failed to read CA cert file for DrizzleKit:", error.message);
  process.exit(1);
}


const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("ERROR: DATABASE_URL environment variable is not set.");
  process.exit(1);
}



const parsedUrl = new URL(dbUrl); 




export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    
    host: parsedUrl.hostname,
    port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : 5432, 
    user: parsedUrl.username,
    password: parsedUrl.password,
    database: parsedUrl.pathname.substring(1), 
    ssl: {
      ca: caContentDrizzleKit,
      rejectUnauthorized: true, 
    },
  },
  verbose: true,
  strict: true,
});