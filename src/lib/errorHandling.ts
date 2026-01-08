//ToDo : implement Later

// Value used as a return value, so the caller knows if it's a success or not
export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: AppError };

// Describes and pass the error
export type AppError =
    | { code: "VALIDATION"; message: string; field?: string }
    | { code: "CONFLICT"; message: string; field?: string };