"use server"

import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {tasks, todos} from "@/drizzle/schema";
import {db} from "@/drizzle/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {eq} from "drizzle-orm/sql/expressions/conditions";

// ======================================================
// HELPER : Get current user ID (throws if not logged in)
// ======================================================
async function getCurrentUserId() {
    const session = await auth.api.getSession({ headers: await headers() })

    // If no session, or no user, or no id, then error
    if (!session?.user?.id) {
        throw new Error("Non authentifié")
    }

    return session.user.id
}

// ======================================================
// BULK OPERATIONS FOR TESTING PURPOSES
// ======================================================
// SEED - Create a testing dataset
export async function seedData() {
    const userId = await getCurrentUserId()

    // 1) Create 2 tasks
    const [task1] = await db.insert(tasks).values({
        title: "Courses",
        userId,
    }).returning()

    const [task2] = await db.insert(tasks).values({
        title: "Projet Next.js",
        userId,
    }).returning()

    // 2) Add some todos to each task
    await db.insert(todos).values([
        {content: "Acheter du lait", taskId: task1.id, sortPosition: 0},
        {content: "Acheter du pain", taskId: task1.id, sortPosition: 1},
        {content: "Acheter des oeufs", taskId: task1.id, sortPosition: 2, isDone: true},
    ])

    await db.insert(todos).values([
        {content: "Regarder la video tutorial concernant better auth", taskId: task2.id, sortPosition: 0, isDone: true},
        {content: "Créer le CRUD des tasks", taskId: task2.id, sortPosition: 1},
        {content: "Faire un UI", taskId: task2.id, sortPosition: 2},
    ])

    revalidatePath("/tasks")
    return{success: true, message: "Data seeded !"}
}

// CLEAR - Remove all tasks from a user
export async function clearAllTasks() {
    const userId = await getCurrentUserId()

    await db.delete(tasks).where(eq(tasks.userId, userId))

    revalidatePath("/tasks")
    return {success: true, message: "All the tasks have been deleted !"}
}