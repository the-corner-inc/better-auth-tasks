"use server"

import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";

// ToDo : COMMENT

// ================================================================
// Get current user ID (throws error if not logged in)
// ================================================================
export async function getCurrentUserId() : Promise<string> {
    const session = await auth.api.getSession({ headers: await headers() })

    // If no session, or no user, or no id, then error
    if (!session?.user?.id)
        throw new Error("Not authenticated")

    return session.user.id
}