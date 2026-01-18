import { z } from "zod";
import {tasksTable, todosTable} from "@/drizzle/schema";
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';

/**
 * TODO : REDACT
 * UTILISE LA DB (crée par mon schema) Pour créer mes Modèles ZOD de données en backend
 * SERVENT A VALIDER LES DONNES QUI VIENNENT DE l'EXTERIEUR (UI & API)
 * Schemas au RUNTIME
 * Validation + Types
 */

// TODO : Review this with @Raph to validate this approach or not
// ToDo : AutoGenerate zod Schemas -> Documentation : https://orm.drizzle.team/docs/zod?utm_source=chatgpt.com#select-schema
// ================================================================
// Generate Zod schemas from Drizzle ORM schemas.
// Inferred Types from drizzle schemas, to create ui zod schemas
// Zod fills the gap between server & ui.
// Inference reflects what is written in the schema
// ================================================================
// Often, the best compromise:
//  1) generate from Drizzle
//  2) then adapt a “UI DTO” schema (pick / omit / transform)
//  3) and parse / safeParse the data coming from the DB
//     (NOT REQUIRED, but good practice)
// ================================================================
//
// PATTERN TO BE USER WITH ".parsed"
//
//  const UserInsertSchema = z.object({
//    email: z.string().email(),
//  })
//
//  type UserInsert = z.infer<typeof UserInsertSchema>
//
//  export async function createUser(input: unknown) {
//   const data = UserInsertSchema.parse(input) // runtime security
//   return db.insert(users).values(data)
//  }
//
// ================================================================


// ======================================================
// SCHEMAS ZOD (from Drizzle)
// Schemas are generated with Zod based on the row of the DB
// this avoids to re-type all fields and only do composition
// ======================================================

// 1) Base "row schemas" form Db
const taskSchema = createSelectSchema(tasksTable)
const todoSchema = createSelectSchema(todosTable)

const todoSchemaInsert = createInsertSchema(todosTable)

// Compositions
const taskWithTodosSchema = taskSchema.extend({
    todos: z.array(todoSchema),
})

// ======================================================
// TYPES for internal use (BLL, DAL)
// MODELS have all the properties mirrored from the DB
// ======================================================
export type TaskModel = z.infer<typeof taskSchema>;

export type TodoModel = z.infer<typeof todoSchema>;

export type TaskWithTodoModel = z.infer<typeof taskWithTodosSchema>;

export type TodoInsertModel = z.infer<typeof todoSchemaInsert>;

// ======================================================
// DTO for the UI
// Select wich properties we want to keep and use in the UI
// ======================================================
// 2) DTO components
const taskSchemaDTO = taskSchema.pick({
    id: true,
    title: true,
})

const todoSchemaDTO = todoSchema.pick({
    id: true,
    content: true,
    isDone: true,
    sortPosition: true,
})

// 3) Compose both DTO schemas - Task with Todos list
export const taskWithTodosSchemaDTO = taskSchemaDTO.extend({
    todos: z.array(todoSchemaDTO),
})

// 4) Export the Model Type to use in the UI
export type TaskWithTodosDTO = z.infer<typeof taskWithTodosSchemaDTO>







