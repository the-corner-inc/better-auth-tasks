import {db} from "@/drizzle/db";
import {todos} from "@/drizzle/schema";
import {and, eq} from "drizzle-orm/sql/expressions/conditions";

/**
 * DAL (Data Access Layer)
 * - Drizzle ORM only (Database Acces)
 * - No business logic
 * - No auth / no Next.js imports
 */

export async function ttt () {
    return null
}