"use client"

import z from "zod";
import {useRouter} from "next/navigation";
import {deleteTodo, toggleTodo} from "@/lib/business_layer/crudTodos";
import {deleteTask} from "@/lib/business_layer/crudTasks";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";

// ======================================================
// Infered Types from drizzle schemas
// ======================================================
type  taskData= z.infer<typeof taskSchema>
const taskSchema = z.object({
    title: z.string().min(1),
})

type todoData = z.infer<typeof todoSchema>
const todoSchema = z.object({
    isDone: z.boolean().default(false),
    content: z.string().min(1),
    sortPosition: z.number().int()
})

// ======================================================
// Task Card - Functions & Render
// ======================================================

export function TaskCard({ task }: {task: taskData}) {
    const router = useRouter()

    const handleToggle = async (todoId: string) => {
        await toggleTodo(todoId)
        router.refresh()
    }

    const handleDeleteTodo = async (todoId: string) => {
        await deleteTodo(todoId)
        router.refresh()
    }

    const handleDeleteTask = async () => {
        //await deleteTask(task.id)
        //Todo !
        router.refresh()
    }

    return (
        <Card className="hover: shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                        {task.title}
                    </CardTitle>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={ handleDeleteTask }
                    >
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>

            </CardContent>
        </Card>
    )

}