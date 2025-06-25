import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env" });

export const db = drizzle(process.env.NEXT_PUBLIC_NEON_DATABASE_URL!, {
  schema,
});
