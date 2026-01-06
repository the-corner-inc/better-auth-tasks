import { createAuthClient } from "better-auth/react"
import {auth} from "@/lib/auth/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";

// CLIENT INSANTCE : Create an authentication client for React applications.
// This client will be used to interact with the authentication server.

export const authClient = createAuthClient({
    // No need to pass the URL of the authentication API endpoint, because the Client & Server are on the same URL


    // Add the fields defined in the "auth.ts" schema to the client instance
    // This allows TypeScript to recognize the additional user fields in the client API, and propagate them through the application.
    plugins: [inferAdditionalFields<typeof auth>()]
})

