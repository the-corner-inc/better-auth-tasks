import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import {nextCookies} from "better-auth/next-js"; // the drizzle instance

//  Import Better Auth and create your auth instance.
//  Make sure to export the auth instance with the variable name auth or as a default export.
export const auth = betterAuth({

    // Configure Drizzle adapter with PostgreSQL provider and database instance
    database: drizzleAdapter(db, {
        provider: "pg",
    }),

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes cache for session cookies for the user
        }
    },

    plugins: [
        nextCookies()   // Makes sure cookies are handled correctly in Next.js environment. Sign In will be performed on the server side.
    ],

    // Authentication Methods
    emailAndPassword: {
        enabled: true,
    },
    /*socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },

     */
});