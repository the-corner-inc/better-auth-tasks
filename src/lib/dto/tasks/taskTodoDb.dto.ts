import { z } from "zod";
import {tasks, todos} from "@/drizzle/schema";
import {createSelectSchema} from 'drizzle-zod';

/**
 * TODO : What does it do ? Get schemas and make DTO from it ? where do I use it now ? in UI ?
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

// 1) Base "row schemas" form Db
// this avoids to re-type all fields and only do composition
const taskRowSchema = createSelectSchema(tasks)
const todoRowSchema = createSelectSchema(todos)

// 2) DTO components - Select wich values we want to keep and use in the UI
const taskSchemaDTO = taskRowSchema.pick({
    id: true,
    title: true,
})

const todoSchemaDTO = todoRowSchema.pick({
    id: true,
    content: true,
    isDone: true,
    sortPosition: true,
})

// 3) Compose both schemas - Task with Todos list
export const taskWithTodosSchemaDTO = taskSchemaDTO.extend({
    todos: z.array(todoSchemaDTO),
})

// 4) Export the Model Type to use in the UI
export type TaskWithTodosModel = z.infer<typeof taskWithTodosSchemaDTO>






