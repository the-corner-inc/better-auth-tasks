"use server"

import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {db} from "@/drizzle/db";
import {tasks, todos} from "@/drizzle/schema";
import { and } from "drizzle-orm";
import {eq} from "drizzle-orm/sql/expressions/conditions";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";


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
// CRUD TODOS
// ======================================================

// CREATE - Add a todos to a task
export async function createTodo(taskId: string, content: string) {
    const userId = await getCurrentUserId()

    // 1) Verify that the task belongs to the user
    const task = await db.query.tasks.findFirst({
        where: and(eq(tasks.id, taskId), eq(tasks.userId, userId))
    })

    if(!task){
        throw new Error("Task not found.")
    }

    // 2) Find the las position of the list to add the todos at the end of it
    const existingTodos = await db.query.todos.findMany({
        where: eq(todos.taskId, taskId),
    })

    const maxPosition = existingTodos.length > 0
        ? Math.max(...existingTodos.map( t => t.sortPosition)) + 1
        : 0

    // 3) Insert the new value into the db
    const [newTodo] = await db.insert(todos).values({
        content,
        taskId,
        sortPosition: maxPosition,
    }).returning()

    // 4) refresh page and return result
    revalidatePath("/tasks")
    return {success: true, todo: newTodo}
}

// UPDATE - Change a todos
export async function updateTodoContent(todoId: string, content: string) {
    const [updated] = await db.update(todos)
                        .set({content, updatedAt: new Date() }) //Todo : Date or TimeStamp ?
                        .where(eq(todos.id, todoId))
                        .returning()

    revalidatePath("/tasks")
    return {success: true, todo: updated}
}

// UPDATE - Toggle isDone
export async function toggleTodo(todoId: string) {

    // 1) First, get the state of the todos
    const todo = await db.query.todos.findFirst({
                                                    where: eq(todos.id, todoId),
    })

    if (!todo)
    {
        throw new Error("No todo found.")
    }

    // 2) Toggle the value and update the database
    const [updated] = await db.update(todos)
                                .set({isDone: !todo.isDone, updatedAt: new Date()}) // ToDo : Date or timestamp ?
                                .where(eq(todos.id, todoId))
                                .returning()

    revalidatePath("/tasks")
    return {success: true, todo: updated}
}

// DELETE - Remove a todos
export async function deleteTodo(todoId: string) {
    await db.delete(todos).where(eq(todos.id, todoId))

    revalidatePath("/tasks")
    return {success: true}
}