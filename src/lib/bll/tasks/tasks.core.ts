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

export async function createTask (params: { userId: string, title: string }) {
    const title = verifyTitle(params.title)
    return await tasksRepo.insertTask({userId: params.userId, title: title})
}

export async function getTasks (params: { userId: string }) {
    return tasksRepo.listTasksWithTodos({userId: params.userId})
}

export async function getTaskById (params: {userId: string, taskId: string}) {
    const task = await tasksRepo.findTaskWithTodos({userId: params.userId, taskId: params.taskId})

    if(!task)
        throw new Error("Task not found")

    return task
}

export async function updateTask (params: {userId: string, taskId: string, title: string}) {
    const title = verifyTitle(params.title)

    const updated = await tasksRepo.updateTaskTitle({userId: params.userId, taskId: params.taskId, title: title})

    if(!updated)
        throw new Error(`Task not found`)

    return updated
}

export async function deleteTask ( params: {userId: string, taskId: string}) {
    const isDeleted = await tasksRepo.deleteTask(params)
    if (!isDeleted)
        throw new Error("Task to delete not found")
}

// ======================================================
// Private : Business Rules
// ======================================================
function verifyTitle (title: string) : string {
    const trimmedTitle = title.trim()
    if (!trimmedTitle)
        throw new Error("Title can not be empty")

    return trimmedTitle
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



