import { z } from "zod";
import {tasksTable, todosTable} from "@/drizzle/schema";
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';

// TODO : Review this with @Raph to validate this approach or not
/**
 * Models and DTOs for Tasks and Todos
 *
 * This file contains :
 * - Zod schema auto-generated from Drizzle (source of truth)
 * - Model types for internal use (BLL / DAL)
 * - DTO types for UI consumption
 *
 * Responsibilities :
 * - Schemas : Can validate  data when the app runs. Has functions like ".parse(data)" that returns validated data or throws an error
 * - Types : Are used for the Compile-Time, to have the IDE autocomplete & type checking while coding
 *
 * Documentation :
 * https://orm.drizzle.team/docs/zod
 */

// ================================================================
// BASE ZOD SCHEMAS (from Drizzle - single source of truth)
// ================================================================
// Schemas are generated with Zod based on the row of the DB
// this avoids to re-type all fields and only do composition
// ================================================================

// 1) Base "row schemas" from Db
const taskSchema = createSelectSchema(tasksTable)
const todoSchema = createSelectSchema(todosTable)

const todoSchemaInsert = createInsertSchema(todosTable)

// Compositions
const taskWithTodosSchema = taskSchema.extend({
    todos: z.array(todoSchema),
})

// ================================================================
// MODELS TYPES for internal use (BLL, DAL) - Full database rows
// ================================================================

export type TaskModel = z.infer<typeof taskSchema>;

export type TodoModel = z.infer<typeof todoSchema>;

export type TaskWithTodosModel = z.infer<typeof taskWithTodosSchema>;

export type TodoInsertModel = z.infer<typeof todoSchemaInsert>;

// ================================================================
// DTOs SCHEMAS & TYPES (for UI - filtered properties)
// ================================================================
// Select wich properties we want to keep and use in the UI.
// A good practice for those DTOs, is to "parse / safeParse" EXTERNAL sources (UI forms, API requests) //Todo : implement later
// ================================================================
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

// 4) Export the DTO Type to use in the UI
export type TaskWithTodosDTO = z.infer<typeof taskWithTodosSchemaDTO>







