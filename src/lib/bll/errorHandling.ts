//ToDo : implement Later
/**
 * Handles Actions / UI boundary
 * - It's job is to transform a internal error (throw) into a ....? TODO
 * - not used in the BLL. BLL throws business errors. ex "throw new Error("ACCESS_DENIED")"
 */
// Value used as a return value, so the caller knows if it's a success or not
export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: AppError };

// Describes and pass the error
export type AppError =
    | { code: "VALIDATION"; message: string; field?: string }
    | { code: "CONFLICT"; message: string; field?: string };

// Map the BLL errors used
export function handleActionError(error: unknown) {
    if (error instanceof Error) {
        switch (error.message) {
            case "TASK_NOT_FOUND":
                return {success: false, error: "TASK_NOT_FOUND"};

            case "TITLE_EMPTY":
                return {success: false, error: "TITLE_EMPTY"};

            case "ACCESS_DENIED":
                return {success: false, error: "ACCESS_DENIED"}
        }
    }

    console.error(error)
    return {success: false, error: "UNKNOWN_ERROR"};
}