import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import {nextCookies} from "better-auth/next-js"; // the drizzle instance

//  Import Better Auth and create your auth instance.
//  Make sure to export the auth instance with the variable name auth or as a default export.
export const auth = betterAuth({


    user: {
      additionalFields: {
          numbersOfRepos: {
              type: "number",
              required: false,
              defaultValue: 0,
          },
          numbersOfTasks: {
              type: "number",
              required: true,
              defaultValue: -1,
          }
      }
    },

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

    // Next.js is serverless by default, so rate limiting is disabled,
    // the rate limit is stored by default in memory of the app, wich doesn't work in a serverless environment.
    // So we configure it to use the database to store rate limit data.
    /*rateLimit: {
        storage: "database" //--> Use ArcJet to store rate limit data in the database.
    },
    */

    plugins: [
        nextCookies()   // Makes sure cookies are handled correctly in Next.js environment. Sign In will be performed on the server side.
    ],

    // Authentication Methods
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID! as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET! as string,
            // Map GitHub profile data (number of public repos) to user fields in the database
            mapProfileToUser: (profile) => {
                return {
                    numbersOfRepos: Number(profile.public_repos) || 0
                }
            }
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID! as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
            mapProfileToUser: (profile) => {
                return {
                    numbersOfRepos: 0
                }
            }
        },
    },


});