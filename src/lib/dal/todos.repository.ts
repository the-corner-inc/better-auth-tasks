import {db} from "@/drizzle/db";
import {todosTable} from "@/drizzle/schema";
import {eq} from "drizzle-orm/sql/expressions/conditions";
import {TodoModel} from "@/lib/dto/tasks/taskTodoDb.dto";


/**
 * DAL (Data Access Layer)
 * - Drizzle ORM only (Database Acces)
 * - No business logic
 * - No auth / no Next.js imports
 * - Returns XModel | undefined
 */
export async function listTodosByTaskId(taskId: string) : Promise<TodoModel[]>  {
    return db.query.todosTable.findMany({
        where: eq(todosTable.taskId, taskId)
    })
}

export async function insertTodo(params: { taskId: string; content: string; sortPosition: number }) : Promise<TodoModel> {
    const [row] = await db.insert(todosTable)
                            .values({
                                taskId: params.taskId,
                                content: params.content,
                                sortPosition: params.sortPosition
                            })
                            .returning()
    return row
}

export async function updateTodo(params: {todoId: string , data: {content?:string, isDone?: boolean}}  ) : Promise<TodoModel | undefined> {
    const [row] = await db.update(todosTable)
                            .set({ ...params.data , updatedAt: new Date() })
                            .where( eq(todosTable.id , params.todoId))
                            .returning();
    return row
}

export async function findTodoWithTask(todoId: string) : Promise<TodoModel | undefined> {
    return db.query.todosTable.findFirst({
        where: eq(todosTable.id, todoId),
        with: { task: true },
    });
}

export async function deleteTodo(todoId: string) : Promise <boolean> {
    const result = await db.delete(todosTable).where(eq(todosTable.id , todoId));
    return result.rowCount !== 0
}

/**
 * Memo on return Types :
 * findX     → Promise <X | undefined>
 * findListX → Promise <X[]>             (can be an empty array)
 * updateX   → Promise <X | undefined>
 * insertX   → Promise <X>               (it has to exist ot throw DB)
 * deleteX   → Promise <boolean>
 */