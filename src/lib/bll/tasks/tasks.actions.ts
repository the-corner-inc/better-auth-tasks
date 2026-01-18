"use server"

import * as tasksCore from "@/lib/bll/tasks/tasks.core"
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {getCurrentUserId} from "@/lib/auth/session";
import {handleActionError} from "@/lib/bll/errorHandling";


/**
 * Next.js Server Actions - Interface with UI
 * - Entry point for the UI layer
 * - Place to call "use server"
 * - Handles auth, cache revalidation and data shaping (returns)
 * - Delegates business rules to the BLL
 * - Uses DTO for UI
 */

// TODO : use ".parse" or ".safeParse" with "taskWithTodosSchemaDTO" to verify data
// ======================================================
// UI Server Actions
// ======================================================

// CREATE - Create a new task
export async function createTask(title: string) {
    try{ // ToDo : Example of how to make the error Handeling later on
        const userId = await getCurrentUserId()

        const newTask = await tasksCore.createTask({userId, title})

        revalidatePath("/tasks")
        return {success: true, task: newTask}
    } catch (error) {
        return handleActionError(error)
    }

}

// READ - Get all tasks from the current user
export async function getTasks() {
    const userId = await getCurrentUserId()

    const userTasks = await tasksCore.getTasks({userId: userId})

    return {success: true, tasks: userTasks}
}

// READ - Recover a task by it id
export async function getTaskById(taskId: string) {
    const userId = await getCurrentUserId()

    const taskFound = await tasksCore.getTaskById({taskId: taskId, userId: userId})

    return {success: true, task: taskFound }
}

// UPDATE - Update a task title
export async function updateTask(taskId: string, title: string) {
    const userId = await getCurrentUserId()

    const updated = await tasksCore.updateTask({userId: userId, taskId: taskId, title})

    revalidatePath("/tasks")
    return {success: true, task: updated}
}

// DELETE - Remove a task (with all his todos by cascade)
export async function deleteTask(taskId: string) {
    const userId = await getCurrentUserId()

    await tasksCore.deleteTask({taskId: taskId, userId: userId})

    revalidatePath("/tasks")
    return {success: true}
}


