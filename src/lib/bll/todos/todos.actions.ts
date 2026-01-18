"use server"

import * as todosCore from "@/lib/bll/todos/todos.core"
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {getCurrentUserId} from "@/lib/auth/session";


/**
 * Next.js Server Actions - Interface with UI
 * - Entry point for the UI layer
 * - Place to call "use server"
 * - Handles auth, cache revalidation and data shaping (returns)
 * - Delegates business rules to the BLL
 */

// TODO : use ".parse" or ".safeParse" with "taskWithTodosSchemaDTO" to verify data
// ======================================================
// UI Server Actions
// ======================================================

// CREATE - Add a todos to a task
export async function createTodo(taskId: string, content: string) {
    const userId = await getCurrentUserId()

    const newTodo = await todosCore.createTodo ({userId:userId, taskId:taskId, content:content})

    revalidatePath("/tasks")
    return {success: true, todo: newTodo}
}

// UPDATE - Change a todos
export async function updateTodoContent(todoId: string, content: string) {
    const userId = await getCurrentUserId()

    const updated = await todosCore.updateTodoContent({ userId:userId, todoId:todoId , content:content })

    revalidatePath("/tasks")
    return {success: true, todo: updated}
}

// UPDATE - Toggle isDone
export async function toggleTodo(todoId: string) {

    const userId = await getCurrentUserId()

    const updated = await todosCore.toggleTodo({userId:userId, todoId:todoId})


    revalidatePath("/tasks")
    return {success: true, todo: updated}
}

// DELETE - Remove a todos
export async function deleteTodo(todoId: string) {
    const userId = await getCurrentUserId()

    await todosCore.deleteTodo ({userId:userId, todoId:todoId})

    revalidatePath("/tasks")
    return {success: true}
}