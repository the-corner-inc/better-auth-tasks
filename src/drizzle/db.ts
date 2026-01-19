import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "./schema"

/**
 * Database Connection setup using Drizzle ORM
 *
 * This file :
 * - Creates the Drizzle ORM instance "drizzle()"
 *      - Connects to PostgreSQL via the DATABSE_URL .env variable
 *      - Imports all schemas for the relational query builder
 * - Is exports the as {db} elsewhere
 */

export const db = drizzle(process.env.DATABASE_URL!, {schema});