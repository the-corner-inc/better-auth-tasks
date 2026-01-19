import {boolean, index, integer, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {user} from "./auth-schema"


/**
 * Database schema definition for TASKS and TODOS
 *
 * This files defines :
 * - Table structures in the DB (columns, types, constraints)
 * - Index for query optimisation
 * - Relations for Drizzle's query builder
 *
 * Cardinality Rules (PK & FK):
 *  - 1:N → FK in table "N"
 *  - N:N → intermediary table with 2 FK
 *  - 1:1 → FK + UNIQUE
 */

// ======================================================
// Tables
// ======================================================
// "pgTable" accepts 2-3 args.
// - SQL Table name
// - Columns of the table to be defined
// - Optional : Extraconfig, define indexes and constraints
// ======================================================

export const tasksTable = pgTable(
    // TABLE NAME
    "tasks",
    // COLUMNS
    {
        id: uuid("id").primaryKey().defaultRandom(),                    // PK
        userId: text("user_id").notNull()                               // FK
                // Function "() => user.id" used to avoid circular execution/imports
                // If a user is deleted, deletes his tasks
                .references(() => user.id, {onDelete: "cascade"}),

        title: text("title").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    // EXTRA CONFIG
    // Create a SQL index ont the column "user_id". For optimizations purpose.
    // here, tableTasks is the table object with all properties.
    // Index name is "tasks_user_id_idx" following the convention "<table>_<column>_idx"
    (tableTasks) =>
        [index("tasks_user_id_idx").on(tableTasks.userId)]
)


export const todosTable = pgTable(
    // TABLE NAME
    "todos",
    // COLUMNS
    {
        id: uuid("id").primaryKey().defaultRandom(),                    // PK
        taskId: uuid("task_id").notNull()                               // FK
                .references( () => tasksTable.id, {onDelete: "cascade"} ),

        content: text("content").notNull(),
        isDone: boolean("is_done").notNull().default(false),

        sortPosition: integer("sort_position").notNull().default(0),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    // INDEX and CONSTRAINT
    (tableTodos) =>
        [index ("todos_task_id_idx").on(tableTodos.taskId)]
)

// ======================================================
// Relations
// ======================================================
// Relations : helps Drizzle to understand logic links, and allow easier & typed queries in the backend (via 'with').
// Relations do NOT create or modify anything in SQL (no FK, no constraints).
// ======================================================

export const tasksRelations = relations (
    // Source Table.
    // We describe relations FROM this table point of view.
    tasksTable,

    // Callback that receives helpers
    // - one(...)  -> N:1 or 1:1 relation (source table holds the FK)
    // - many(...) -> 1:N        relation (FK is stored in the target table)
    ({one, many}) => ({

            // RELATION : TASKS N-->1 USER
            // A task belongs to ONE user
            // The FK is stored in the "tasks" table (tasks.userId)
            user: one(user, {
                fields: [tasksTable.userId], // FK - column from source table (tasks)
                references: [user.id]   // PK - coulmn from reference table (user)
            }),

            // RELATION : TASKS 1-->N TODOs
            // A task can be linked to MANY todos
            // The FK is stored in the "todos" table (todos.taskId)
            todos: many(todosTable)
    }),
)

export const todosRelations = relations(
    // Source Table
    todosTable,

    ({one}) => ({
        // RELATION : TODOs N-->1 TASKS
        task: one(tasksTable, {
           fields: [todosTable.taskId],  // FK - column from source table (todos)
           references: [tasksTable.id]   // PK - coulmn from reference table (tasks)
        }),
    })
)

export const userTaskRelations = relations(
    // Source Table
    user,

    ({many}) => ({
        // RELATION : USER 1-->N TASKS
        tasks: many(tasksTable),
    })
)
