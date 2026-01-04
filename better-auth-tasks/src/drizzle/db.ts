import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "./schema"

// DATABASE CONNECTION SETUP : DRIZZLE INSTANCE & POSTGRESQL
// Configure and export the database connection using Drizzle ORM and PostgreSQL
// INSTANCE OF DRIZZLE ORM CONNECTED TO POSTGRESQL DATABASE
export const db = drizzle(process.env.DATABASE_URL!, {schema});