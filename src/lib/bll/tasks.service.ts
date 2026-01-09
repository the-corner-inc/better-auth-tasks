"use server"

import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {db} from "@/drizzle/db";
import {tasks} from "@/drizzle/schema";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {and, eq} from "drizzle-orm/sql/expressions/conditions";

// TODO : use ".parse" or ".safeParse" with "taskWithTodosSchemaDTO" to verify data
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
// CRUD TASKS
// ======================================================

// CREATE - Create a new task
export async function createTask(title: string) {
    const userId = await getCurrentUserId()

    const [newTask] = await db.insert(tasks).values({
        title,
        userId,
    }).returning()

    revalidatePath("/tasks")
    return {success: true, task: newTask}
}

// READ - Get all tasks from the current user
export async function getTasks() {
    const userId = await getCurrentUserId()

    const userTasks = await db.query.tasks.findMany({
        where: eq(tasks.userId, userId),
        with: {
            todos: {
                orderBy: (todos,
                          {asc}) =>
                            [asc(todos.sortPosition)],
            },
        },
        orderBy: (tasks,
                  {desc}) =>
                    [desc(tasks.createdAt)],
    })

    return {success: true, tasks: userTasks}
}

// READ - Recover a task by it id
export async function getTaskById(taskId: string) {
    const userId = await getCurrentUserId()

    const taskFound = await db.query.tasks.findFirst({
        where: and(eq(tasks.id, taskId), eq(tasks.userId, userId)),
        with: {
            todos: {
                orderBy: (todos,
                          {asc}) =>
                            [asc(todos.sortPosition)],
            }
        }
    })

    return {success: true, task: taskFound }

}

// UPDATE - Update a task title
export async function updateTask(taskId: string, title: string) {
    const userId = await getCurrentUserId()

    const [updated] = await db.update(tasks)
                        .set({title, updatedAt: new Date() }) // ToDo : "Date" Or Timestamp ?
                        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
                        .returning()

    revalidatePath("/tasks")
    return {success: true, task: updated}
}

// DELETE - Remove a task (with all his todos by cascade)
export async function deleteTask(taskId: string) {
    const userId = await getCurrentUserId()

    await db.delete(tasks)
            .where((and(eq(tasks.id, taskId), eq(tasks.userId, userId))))

    revalidatePath("/tasks")
    return {success: true}
}


