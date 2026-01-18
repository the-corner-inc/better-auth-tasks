"use server"

import * as seedCore from "@/lib/bll/seedClearTasks/seedClearTasks.core";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {getCurrentUserId} from "@/lib/auth/session";

/**
 * Next.js Server Actions - Interface with UI
 *
 * These actions are for development/testing purposes only.
 * They allow quick population and cleanup of test data.
 *
 * Responsibilities:
 * - Entry point for the UI layer
 * - "Place" to call "use server"
 * - Handles authentication, cache revalidation and data shaping (returns)
 * - Delegates business logic to BLL (core)
 * - Todo : Error handling
 * - Todo : Use ".parse(data)" to verify data from schemas
 */

// ======================================================
// BULK OPERATIONS FOR TESTING PURPOSES
// ======================================================
// SEED - Create a testing dataset
export async function seedData() {
    const userId = await getCurrentUserId()

    await seedCore.seedDataForUser (userId)

    revalidatePath("/tasks")
    return{success: true, message: "Data seeded !"}
}

// CLEAR - Remove all tasks from a user
export async function clearAllTasks() {
    const userId = await getCurrentUserId()

    await seedCore.clearAllTasksForUser(userId)

    revalidatePath("/tasks")
    return {success: true, message: "All the tasks have been deleted !"}
}