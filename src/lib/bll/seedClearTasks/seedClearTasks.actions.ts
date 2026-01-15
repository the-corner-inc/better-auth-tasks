"use server"

import * as seedCore from "@/lib/bll/seedClearTasks/seedClearTasks.core";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {getCurrentUserId} from "@/lib/auth/session";


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