import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

// MOUNT HANDLER : Mount the Better Auth handler to a Next.js API route.
// To handle API requests, you need to set up a route handler on your server.
// A mounth handler is responsible for processing incoming requests and sending appropriate responses.
// In Next.js, you can create API routes that act as endpoints for your application.

// Handler for AUTH API route using Better Auth and Next.js
export const { POST, GET } = toNextJsHandler(auth);