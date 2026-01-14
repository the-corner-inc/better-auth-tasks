import {db} from "@/drizzle/db";
import {tasks} from "@/drizzle/schema";
import {and, eq} from "drizzle-orm/sql/expressions/conditions";

/**
 * DAL (Data Access Layer)
 * - Drizzle ORM only (Database Acces)
 * - No business logic
 * - No auth / no Next.js imports
 */

export async function insertTask (params: {userId: string, title: string}) {
    const [row] = await db.insert(tasks).values({
                            title: params.title,
                            userId: params.userId
    }).returning()
    return row
}

export async function listTasksWithTodos (params: {userId: string})  {
    return await db.query.tasks.findMany({
        where: eq(tasks.userId, params.userId),
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
}

export async function findTaskWithTodos (params: {taskId: string, userId: string}) {
    return db.query.tasks.findFirst({
        where: and(
            eq(tasks.id, params.taskId),
            eq(tasks.userId, params.userId)),
        with: {
            todos: {
                orderBy: (todos, {asc}) =>
                    [asc(todos.sortPosition)],
            }
        }
    })
}

export async function updateTaskTitle (params: {taskId: string, userId: string, title: string}) {
    const [row] = await db
        .update(tasks)
        .set({title: params.title, updatedAt: new Date()})
        .where( and(
            eq(tasks.id, params.taskId) ,
            eq(tasks.userId, params.userId) ) )
        .returning()
    return row;
}

export async function deleteTask (params: { taskId: string, userId: string }) : Promise<boolean> {
    const result = await db
        .delete(tasks)
        .where( and(
            eq(tasks.id, params.taskId) ,
            eq(tasks.userId, params.userId)  ) )
    return result.rowCount !== 0
}

export async function deleteAllTasks (params: {userId: string}) {
    await db
        .delete(tasks)
        .where( eq(tasks.userId, params.userId) )
}