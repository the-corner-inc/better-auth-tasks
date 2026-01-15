"use client"

import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowLeft, ArrowUp, CheckCircle, Circle, Database, Eraser, Plus, RefreshCw, Trash2} from "lucide-react";
import { Input } from "@/components/ui/input"
import { seedData, clearAllTasks } from "@/lib/bll/seedClearTasks/seedClearTasks.actions";
import { getTasks, createTask, deleteTask } from "@/lib/bll/tasks/tasks.actions";
import { createTodo, toggleTodo, deleteTodo } from "@/lib/bll/todos/todos.actions";
import Link from "next/link";


export default function TestPage() {

    // Hooks - Allows to re-render the composant with the new values
    // 1) Stores the new alue
    // 2) Flag the composant as dirty
    // 3) Throws a new render of it (could happen at any time, so good that it stores the value)
    const [result, setResult] = useState<string>("") // Result : typically for messages of success / error
    const [tasks, setTasks] = useState<any[]>([])
    const [newTaskTitle, setNewTaskTitle] = useState<string>("")
    const [newTodoContent, setNewTodoContent] = useState<string>("")
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Generic wrapper to execute an async action (server action)
    const runAction = async (name: string, action: () => Promise<any>) => {
        setLoading(true)
        setResult(`Loading ${name}...`)
        try {
            const res = await action()
            setResult(`Succes for ${name} :\n${JSON.stringify(res, null, 2)}`)
        } catch (error: any) {
            setResult(`Error for ${name} :\n${error.message}`)
        }
        setLoading(false)
    }

    // Fetches all tasks from the database (via getTasks) and updates the UI
    const loadTasks = async () => {
        setLoading(true)
        try {
            const promise = await getTasks()
            const data = promise.tasks
            setTasks(data)
            setResult(`Succes ${data.length} tasks loaded`)
        } catch (error: any) {
            setResult(`Error: ${error.message}`)
        }
        setLoading(false)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Link href="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4 mr-2"/>
                Back to Home
            </Link>
            <br/>
            <Link href="/tasks" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4 mr-2"/>
                Back to Tasks
            </Link>
            <h1 className="text-3xl font-bold">🧪 Test CRUD Tasks</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                    <CardDescription>Seed, Clear, Refresh</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2 flex-wrap">
                    <Button onClick={() => runAction("Seed", seedData)} disabled={loading}>
                        <Database className="mr-2 h-4 w-4" />
                        Seed Test Data
                    </Button>
                    <Button variant="destructive" onClick={() => runAction("Clear", clearAllTasks)} disabled={loading}>
                        <Eraser className="mr-2 h-4 w-4" />
                        Clear All
                    </Button>
                    <Button variant="outline" onClick={loadTasks} disabled={loading}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Tasks
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Créer une Task</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Input
                        placeholder="Titre de la task..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <Button
                        onClick={async () => {
                            if (newTaskTitle.trim()) {
                                await runAction("Create Task", () => createTask(newTaskTitle))
                                setNewTaskTitle("")
                                loadTasks()
                            }
                        }}
                        disabled={loading || !newTaskTitle.trim()}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Créer
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tasks ({tasks.length})</CardTitle>
                    <CardDescription>Cliquez sur une task pour ajouter des todos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {tasks.length === 0 ? (
                        <p className="text-muted-foreground">Aucune task. Cliquez sur "Seed Test Data".</p>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                    selectedTaskId === task.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                }`}
                                onClick={() => setSelectedTaskId(task.id)}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold">{task.title}</h3>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={async (e) => {
                                            e.stopPropagation()
                                            await runAction("Delete Task", () => deleteTask(task.id))
                                            loadTasks()
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="space-y-1 ml-4">
                                    {task.todos?.map((todo: any) => (
                                        <div key={todo.id} className="flex items-center gap-2 text-sm">
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation()
                                                    await toggleTodo(todo.id)
                                                    loadTasks()
                                                }}
                                            >
                                                {todo.isDone ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </button>
                                            <span className={todo.isDone ? "line-through text-muted-foreground" : ""}>
                                                {todo.content}
                                            </span>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation()
                                                    await deleteTodo(todo.id)
                                                    loadTasks()
                                                }}
                                                className="ml-auto text-red-500"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {selectedTaskId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Ajouter un Todo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Input
                            placeholder="Contenu du todo..."
                            value={newTodoContent}
                            onChange={(e) => setNewTodoContent(e.target.value)}
                        />
                        <Button
                            onClick={async () => {
                                if (newTodoContent.trim() && selectedTaskId) {
                                    await runAction("Create Todo", () => createTodo(selectedTaskId, newTodoContent))
                                    setNewTodoContent("")
                                    loadTasks()
                                }
                            }}
                            disabled={loading || !newTodoContent.trim()}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Console</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-64">
                        {result || "Les résultats s'afficheront ici..."}
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}