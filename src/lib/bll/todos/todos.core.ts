import * as todosRepo from "@/lib/dal/todos.repository"
import * as tasksRepo from "@/lib/dal/tasks.repository"

/**
 * BLL (Business Logic Layer)
 *
 * Responsibilities:
 * - Business rules (validation, not-found checks)
 * - Throws errors (good for tests and error handling)
 * - Make the DAL calls
 *
 * Constraints:
 * - No Next.js imports (to keep it testable)
 * - No direct database access
 * - No cross-core communication (loops)
 */

// ======================================================
// Public : Use Cases
// ======================================================
export async function createTodo( params:{ userId: string; taskId: string; content: string })  {

    const content = params.content.trim()
    if(!content)
        throw new Error("Content is required");

    // Verify that the task belongs to the user
    const isTaskFound = tasksRepo.taskExistForUser({userId: params.userId, taskId: params.taskId })
    if (!isTaskFound)
        throw new Error("Task not found");

    // Find the las position of the list to add the todos at the end of it
    const existingTodos = await todosRepo.listTodosByTaskId(params.taskId);
    const maxPosition =
        existingTodos.length > 0
            ? Math.max(...existingTodos.map((t) => t.sortPosition)) + 1
            : 0;

    // Insert the new value into the db
    return todosRepo.insertTodo({
        taskId: params.taskId,
        content,
        sortPosition: maxPosition
    })
}

export async function updateTodoContent(params: { userId: string; todoId: string; content: string }) {
    const content = params.content.trim()

    if(!content)
        throw new Error("Content is required and can not be empty");

    await assertTodoBelongs ({userId:params.userId, todoId:params.todoId})

    const updated = await todosRepo.updateTodo({todoId:params.todoId, data:{content}})

    if (!updated)
        throw new Error("No todo found")

    return updated


}

export async function toggleTodo(params: { userId: string; todoId: string }) {

    const todo = await assertTodoBelongs (params)

    const updated = await todosRepo.updateTodo({ todoId:params.todoId, data:{isDone: !todo.isDone}   })

    if(!updated)
        throw new Error("No Todo found")

    return updated
}

export async function deleteTodo(params: { userId: string; todoId: string }) {
    await assertTodoBelongs(params)
    const isDeleted = await todosRepo.deleteTodo(params.todoId)
    if (!isDeleted)
            throw new Error("Todo to delete not found")

}

// ======================================================
// Private : Business Rules
// ======================================================

// Check if the todos belongs to the user, throw errors otherwise
async function assertTodoBelongs(params: { userId: string; todoId: string }) {
    const todo = await todosRepo.findTodoWithTask( params.todoId  )
    if(!todo)
        throw new Error("No todo found")

    const task = await tasksRepo.findTaskWithTodos({userId:params.userId , taskId:todo.taskId})
    if (!task)
        throw new Error("Task not found")
    if (task.userId !== params.userId)
        throw new Error("Acces refused")

    return todo
}


/**
 * MEMO :
 * BLL naming & behavior conventions
 * - listX()   -> returns X[]
 *              Never throws "not found" (empty list is valid)
 *
 * - findX()   -> returns X | null
 *              Never throws (optional result)
 *
 * - getX()    -> returns X
 *              Throws if the entity is not found
 *
 * - updateX() / deleteX()
 *              Throws if the target entity is not found
 *
 * Rule:
 * The BLL must enforce the contract of the use case.
 * Callers should never have to guess if a result can be null or empty.
 */
