"use client"

import {useRouter} from "next/navigation";
import {createTodo, deleteTodo, toggleTodo} from "@/lib/bll/todos/todos.actions";
import {deleteTask} from "@/lib/bll/tasks/tasks.actions";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CheckCircle, Circle, Plus, Trash2} from "lucide-react";
import type {TaskWithTodosDTO} from "@/lib/entities/datamodels";  // import "type" avoids to break the bundle between server & client side
import {useState} from "react";
import { Input } from "@/components/ui/input"


// ======================================================
// Task Card - Functions / Render
// ======================================================
export function TaskCard({ task }: {task: TaskWithTodosDTO}) {

    // Hooks
    const [newTodoContent, setNewTodoContent] = useState<string>("")
    const [isAdding, setIsAdding] = useState<boolean>(false)

    // Variables
    const router = useRouter()
    const completedCount = task.todos.filter(t => t.isDone).length
    const totalCount = task.todos.length

    // Functions
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

    const handleAddTodo = async () => {
        if (newTodoContent.trim()) {
            await createTodo(task.id, newTodoContent)
            setNewTodoContent("")
            setIsAdding(true)
            router.refresh();
        }
    }

    // Render
    return (
        <Card className="hover: shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                        {task.title}
                    </CardTitle>
                    {/* Button "+" and Trash */}
                    <div className="flex gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => setIsAdding(true)}
                        >
                            <Plus className="h4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={ handleDeleteTask }
                        >
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>

                </div>
                {totalCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                        {completedCount}/{totalCount} completed
                    </p>
                )}
            </CardHeader>
            <CardContent>
                {/* Input to add a todos when "+" is clicked */}
                {
                    isAdding && (
                        <div className="flex gap-2 mb-3">
                            <Input
                                placeholder="New todo..."
                                value={newTodoContent}
                                onChange={(e) => setNewTodoContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddTodo()
                                    if (e.key === "Escape") setIsAdding(false)
                                }}
                                autoFocus
                            />
                            <Button size="sm" onClick={handleAddTodo}>
                                Add
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                                x
                            </Button>

                        </div>
                    )
                }
                {
                    task.todos.length === 0 && !isAdding ? (
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
                                            <Circle className="h-5 w-5 text-muted-foreground"/>
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