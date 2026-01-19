import {db} from "@/drizzle/db";
import {tasksTable} from "@/drizzle/schema";
import {and, eq} from "drizzle-orm/sql/expressions/conditions";
import {TaskModel, TaskWithTodosModel} from "@/lib/entities/datamodels";

/**
 * DAL (Data Access Layer)
 *
 * Responsibilities:
 * - Database Acces (Drizzle ORM)
 * - Build Query and execute them
 *
 * Constraints:
 * - Returns raw data (Model Types)
 * - No business logic
 * - no authentication (better-auth)
 * - no Next.js imports
 */

// ======================================================
// CRUD Operations
// ======================================================
export async function insertTask (params: {userId: string, title: string}) : Promise<TaskModel> {
    const [row] = await db.insert(tasksTable).values({
                            title: params.title,
                            userId: params.userId
    }).returning()
    return row
}

export async function listTasksWithTodos (params: {userId: string}) : Promise<TaskWithTodosModel[]>  {
    return await db.query.tasksTable.findMany({
        where: eq(tasksTable.userId, params.userId),
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

export async function findTaskWithTodos (params: {taskId: string, userId: string}) : Promise<TaskWithTodosModel | undefined> {
    return db.query.tasksTable.findFirst({
        where: and(
            eq(tasksTable.id, params.taskId),
            eq(tasksTable.userId, params.userId)),
        with: {
            todos: {
                orderBy: (todos, {asc}) =>
                    [asc(todos.sortPosition)],
            }
        }
    })
}

export async function updateTaskTitle (params: {taskId: string, userId: string, title: string}) : Promise<TaskModel | undefined> {
    const [row] = await db
        .update(tasksTable)
        .set({title: params.title, updatedAt: new Date()})
        .where( and(
            eq(tasksTable.id, params.taskId) ,
            eq(tasksTable.userId, params.userId) ) )
        .returning()
    return row;
}

export async function deleteTask (params: { taskId: string, userId: string }) : Promise<boolean> {
    const result = await db
        .delete(tasksTable)
        .where( and(
            eq(tasksTable.id, params.taskId) ,
            eq(tasksTable.userId, params.userId)  ) )
    return result.rowCount !== 0
}

export async function deleteAllTasks (params: {userId: string}) : Promise<boolean> {
    const result = await db
        .delete(tasksTable)
        .where( eq(tasksTable.userId, params.userId) )
    return result.rowCount !== 0
}


// ======================================================
// Query Helpers
// ======================================================
export async function taskExistForUser (params: {userId: string, taskId: string}) : Promise<boolean> {
    const task = await db.query.tasksTable.findFirst({
        where: and(
            eq(tasksTable.id, params.taskId),
            eq(tasksTable.userId, params.userId) ),
        // Check only if this row exist in the DB, not the full Tasks row data. Faster.
        columns: {id: true}
    })
    return task != null
}

/**
 * Memo on return Types :
 * findX     → Promise <X | undefined>
 * findListX → Promise <X[]>             (can be an empty array)
 * updateX   → Promise <X | undefined>
 * insertX   → Promise <X>               (it has to exist ot throw DB)
 * deleteX   → Promise <boolean>
 */