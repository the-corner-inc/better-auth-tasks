import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db"; // the drizzle instance

//  Import Better Auth and create your auth instance.
//  Make sure to export the auth instance with the variable name auth or as a default export.
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
});