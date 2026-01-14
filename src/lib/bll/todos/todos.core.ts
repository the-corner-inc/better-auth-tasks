import * as todosRepo from "@/lib/dal/todos.repository"

/**
 * BLL (Business Logic Layer)
 * - No Next.js runtime imports (keep testable)
 * - Applies business rules (validation, not-found checks)
 * - Calls DAL repositories
 */

// ======================================================
// Public : Use Cases
// ======================================================



// ======================================================
// Private : Business Rules
// ======================================================

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
