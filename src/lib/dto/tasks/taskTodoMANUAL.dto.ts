import { z } from "zod";

// ToDo : This is the approach from the video tutorial, verify if it's waht we want or not
// ================================================================
// Generate Zod schemas from Drizzle ORM schemas.
// Inferred Types from drizzle schemas, to create ui zod schemas
// Zod fills the gap between server & ui.
// Inference reflects what is written in the schema
// ================================================================
// Souvent, le meilleur compromis :
//  1) générer depuis Drizzle
//  2) puis adapter un schéma “UI DTO” (pick/omit/transform)
//  3) et parse / safeParse les données qui sortent de la DB (PAS OBLIGATOIRE, BONNE PRATIQUE)
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

export type todoModel = z.infer<typeof todoSchema>
const todoSchema = z.object({
    isDone: z.boolean().default(false),
    content: z.string().min(1),
    sortPosition: z.number().int()
})


export type  taskModel= z.infer<typeof taskSchema>
const taskSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
})


// Compose Tasks with Todos list
export type taskWithTodos = z.infer<typeof taskWithTodosSchema>
const taskWithTodosSchema = taskSchema.extend({
    todos: z.array(todoSchema),
})




