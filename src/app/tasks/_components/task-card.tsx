"use client"

import {useRouter} from "next/navigation";
import {deleteTodo, toggleTodo} from "@/lib/business_layer/todos.service";
import {deleteTask} from "@/lib/business_layer/tasks.service";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CheckCircle, Trash2} from "lucide-react";
import type {TaskWithTodosModel} from "@/lib/dto/tasks/taskTodoGENERATED.dto"; // import "type" avoids to break the bundle between server & client side


// ======================================================
// Task Card - Functions & Render
// ======================================================

export function TaskCard({ task }: {task: TaskWithTodosModel}) {
    const router = useRouter()

    const completedCount = task.todos.filter(t => t.isDone).length
    const totalCount = task.todos.length

    const handleToggle = async (todoId: string) => {
        await toggleTodo(todoId)
        router.refresh()
    }

    const handleDeleteTodo = async (todoId: string) => {
        await deleteTodo(todoId)
        router.refresh()
    }

    const handleDeleteTask = async () => {
        await deleteTask(task.id)
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
                {totalCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                        {completedCount}/{totalCount} completed
                    </p>
                )}
            </CardHeader>
            <CardContent>
                {
                    task.todos.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                            No Todo
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {task.todos.map( (todo) => (
                                <li key={todo.id} className="flex items-center gap-2 group">
                                    <button
                                        onClick={() => handleToggle(todo.id)}
                                        className="hover:scale-110 transition-transform"
                                    >
                                        {todo.isDone ? (
                                            <CheckCircle className="h-5 w-5 text-green-500"/>
                                        ) : (
                                            <CheckCircle className="h-5 w-5 text-muted-foreground"/>
                                        )}
                                    </button>
                                    <span className={`flex-1 text-sm ${
                                        todo.isDone ? "line-through text-muted-foreground" : ""
                                    }`}>
                                        {todo.content}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </li>
                            ) )}
                        </ul>
                    )
                }
            </CardContent>
        </Card>
    )

}