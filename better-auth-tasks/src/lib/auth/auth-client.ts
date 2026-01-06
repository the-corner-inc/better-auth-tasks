import { createAuthClient } from "better-auth/react"

// CLIENT INSANTCE : Create an authentication client for React applications.
// This client will be used to interact with the authentication server.

export const authClient = createAuthClient(
    // No need to pass the URL of the authentication API endpoint, because the Client & Server are on the same URL
)

