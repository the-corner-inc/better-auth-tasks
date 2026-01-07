import {db} from "@/drizzle/db";
import {tasks, todos} from "@/drizzle/schemas/task-schema";
import {session} from "@/drizzle/schemas/auth-schema";
import {eq} from "drizzle-orm/sql/expressions/conditions";


// create a task with todos
const newTask = await db.insert(tasks).values({
    title: 'Demain',
    username: session.userId
}).returning()

await db.insert(todos).values([
    {content: "Acheter du lait", taskId: newTask[0].id},
    {content: "Acheter un chat", taskId: newTask[0].id},
])



// Récuperer les tasks d'un user avec leurs todos
const userTasks = await db.query.tasks.findMany({
    where: eq(tasks.userId, session.userId),
    with: {
        todos: true,
    }
})

// Marquer un todo_ comme fait
await db.update(todos)
    .set({isDone: true})
    .where(eq(tasks.userId, session.userId))
