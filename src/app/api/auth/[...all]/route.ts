import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { findIp } from "@arcjet/ip"
import arcjet, {
    BotOptions,
    detectBot,
    EmailOptions, protectSignup,
    shield, slidingWindow,
    SlidingWindowRateLimitOptions,
} from "@arcjet/next";

/**
 * Auth API route - Catch-all Handler (Better Auth)
 *
 * Route:
 * - "/api/auth/*"
 * - Every request under "/api/auth/*" is handled here
 *
 * Description:
 * Mount the Better Auth handler to a Next.js API route.
 * To handle API requests, you need to set up a route handler on your server.
 * A mount handler is responsible for processing incoming requests and sending appropriate responses.
 * In Next.js, you can create API routes that act as endpoints for your application.
 *
 *
 * Entry points:
 * - Next.js Route handler (App Router)
 * - Exports HTTP methods (GET, POST, etc...) delegated to Better Auth
 *
 * Responsibilities:
 * - Act as the HTTP bridge between the browser and Better Auth
 * - Forward auth-related requests to the "auth" server instance
 * - Handle:
 *      - Sign in / up / out
 *      - OAuth callbacks
 *      - Session retrieval
 *
 * Usage :
 * - Never called directly by application code
 * - Automatically used by:
 *      - "authClient" (so the browser)
 *      - OAuth providers redirects
 *      - Cookies-based session checks
 *
 * Constraints:
 * - server only
 * - The single purpose is routing HTTP requests to Better Auth
 *
 */


// ======================================================
// HTTP handlers
// ======================================================
const authHandlers =  toNextJsHandler(auth)

export const { GET } = authHandlers
export async function POST(request: Request) {
    const clonedRequest = request.clone() // Clone the request to read its body without consuming the original request
    const decision = await checkArcjet(request)

    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return new Response(null, {status: 429 })
        }
        else if (decision.reason.isEmail()) {
            let message: string

            if (decision.reason.emailTypes.includes("INVALID")){
                message = "Email address format is invalid."
            } else if (decision.reason.emailTypes.includes("DISPOSABLE")){
                message = "Disposable email addresses are not allowed."
            } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")){
                message = "Email domain is not valid."
            } else {
                message = "Email address is not allowed."
            }
            return Response.json({ message}, { status: 400 })
        }
        else {
            return new Response(null, {status: 403})
        }
    }

    return authHandlers.POST(clonedRequest)
}

async function checkArcjet(request: Request) {
    const body = (await request.json()) as unknown // Parse the request body as JSON and type it as unknown to avoid type issues
    const session = await auth.api.getSession({ headers: request.headers })
    const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1"

    // If we are on a signup page and the request contains an email, apply stricter rules
    if(request.url.endsWith("/auth/sign-up")) {
        // Conditions is : body exists AND body is an object AND body has an "email" property AND body.email is a string
        if (body && typeof body === "object" && "email" in body && typeof body.email === "string") {
            aj.withRule(
                protectSignup({
                    email: emailSettings,
                    bots: botSettings,
                    rateLimit: restrictiveRateLimitSettings
                })
            ).protect(request, { email: body.email, userIdOrIp})
        } else {
            // If the sign-up is not made with an email (but google, github etc...), we just apply bot detection and rate limiting
            return aj.withRule(detectBot(botSettings))
                     .withRule(slidingWindow(restrictiveRateLimitSettings))
                     .protect(request, {userIdOrIp })
        }
    }

    // For other requests, apply standard bot detection and rate limiting rules
    return aj.withRule(detectBot(botSettings))
             .withRule(slidingWindow(laxRateLimitSettings))
             .protect(request, { userIdOrIp })
}



// ======================================================
// ArcJet security options
// ======================================================
// We limit rate limiting to POST method only for security reasons (to prevent brute-force attacks on sign-in/sign-up).

const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    characteristics: ["userIdOrIp"],    // Use user ID or IP address to identify clients for rate limiting and bot detection
    rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        shield({ mode: "LIVE" }),
    ]
})

const botSettings = {
    mode: "LIVE",
    allow: []
} satisfies BotOptions

const restrictiveRateLimitSettings = {  //This options defines 10 requests per 10 minutes
    mode: "LIVE",
    max: 10,
    interval: "10m"
} satisfies SlidingWindowRateLimitOptions<[]> // "<[]>" to avoid type inference issues

const laxRateLimitSettings = {
    mode: "LIVE",
    max: 60,
    interval: "1m"
} satisfies SlidingWindowRateLimitOptions<[]>

const emailSettings = {
    mode: "LIVE",
    deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"]
} satisfies EmailOptions